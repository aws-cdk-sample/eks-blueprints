export interface Config {
  readonly region: string;
  readonly appName: string;
  readonly accountId: string;
  readonly env: string;
  readonly vpcCidr: string,
  readonly k8sVersion: string,


  readonly ec2SSHKey?: string;
  readonly iamUser?: string;

  readonly customVpc?: any;

  readonly mainInstanceTypes?: string[];
  readonly ebsCsiDriver?: any;

  // https://aws-quickstart.github.io/cdk-eks-blueprints/api/interfaces/addons.AwsLoadBalancerControllerProps.html
  readonly awsLoadBalancerController?: any;
  readonly karpenter?: any;

  readonly awsForFluentBit?: any;
  readonly metricsServer?: any;


}
