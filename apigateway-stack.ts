import cdk = require('@aws-cdk/core');
import ec2 = require('@aws-cdk/aws-ec2');
import ecs = require('@aws-cdk/aws-ecs');
import ecs_patterns = require('@aws-cdk/aws-ecs-patterns');
// import elb = require('@aws-cdk/aws-elasticloadbalancing');
import elbv2 = require('@aws-cdk/aws-elasticloadbalancingv2');
import { TargetType } from '@aws-cdk/aws-elasticloadbalancingv2';
import apigateway = require('@aws-cdk/aws-apigateway');
import { VpcLink } from '@aws-cdk/aws-apigateway';
// import { LoadBalancer } from '@aws-cdk/aws-elasticloadbalancing';

export class ApigatewayStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'VPC1', {maxAzs:2, 
      cidr: "10.1.0.0/16"});
    
    const cluster = new ecs.Cluster(this, 'myCluster', {vpc}); 
     
    // Instantiate Fargate Service with just cluster and image
    const fargateService = new ecs_patterns.NetworkLoadBalancedFargateService(this, "FargateService", {
      cluster,
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
      },
    });
    // Output the DNS where you can access your service
    new cdk.CfnOutput(this, 'LoadBalancerDNS', { value: fargateService.loadBalancer.loadBalancerDnsName });
    
    
    //const lb = new elb.LoadBalancer(this, 'LB', { vpc, internetFacing: true, healthCheck: {port: 80}, });
    
    const nlb = new elbv2.NetworkLoadBalancer(this, 'nlb', {vpc, internetFacing: false});
    const listener = nlb.addListener('Listener', {port: 443});
    listener.addTargets('FargateALB',  {port: 80});

    //let nlbArray = new Array();
    //nlbArray.push(lb2.loadBalancerArn);

    // new cdk.CfnOutput(this, 'ExternalDNS', {
    //   exportName: 'ExternalDNS',
    //   value: lb2.loadBalancerArn
    //  });
    
    // const listener = lb.addListener({ externalPort: 80 });

    // listener.connections.allowDefaultPortFromAnyIpv4('Open to the world');

    const api = new apigateway.RestApi(this, 'temp_API', {deployOptions: {
       loggingLevel: apigateway.MethodLoggingLevel.INFO,
       dataTraceEnabled: true}});

     api.root.addMethod('GET');

    //Create sub links for the 3 API endpoints
    const dev = api.root.addResource('dev')
    dev.addMethod('GET');
    
    const qa1 = api.root.addResource('qa1');
    qa1.addMethod('GET');

    const qa2 = api.root.addResource('qa2');
    qa2.addMethod('GET');

   const vpclink = new VpcLink(this,'myVPCLink', { targets: [nlb]} );

   //vpclink.addTargets(lb2[]);
  //API Key const apikey = new api.addApiKey(this, apigateway.)
  }
}