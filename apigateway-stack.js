"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cdk = require("@aws-cdk/core");
const ec2 = require("@aws-cdk/aws-ec2");
const ecs = require("@aws-cdk/aws-ecs");
const ecs_patterns = require("@aws-cdk/aws-ecs-patterns");
// import elb = require('@aws-cdk/aws-elasticloadbalancing');
const elbv2 = require("@aws-cdk/aws-elasticloadbalancingv2");
const apigateway = require("@aws-cdk/aws-apigateway");
const aws_apigateway_1 = require("@aws-cdk/aws-apigateway");
// import { LoadBalancer } from '@aws-cdk/aws-elasticloadbalancing';
class ApigatewayStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const vpc = new ec2.Vpc(this, 'VPC1', { maxAzs: 2,
            cidr: "10.0.0.0/16" });
        const cluster = new ecs.Cluster(this, 'myCluster', { vpc });
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
        const nlb = new elbv2.NetworkLoadBalancer(this, 'nlb', { vpc, internetFacing: false });
        const listener = nlb.addListener('Listener', { port: 443 });
        listener.addTargets('FargateALB', { port: 80 });
        //let nlbArray = new Array();
        //nlbArray.push(lb2.loadBalancerArn);
        // new cdk.CfnOutput(this, 'ExternalDNS', {
        //   exportName: 'ExternalDNS',
        //   value: lb2.loadBalancerArn
        //  });
        // const listener = lb.addListener({ externalPort: 80 });
        // listener.connections.allowDefaultPortFromAnyIpv4('Open to the world');
        const api = new apigateway.RestApi(this, 'temp_API', { deployOptions: {
                loggingLevel: apigateway.MethodLoggingLevel.INFO,
                dataTraceEnabled: true
            } });
        api.root.addMethod('GET');
        //Create sub links for the 3 API endpoints
        const dev = api.root.addResource('dev');
        dev.addMethod('GET');
        const qa1 = api.root.addResource('qa1');
        qa1.addMethod('GET');
        const qa2 = api.root.addResource('qa2');
        qa2.addMethod('GET');
        const vpclink = new aws_apigateway_1.VpcLink(this, 'myVPCLink', { targets: [nlb] });
        //vpclink.addTargets(lb2[]);
        //API Key const apikey = new api.addApiKey(this, apigateway.)
    }
}
exports.ApigatewayStack = ApigatewayStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpZ2F0ZXdheS1zdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFwaWdhdGV3YXktc3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxxQ0FBc0M7QUFDdEMsd0NBQXlDO0FBQ3pDLHdDQUF5QztBQUN6QywwREFBMkQ7QUFDM0QsNkRBQTZEO0FBQzdELDZEQUE4RDtBQUU5RCxzREFBdUQ7QUFDdkQsNERBQWtEO0FBQ2xELG9FQUFvRTtBQUVwRSxNQUFhLGVBQWdCLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFDNUMsWUFBWSxLQUFvQixFQUFFLEVBQVUsRUFBRSxLQUFzQjtRQUNsRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxFQUFDLE1BQU0sRUFBQyxDQUFDO1lBQzdDLElBQUksRUFBRSxhQUFhLEVBQUMsQ0FBQyxDQUFDO1FBRXhCLE1BQU0sT0FBTyxHQUFHLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsV0FBVyxFQUFFLEVBQUMsR0FBRyxFQUFDLENBQUMsQ0FBQztRQUUxRCwwREFBMEQ7UUFDMUQsTUFBTSxjQUFjLEdBQUcsSUFBSSxZQUFZLENBQUMsaUNBQWlDLENBQUMsSUFBSSxFQUFFLGdCQUFnQixFQUFFO1lBQ2hHLE9BQU87WUFDUCxnQkFBZ0IsRUFBRTtnQkFDaEIsS0FBSyxFQUFFLEdBQUcsQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFDLDBCQUEwQixDQUFDO2FBQ25FO1NBQ0YsQ0FBQyxDQUFDO1FBQ0gsbURBQW1EO1FBQ25ELElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsaUJBQWlCLEVBQUUsRUFBRSxLQUFLLEVBQUUsY0FBYyxDQUFDLFlBQVksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLENBQUM7UUFHdkcsdUdBQXVHO1FBRXZHLE1BQU0sR0FBRyxHQUFHLElBQUksS0FBSyxDQUFDLG1CQUFtQixDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBQyxHQUFHLEVBQUUsY0FBYyxFQUFFLEtBQUssRUFBQyxDQUFDLENBQUM7UUFDckYsTUFBTSxRQUFRLEdBQUcsR0FBRyxDQUFDLFdBQVcsQ0FBQyxVQUFVLEVBQUUsRUFBQyxJQUFJLEVBQUUsR0FBRyxFQUFDLENBQUMsQ0FBQztRQUMxRCxRQUFRLENBQUMsVUFBVSxDQUFDLFlBQVksRUFBRyxFQUFDLElBQUksRUFBRSxFQUFFLEVBQUMsQ0FBQyxDQUFDO1FBRS9DLDZCQUE2QjtRQUM3QixxQ0FBcUM7UUFFckMsMkNBQTJDO1FBQzNDLCtCQUErQjtRQUMvQiwrQkFBK0I7UUFDL0IsT0FBTztRQUVQLHlEQUF5RDtRQUV6RCx5RUFBeUU7UUFFekUsTUFBTSxHQUFHLEdBQUcsSUFBSSxVQUFVLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsRUFBQyxhQUFhLEVBQUU7Z0JBQ2xFLFlBQVksRUFBRSxVQUFVLENBQUMsa0JBQWtCLENBQUMsSUFBSTtnQkFDaEQsZ0JBQWdCLEVBQUUsSUFBSTthQUFDLEVBQUMsQ0FBQyxDQUFDO1FBRTVCLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRTNCLDBDQUEwQztRQUMxQyxNQUFNLEdBQUcsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUN2QyxHQUFHLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRXJCLE1BQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3hDLEdBQUcsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFckIsTUFBTSxHQUFHLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDeEMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUV0QixNQUFNLE9BQU8sR0FBRyxJQUFJLHdCQUFPLENBQUMsSUFBSSxFQUFDLFdBQVcsRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFDLENBQUUsQ0FBQztRQUVsRSw0QkFBNEI7UUFDN0IsNkRBQTZEO0lBQzdELENBQUM7Q0FDRjtBQTNERCwwQ0EyREMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY2RrID0gcmVxdWlyZSgnQGF3cy1jZGsvY29yZScpO1xuaW1wb3J0IGVjMiA9IHJlcXVpcmUoJ0Bhd3MtY2RrL2F3cy1lYzInKTtcbmltcG9ydCBlY3MgPSByZXF1aXJlKCdAYXdzLWNkay9hd3MtZWNzJyk7XG5pbXBvcnQgZWNzX3BhdHRlcm5zID0gcmVxdWlyZSgnQGF3cy1jZGsvYXdzLWVjcy1wYXR0ZXJucycpO1xuLy8gaW1wb3J0IGVsYiA9IHJlcXVpcmUoJ0Bhd3MtY2RrL2F3cy1lbGFzdGljbG9hZGJhbGFuY2luZycpO1xuaW1wb3J0IGVsYnYyID0gcmVxdWlyZSgnQGF3cy1jZGsvYXdzLWVsYXN0aWNsb2FkYmFsYW5jaW5ndjInKTtcbmltcG9ydCB7IFRhcmdldFR5cGUgfSBmcm9tICdAYXdzLWNkay9hd3MtZWxhc3RpY2xvYWRiYWxhbmNpbmd2Mic7XG5pbXBvcnQgYXBpZ2F0ZXdheSA9IHJlcXVpcmUoJ0Bhd3MtY2RrL2F3cy1hcGlnYXRld2F5Jyk7XG5pbXBvcnQgeyBWcGNMaW5rIH0gZnJvbSAnQGF3cy1jZGsvYXdzLWFwaWdhdGV3YXknO1xuLy8gaW1wb3J0IHsgTG9hZEJhbGFuY2VyIH0gZnJvbSAnQGF3cy1jZGsvYXdzLWVsYXN0aWNsb2FkYmFsYW5jaW5nJztcblxuZXhwb3J0IGNsYXNzIEFwaWdhdGV3YXlTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBjZGsuQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wcz86IGNkay5TdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyh0aGlzLCAnVlBDMScsIHttYXhBenM6MiwgXG4gICAgICBjaWRyOiBcIjEwLjAuMC4wLzE2XCJ9KTtcbiAgICBcbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHRoaXMsICdteUNsdXN0ZXInLCB7dnBjfSk7IFxuICAgICBcbiAgICAvLyBJbnN0YW50aWF0ZSBGYXJnYXRlIFNlcnZpY2Ugd2l0aCBqdXN0IGNsdXN0ZXIgYW5kIGltYWdlXG4gICAgY29uc3QgZmFyZ2F0ZVNlcnZpY2UgPSBuZXcgZWNzX3BhdHRlcm5zLk5ldHdvcmtMb2FkQmFsYW5jZWRGYXJnYXRlU2VydmljZSh0aGlzLCBcIkZhcmdhdGVTZXJ2aWNlXCIsIHtcbiAgICAgIGNsdXN0ZXIsXG4gICAgICB0YXNrSW1hZ2VPcHRpb25zOiB7XG4gICAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KFwiYW1hem9uL2FtYXpvbi1lY3Mtc2FtcGxlXCIpLFxuICAgICAgfSxcbiAgICB9KTtcbiAgICAvLyBPdXRwdXQgdGhlIEROUyB3aGVyZSB5b3UgY2FuIGFjY2VzcyB5b3VyIHNlcnZpY2VcbiAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLCAnTG9hZEJhbGFuY2VyRE5TJywgeyB2YWx1ZTogZmFyZ2F0ZVNlcnZpY2UubG9hZEJhbGFuY2VyLmxvYWRCYWxhbmNlckRuc05hbWUgfSk7XG4gICAgXG4gICAgXG4gICAgLy9jb25zdCBsYiA9IG5ldyBlbGIuTG9hZEJhbGFuY2VyKHRoaXMsICdMQicsIHsgdnBjLCBpbnRlcm5ldEZhY2luZzogdHJ1ZSwgaGVhbHRoQ2hlY2s6IHtwb3J0OiA4MH0sIH0pO1xuICAgIFxuICAgIGNvbnN0IG5sYiA9IG5ldyBlbGJ2Mi5OZXR3b3JrTG9hZEJhbGFuY2VyKHRoaXMsICdubGInLCB7dnBjLCBpbnRlcm5ldEZhY2luZzogZmFsc2V9KTtcbiAgICBjb25zdCBsaXN0ZW5lciA9IG5sYi5hZGRMaXN0ZW5lcignTGlzdGVuZXInLCB7cG9ydDogNDQzfSk7XG4gICAgbGlzdGVuZXIuYWRkVGFyZ2V0cygnRmFyZ2F0ZUFMQicsICB7cG9ydDogODB9KTtcblxuICAgIC8vbGV0IG5sYkFycmF5ID0gbmV3IEFycmF5KCk7XG4gICAgLy9ubGJBcnJheS5wdXNoKGxiMi5sb2FkQmFsYW5jZXJBcm4pO1xuXG4gICAgLy8gbmV3IGNkay5DZm5PdXRwdXQodGhpcywgJ0V4dGVybmFsRE5TJywge1xuICAgIC8vICAgZXhwb3J0TmFtZTogJ0V4dGVybmFsRE5TJyxcbiAgICAvLyAgIHZhbHVlOiBsYjIubG9hZEJhbGFuY2VyQXJuXG4gICAgLy8gIH0pO1xuICAgIFxuICAgIC8vIGNvbnN0IGxpc3RlbmVyID0gbGIuYWRkTGlzdGVuZXIoeyBleHRlcm5hbFBvcnQ6IDgwIH0pO1xuXG4gICAgLy8gbGlzdGVuZXIuY29ubmVjdGlvbnMuYWxsb3dEZWZhdWx0UG9ydEZyb21BbnlJcHY0KCdPcGVuIHRvIHRoZSB3b3JsZCcpO1xuXG4gICAgY29uc3QgYXBpID0gbmV3IGFwaWdhdGV3YXkuUmVzdEFwaSh0aGlzLCAndGVtcF9BUEknLCB7ZGVwbG95T3B0aW9uczoge1xuICAgICAgIGxvZ2dpbmdMZXZlbDogYXBpZ2F0ZXdheS5NZXRob2RMb2dnaW5nTGV2ZWwuSU5GTyxcbiAgICAgICBkYXRhVHJhY2VFbmFibGVkOiB0cnVlfX0pO1xuXG4gICAgIGFwaS5yb290LmFkZE1ldGhvZCgnR0VUJyk7XG5cbiAgICAvL0NyZWF0ZSBzdWIgbGlua3MgZm9yIHRoZSAzIEFQSSBlbmRwb2ludHNcbiAgICBjb25zdCBkZXYgPSBhcGkucm9vdC5hZGRSZXNvdXJjZSgnZGV2JylcbiAgICBkZXYuYWRkTWV0aG9kKCdHRVQnKTtcbiAgICBcbiAgICBjb25zdCBxYTEgPSBhcGkucm9vdC5hZGRSZXNvdXJjZSgncWExJyk7XG4gICAgcWExLmFkZE1ldGhvZCgnR0VUJyk7XG5cbiAgICBjb25zdCBxYTIgPSBhcGkucm9vdC5hZGRSZXNvdXJjZSgncWEyJyk7XG4gICAgcWEyLmFkZE1ldGhvZCgnR0VUJyk7XG5cbiAgIGNvbnN0IHZwY2xpbmsgPSBuZXcgVnBjTGluayh0aGlzLCdteVZQQ0xpbmsnLCB7IHRhcmdldHM6IFtubGJdfSApO1xuXG4gICAvL3ZwY2xpbmsuYWRkVGFyZ2V0cyhsYjJbXSk7XG4gIC8vQVBJIEtleSBjb25zdCBhcGlrZXkgPSBuZXcgYXBpLmFkZEFwaUtleSh0aGlzLCBhcGlnYXRld2F5LilcbiAgfVxufSJdfQ==