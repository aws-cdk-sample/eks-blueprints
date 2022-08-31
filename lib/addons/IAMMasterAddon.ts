

import { ClusterInfo, ClusterAddOn } from '@aws-quickstart/eks-blueprints';
import { Config } from '../config/Config';
import { IUser } from "aws-cdk-lib/aws-iam";

export class IAMMasterAddon implements ClusterAddOn {
  cfg: Config;
  constructor(cfg: Config) {
    this.cfg = cfg;
  }
  deploy(clusterInfo: ClusterInfo) {
    if (this.cfg.iamUser) {
      const adminUser: IUser = clusterInfo.getRequiredResource("adminUser");   // cdk.aws_iam.User.fromUserName(app, 'adminUser', cfg.iamUser);
      if (adminUser) {
        clusterInfo.cluster.awsAuth.addUserMapping(adminUser, { groups: ['system:masters'] });
      }
    }
  }
}