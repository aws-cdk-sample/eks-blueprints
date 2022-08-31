import { ResourceContext, ResourceProvider } from "@aws-quickstart/eks-blueprints";
import { Vpc, IVpc } from 'aws-cdk-lib/aws-ec2';


/**
 * 是
 */
export class ExistingVpcProvider implements ResourceProvider<IVpc> {

  region: string;
  vpcId: string;
  constructor(region: string, vpcId: string) {
    this.region = region;
    this.vpcId = vpcId;
  }
  provide(context: ResourceContext): IVpc {
    return Vpc.fromLookup(context.scope, "customVpc", {
      region: this.region,
      vpcId: this.vpcId
    });
  }
}
