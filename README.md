# NestJs × postgres × drizzle-orm × Debezium × Kafka

## Docker起動
`docker-compose up -d`
※設定は`compose.yml`参照

## drizzleの設定

##### 関連パッケージについて
`@knaadh/nestjs-drizzle-postgres drizzle-orm postgres drizzle-kit`が必要
Docker起動時に`npm install`するので対応不要

##### .envにDB接続情報を記載
`DATABASE_URL=postgresql://user:password@db:5432/app`

##### スキーマ情報を作成(./src/db/schema.ts)
```
import { pgTable, serial, varchar } from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
  id: serial().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
});
```

##### drizzleの設定を作成（./drizzle.config.ts）
```
import { defineConfig } from "drizzle-kit";
import 'dotenv/config';

export default defineConfig({
  schema: "./src/db/schema.ts", // スキーマファイルのパス
  out: "./drizzle", // Migrationファイルの出力先ディレクトリ
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!, // データベース接続URL
  },
});
```

##### Migration作成コマンドを実行
スキーマファイル (schema.ts など) を読み取り、以前のマイグレーションと比較して差分を検出し、対応する SQL マイグレーションファイルを生成する
`npx drizzle-kit generate`

##### Migration実行
`npx drizzle-kit migrate`

## Debeziumの設定

##### DebeziumとPostgreSQLコネクタの設定
コネクタ作成用APIのパラメタをJsonで定義
`docker/debezium/connector.json`
```
{
  "name": "postgres-connector", // このコネクタの名前。Kafka Connect REST API で識別するための一意な名称。
  "config": {
    "connector.class": "io.debezium.connector.postgresql.PostgresConnector", // 使用するコネクタクラス。PostgreSQL 用の Debezium コネクタを指定。
    "tasks.max": "1", // 並列に実行するタスク数の最大値。基本は 1 で OK（単一 DB の場合）。
    "database.hostname": "db", // 接続先の PostgreSQL のホスト名（Docker コンテナ名で OK）。
    "database.port": "5432", // PostgreSQL のポート番号。
    "database.user": "replicator", // レプリケーション用ユーザー名。PostgreSQL 側で REPLICATION 権限が必要。
    "database.password": "password", // 上記ユーザーのパスワード。
    "database.dbname": "app", // 接続する PostgreSQL のデータベース名。
    "plugin.name": "pgoutput", // PostgreSQL で使用される Logical Decoding プラグインの名前。 通常は PostgreSQL 10+ では "pgoutput"。設定と PostgreSQL 側の `wal_level = logical` が必要。
    "topic.prefix": "app" // Kafka トピック名のプレフィックス。例: "app.public.users" のようなトピックが作成される。
  }
}
```

##### コネクタ作成APIを実行
`curl -X POST -H "Content-Type: application/json" -d @./docker/debezium/connector.json http://localhost:8083/connectors`
コネクタが設定されるとDebeziumがDBの変更を検知しKafkaにメッセージを送るようになる。

##　疎通確認

##### 作成したテーブルにINSERT
作成したUser作成APIを使用
`curl -X POST -H "Content-Type: application/json" http://localhost:3333/user -d '{"name":"TEST"}'`

##### Kafkaのコンテナに接続
`docker exec -it broker1 /bin/bash`

##### メッセージを取得
```
[containerId]:/$ /opt/kafka/bin/kafka-console-consumer.sh \
--bootstrap-server broker1:9092 \
--topic app.public.user \
--from-beginning
```
メッセージがKafkaに送られていることを確認
schema(スキーマ情報) + payload(テーブル更新情報)のデータになっている
```
{
	"schema": {
		"type": "struct",
		"fields": [
			{
				"type": "struct",
				"fields": [
					{
						"type": "int32",
						"optional": false,
						"default": 0,
						"field": "id"
					},
					{
						"type": "string",
						"optional": false,
						"field": "name"
					}
				],
				"optional": true,
				"name": "app.public.user.Value",
				"field": "before"
			},
			{
				"type": "struct",
				"fields": [
					{
						"type": "int32",
						"optional": false,
						"default": 0,
						"field": "id"
					},
					{
						"type": "string",
						"optional": false,
						"field": "name"
					}
				],
				"optional": true,
				"name": "app.public.user.Value",
				"field": "after"
			},
			{
				"type": "struct",
				"fields": [
					{
						"type": "string",
						"optional": false,
						"field": "version"
					},
					{
						"type": "string",
						"optional": false,
						"field": "connector"
					},
					{
						"type": "string",
						"optional": false,
						"field": "name"
					},
					{
						"type": "int64",
						"optional": false,
						"field": "ts_ms"
					},
					{
						"type": "string",
						"optional": true,
						"name": "io.debezium.data.Enum",
						"version": 1,
						"parameters": {
							"allowed": "true,last,false,incremental"
						},
						"default": "false",
						"field": "snapshot"
					},
					{
						"type": "string",
						"optional": false,
						"field": "db"
					},
					{
						"type": "string",
						"optional": true,
						"field": "sequence"
					},
					{
						"type": "int64",
						"optional": true,
						"field": "ts_us"
					},
					{
						"type": "int64",
						"optional": true,
						"field": "ts_ns"
					},
					{
						"type": "string",
						"optional": false,
						"field": "schema"
					},
					{
						"type": "string",
						"optional": false,
						"field": "table"
					},
					{
						"type": "int64",
						"optional": true,
						"field": "txId"
					},
					{
						"type": "int64",
						"optional": true,
						"field": "lsn"
					},
					{
						"type": "int64",
						"optional": true,
						"field": "xmin"
					}
				],
				"optional": false,
				"name": "io.debezium.connector.postgresql.Source",
				"field": "source"
			},
			{
				"type": "string",
				"optional": false,
				"field": "op"
			},
			{
				"type": "int64",
				"optional": true,
				"field": "ts_ms"
			},
			{
				"type": "int64",
				"optional": true,
				"field": "ts_us"
			},
			{
				"type": "int64",
				"optional": true,
				"field": "ts_ns"
			},
			{
				"type": "struct",
				"fields": [
					{
						"type": "string",
						"optional": false,
						"field": "id"
					},
					{
						"type": "int64",
						"optional": false,
						"field": "total_order"
					},
					{
						"type": "int64",
						"optional": false,
						"field": "data_collection_order"
					}
				],
				"optional": true,
				"name": "event.block",
				"version": 1,
				"field": "transaction"
			}
		],
		"optional": false,
		"name": "app.public.user.Envelope",
		"version": 2
	},
	"payload": {
		"before": null,
		"after": {
			"id": 4,
			"name": "TEST"
		},
		"source": {
			"version": "2.6.2.Final",
			"connector": "postgresql",
			"name": "app",
			"ts_ms": 1745311032428,
			"snapshot": "false",
			"db": "app",
			"sequence": "[\"26790576\",\"26790968\"]",
			"ts_us": 1745311032428283,
			"ts_ns": 1745311032428283000,
			"schema": "public",
			"table": "user",
			"txId": 756,
			"lsn": 26790968,
			"xmin": null
		},
		"op": "c",
		"ts_ms": 1745311032981,
		"ts_us": 1745311032981685,
		"ts_ns": 1745311032981685200,
		"transaction": null
	}
}
```