import * as cdk from "@aws-cdk/core";
import * as s3 from "@aws-cdk/aws-s3";
import * as glue from "@aws-cdk/aws-glue";

export class CdkgluetablePartitionStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    const PREFIX_NAME = id.toLocaleLowerCase().replace('stack', '');
    const S3_DATA_DIR = "data";
    const GLUE_DATABASE_ARN = "arn:aws:glue:ap-northeast-1:000000:database/default";
      
    const bucket = new s3.Bucket(this, "bucket", {
      bucketName: PREFIX_NAME + '-bucket'
    });
    
    const database = glue.Database.fromDatabaseArn(
      this,
      "database",
      GLUE_DATABASE_ARN
    );

    const table = new glue.Table(this, "table", {
      database: database,
      tableName: PREFIX_NAME + '-table',
      columns: [
        {
          name: "id",
          type: glue.Schema.INTEGER,
        },
        {
          name: "created",
          type: glue.Schema.TIMESTAMP,
        },
        {
          name: "name",
          type: glue.Schema.STRING,
        },
        {
          name: "pcs",
          type: glue.Schema.INTEGER,
        }
      ],
      partitionKeys: [
        {
          name: "sku",
          type: glue.Schema.SMALL_INT
        }, {
          name: "dt",
          type: glue.Schema.DATE
        }
      ],
      dataFormat: glue.DataFormat.JSON,
      bucket: bucket,
      s3Prefix: S3_DATA_DIR,
    });
  }
}