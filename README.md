# gRPC TypeScript Docker版 開発環境セットアップ

このリポジトリは、docker compose up -dするだけで
- gRPCサーバー (serverコンテナ)
- gRPCクライアント (clientコンテナ)
が自動起動し、gRPC通信テストが実行される環境を提供します。

## セットアップ手順

```
docker compose up --build
```

クライアントログに
```
Response: Hello, World!
```
が出れば成功です！
