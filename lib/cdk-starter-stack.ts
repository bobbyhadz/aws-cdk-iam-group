import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';

export class CdkStarterStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 👇 create an IAM group
    const group = new iam.Group(this, 'group-id', {
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEC2ReadOnlyAccess'),
      ],
    });

    console.log('group name 👉', group.groupName);
    console.log('group arn 👉', group.groupArn);

    // 👇 add managed policy to a group
    group.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName(
        'service-role/AWSLambdaBasicExecutionRole',
      ),
    );

    // 👇 add an inline policy to a group
    group.addToPolicy(
      new iam.PolicyStatement({
        actions: ['logs:CreateLogGroup', 'logs:CreateLogStream'],
        resources: ['*'],
      }),
    );

    // 👇 attach an inline policy on the group
    group.attachInlinePolicy(
      new iam.Policy(this, 'cw-logs', {
        statements: [
          new iam.PolicyStatement({
            effect: iam.Effect.DENY,
            actions: ['logs:PutLogEvents'],
            resources: ['*'],
          }),
        ],
      }),
    );

    // 👇 create IAM User
    const user = new iam.User(this, 'user-id');

    // 👇 add the User to the group
    group.addUser(user);

    // 👇 import existing Group
    // const externalGroup = iam.Group.fromGroupArn(
    //   this,
    //   'external-group-id',
    //   `arn:aws:iam::${cdk.Stack.of(this).account}:group/YOUR_GROUP_NAME`,
    // );
  }
}
