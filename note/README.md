+++
title = "GlueでパーティショニングされたAthena用テーブルを作る"
date = "2021-03-21"
tags = ["Glue", "Athena"]
+++

![img](/img/2021/03/cdkgluetable-partition.png)

Athenaの費用はスキャンするデータサイズに応じたものになる。データサイズが大きいと処理にかかる時間も長くなる。またS3のリクエストやデータ転送の費用もかかる。

このスキャンされるデータ量を減らすには、検索の条件に使うフィールドをパーティショニングしておく、という手があるということでそれを作ってみた。

Athenaといってもテーブルを作るのはGlueに作る。

[Githubのリポジトリ](https://github.com/suzukiken/cdkgluetable-partition)

実行するとcdkgluetablepartition_tableという名前のテーブルが作られ、
skuとdtがパーティショニングされる。

パーティショニングした場合、S3のバケットの中はこんな構造にする必要がある。

![img](/img/2021/03/partitioned.png)

Athenaのクエリでこんな風にパーティションを指定すると、そのデータだけがスキャン対象になる。
```
SELECT sum(pcs) FROM cdkgluetablepartition_table where sku=2 and dt=cast('2020-01-01' as date);
```

なお注意点として、もしも先にデータがあって、後からテーブルを作った場合、Athenaでクエリをしても`Zero records returned.`となるが、これは[MSCK REPAIR TABLE](https://docs.aws.amazon.com/athena/latest/ug/msck-repair-table.html)で直すことができる。

```
MSCK REPAIR TABLE cdkgluetablepartition_table;
```


