#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CdkgluetablePartitionStack } from '../lib/cdkgluetable-partition-stack';

const app = new cdk.App();
new CdkgluetablePartitionStack(app, 'barrie-gluetablePartitionStack');
