# Create EKS cluster using cdk

使用 cdk 创建 EKS 集群

This sample depends on [Amazon EKS Blueprints](https://aws-quickstart.github.io/cdk-eks-blueprints).

You can build your EKS cluster using configuration options in `cdk.context.json`.

请首先修改配置文件 `cdk.context.json`。每个插件的开关可以选择打开。

相同 region，不同环境下的 `appName` 请配置成不一样的值，否则会覆盖。

appName 一经配置，请不要随意修改，因为修改之后会变成 另一个 cdk stack。

## How to run

运行方法

查询

```shell
cdk ls -c env=<your-config>
```

部署（新建，更新）

```shell
cdk deploy -c env=<your-config>
```

如果是新 region，运行报错，请按照提示运行：

```shell
cdk bootstrap -c env=<your-config>
```

删除

```shell
cdk destroy -c env=<your-config>
```

- 请注意，删除集群需要提前释放 k8s 资源，某些条件下会导致无法删除集群，如 ingress。

## Addons 已经集成的插件

### 说明

集群的默认的 node 已经配置成 arm 机型，并设置为 BOTTLEROCKET_ARM_64 系统。（此处请自行修改。）

### VPC

配置节点：

```json
{
  "customVpc": {
    "vpcId": "vpc-xxxxxx"
  }
}
```

可以使用已经存在的 VPC，配置 `customVpc` 节点，指定 `vpcId`。不配置 `customVpc` 会创建新的 VPC(10.0.0.0/16) 和子网。

如果使用已有 VPC，必须创建 public subnet 和 private subnet，并满足如下条件：

> - 给公有子网添加标签 `aws-cdk:subnet-type=Public, kubernetes.io/role/elb=1`
> - 给私有子网添加标签 `aws-cdk:subnet-type=Private, kubernetes.io/role/internal-elb=1`
> - 私有子网需要添加 NAT 网关（安装 helm 插件需要外网）
> - 调试过程中，会在 `cdk.context.json` 中产生cache，错误修正后，请删除 cache 节点 (类似 `vpc-provider:account=01234:filter.vpc-id=vpc-xxxx:region=us-east-2:returnAsymmetricSubnets=true`)。

### AwsLoadBalancerControllerAddOn

这个是创建 Ingress 和 LoadBalancer 必备插件。nginx ingress controller 也依赖此插件。

创建公网的 Ingress 的时候，有时候域名不通，可以检查如下设置：

- alb 的子网有可能被分配私有子网，需要修改成公网，改成公网需要稍等片刻才能生效。
- 检查子网的 Tag `kubernetes.io/role/elb` 和 `kubernetes.io/role/internal-elb`。

### EbsCsiDriverAddOn

符合 CSI 标准的 EBS 挂盘必备。

## 验证 EKS 安装

首先更新本地 kubeconfig，当前的 IAM 用户对此集群有 master 权限。

```shell
aws eks update-kubeconfig --region <your-region> --name  <your-appName>
```

安装基础资源

```shell
kubectl apply -f ./eks-install-verify/base-app.yaml
```

### 验证 AwsLoadBalancerControllerAddOn

创建公网 Ingress

```shell
kubectl apply -f ./eks-install-verify/ingress-pub.yaml
```

### 清理资源

```shell
kubectl delete ns poc
```
