import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

export class HelloCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const metricStat =
      cdk.aws_lambda.Function.metricAllErrors().toMetricConfig().metricStat;

    const cfnAlarm = new cdk.aws_cloudwatch.CfnAlarm(this, "anomalyDetectionMathAlarm", {
      alarmName: "anomaly-detection-math-alarm",
      metrics: [
        {
          id: "ad1",
          expression: "ANOMALY_DETECTION_BAND(me1, 2)",
          returnData: true,
        },
        {
          id: "me1",
          expression: "IF(m1 > 10, m1, 0)",
          returnData: true,
        },
        {
          id: "m1",
          metricStat: {
            metric: {
              metricName: metricStat?.metricName,
              namespace: metricStat?.namespace,
              dimensions: metricStat?.dimensions,
            },
            period: cdk.Duration.minutes(5).toSeconds(),
            stat: cdk.aws_cloudwatch.Stats.SUM,
          },
          returnData: false,
        },
      ],
      datapointsToAlarm: 5,
      evaluationPeriods: 5,
      comparisonOperator:
        cdk.aws_cloudwatch.ComparisonOperator.GREATER_THAN_UPPER_THRESHOLD,
      thresholdMetricId: "ad1",
    });
  }
}
