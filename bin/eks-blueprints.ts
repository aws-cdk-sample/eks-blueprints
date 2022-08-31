#!/usr/bin/env node
import { getConfig } from '../lib/config/tools';
import { Tags, App } from 'aws-cdk-lib';
import * as blueprints from '@aws-quickstart/eks-blueprints';
import { KubernetesVersion, NodegroupAmiType } from 'aws-cdk-lib/aws-eks';
import { InstanceType, Vpc, IVpc } from 'aws-cdk-lib/aws-ec2';
import { IAMUserProvider } from '../lib/resources/IAMUserProvider';
import { IAMMasterAddon } from '../lib/addons/IAMMasterAddon';
import { GlobalResources } from '@aws-quickstart/eks-blueprints';
import { ExistingVpcProvider } from '../lib/resources/ExistingVpcProvider';




const app = new App();
const cfg = getConfig(app);
Tags.of(app).add("App", cfg.appName);
Tags.of(app).add("Environment", cfg.env);


const bp = blueprints.EksBlueprint.builder();


let vpc: IVpc | undefined = undefined;

// console.log("---------")
// console.log(cfg);
// console.log("---------")

if (cfg.customVpc && cfg.customVpc.vpcId && cfg.region) {
    bp.resourceProvider(GlobalResources.Vpc, new ExistingVpcProvider(cfg.region, cfg.customVpc.vpcId));
}

const clusterProvider = new blueprints.GenericClusterProvider({
    version: KubernetesVersion.of(cfg.k8sVersion),
    // vpc: props.vpc,
    managedNodeGroups: [
        {
            id: "system",
            amiType: NodegroupAmiType.BOTTLEROCKET_ARM_64,
            instanceTypes: [new InstanceType("c7g.large")],
            diskSize: 50,
            minSize: 2,
            maxSize: 100,
            remoteAccess: cfg.ec2SSHKey ? {
                sshKeyName: cfg.ec2SSHKey
            } : undefined
        }
    ],
});

const addOns: Array<blueprints.ClusterAddOn> = [
    new blueprints.addons.VpcCniAddOn(),
    new blueprints.addons.CoreDnsAddOn(),
    new blueprints.addons.KubeProxyAddOn(),
];

if (cfg.awsLoadBalancerController && cfg.awsLoadBalancerController.enabled) {
    addOns.push(new blueprints.addons.AwsLoadBalancerControllerAddOn(cfg.awsLoadBalancerController.props));
}

if (cfg.ebsCsiDriver && cfg.ebsCsiDriver.enabled) {
    addOns.push(new blueprints.addons.EbsCsiDriverAddOn());
}

bp.resourceProvider("adminUser", new IAMUserProvider(cfg))
    .clusterProvider(clusterProvider)
    .account(cfg.accountId)
    .region(cfg.region)
    .addOns(...addOns)
    .addOns(new IAMMasterAddon(cfg))
    .build(app, cfg.appName);



// new EksAddonsStack(app, 'EksAddonsStack', cfg, {
//   env: {
//     region: cfg["region"],
//     account: cfg["accountId"],
//   }
// });