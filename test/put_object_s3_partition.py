import boto3
from faker import Faker
import json
import random
from datetime import datetime, timedelta

fake = Faker()
client = boto3.client('s3')

rid = 1

for sku in range(1, 5):
  for i1 in range(24 * 5):
    lines = []
    created = datetime.fromisoformat("2020-01-01") + timedelta(hours=i1)
    for i2 in range(100):
      line = {
        'id': rid, 
        'sku': sku, 
        'created': created.isoformat(sep=' '), 
        'action': random.choice(('ship', 'arrive', 'consume', 'dump', 'gave', 'move', 'lose')), 
        'pcs': random.randint(1, 100),
      }
      lines.append(json.dumps(line))
      rid += 1
    key = 'data/sku={sku}/dt={dt}/{sku}-{dt}-{batch}.json'.format(sku=sku, dt=created.date().isoformat(), batch=created.hour)
    client.put_object(
      Body='\n'.join(lines),
      Bucket='cdkgluetablepartition-bucket',
      Key=key,
    )
