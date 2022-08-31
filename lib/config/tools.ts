import { App } from "aws-cdk-lib";
import { Config } from "./Config";

export function getConfig(app: App): Config {
  let env = app.node.tryGetContext("env");
  if (!env) {
    console.error(`Context parameter 'env' is required, use -c:
cdk -c env=dev ...
    `);

    process.exit();

  }
  let config = app.node.tryGetContext(env);
  if (!config) {
    console.error(`Config '${env}' not found, please check file 'cdk.context.json'`);

    process.exit();
  }

  return {
    region: config["region"],
    appName: config["appName"],
    accountId: config["accountId"],
    env: config["env"],
    k8sVersion: config["k8sVersion"],
    vpcCidr: config["vpcCidr"],
    ec2SSHKey: config["ec2SSHKey"],
    iamUser: config["iamUser"],
    awsLoadBalancerController: config["awsLoadBalancerController"],
    ebsCsiDriver: config["ebsCsiDriver"],
    customVpc: config["customVpc"],
  }

}