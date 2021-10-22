import * as cdk from "@aws-cdk/core";
import * as s3 from "@aws-cdk/aws-s3";
import * as glue from "@aws-cdk/aws-glue";

export class CdkgluetablePartitionStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    const PREFIX_NAME = id.toLocaleLowerCase().replace('stack', '');
    const S3_DATA_DIR = "data";
    const GLUE_DATABASE_ARN = "arn:aws:glue:ca-central-1:657887547478:database/glue-workflow-db";
      
    const bucket = new s3.Bucket(this, "bucket", {
      bucketName: PREFIX_NAME + '-bucket',
      encryption: s3.BucketEncryption.KMS_MANAGED,
			publicReadAccess: false,
			blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
			enforceSSL: true,
			versioned: true,
			removalPolicy: cdk.RemovalPolicy.DESTROY,
			autoDeleteObjects: false
    });
    
    const database = glue.Database.fromDatabaseArn(
      this,
      "database",
      GLUE_DATABASE_ARN
    );

    const table = new glue.Table(this, "table", {
      database: database,
      tableName: PREFIX_NAME + '_table', // Athena doesn't support -.
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
          name: "action",
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