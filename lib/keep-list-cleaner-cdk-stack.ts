import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import { PythonFunction } from '@aws-cdk/aws-lambda-python-alpha';
import * as cdk from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import * as path from 'node:path';

const requiredEnvVars = ['GOOGLE_EMAIL', 'GOOGLE_MASTER_TOKEN', 'KEEP_NOTE_ID'];

export class KeepListCleanerCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    for (const envVar of requiredEnvVars) {
      if (!process.env[envVar]) {
        throw new Error(`Missing required environment variable: ${envVar}`);
      }
    }

    const keepListCleanerFn = new PythonFunction(this, 'KeepListCleanerLambda', {
      functionName: 'KeepListCleanerLambda',
      runtime: lambda.Runtime.PYTHON_3_13,
      handler: 'handler',
      entry: path.join(__dirname, 'lambda-handler'),
      index: 'keep_list_cleaner.py',
      timeout: cdk.Duration.seconds(10),
      environment: {
        'GOOGLE_EMAIL': process.env.GOOGLE_EMAIL || '',
        'GOOGLE_MASTER_TOKEN': process.env.GOOGLE_MASTER_TOKEN || '',
        'KEEP_NOTE_ID': process.env.KEEP_NOTE_ID || ''
      }
    });

    const rule = new events.Rule(this, 'KeepListCleanerRule', {
      schedule: events.Schedule.rate(cdk.Duration.hours(1)),
    });
    rule.addTarget(new targets.LambdaFunction(keepListCleanerFn));
  }
}
