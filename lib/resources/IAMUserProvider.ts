

import { ResourceProvider, ResourceContext } from '@aws-quickstart/eks-blueprints';
import { Config } from '../config/Config';
import { IUser, User } from "aws-cdk-lib/aws-iam";

export class IAMUserProvider implements ResourceProvider<IUser> {
  cfg: Config;
  constructor(cfg: Config) {
    this.cfg = cfg;
  }
  provide(context: ResourceContext): IUser {
    if (this.cfg.iamUser) {
      return User.fromUserName(context.scope, 'adminUser', this.cfg.iamUser);
    }
    return null!;
  }
}