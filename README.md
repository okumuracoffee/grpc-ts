ここに書くべき内容をすぐ用意しました👇

# gRPC 4通信方式 実装プロジェクト (TypeScript)

このプロジェクトは、gRPCの4つの基本通信方式をTypeScriptで実装したものです。

## 実装している通信方式

- Unary RPC
- Server Streaming RPC
- Client Streaming RPC
- Bidirectional Streaming RPC

## ファイル構成

grpc-ts/ ├── client/ # クライアント実装 │ └── src/ │ └── client.ts ├── server/ # サーバー実装 │ └── src/ │ └── server.ts ├── proto/ # gRPCプロトコル定義 │ └── greeter.proto ├── docker-compose.yml # 開発用Docker構成 ├── Readme.md # このファイル


## 起動方法

1. プロジェクトルートで以下を実行

```bash
docker compose down
docker compose up --build

    サーバー・クライアントが自動で起動し、全通信方式が動作確認できます。

ポイント

    Unary RPC：単発のリクエスト・レスポンス

    Server Streaming RPC：リクエスト1回に対してレスポンス複数回

    Client Streaming RPC：リクエスト複数回に対してレスポンス1回

    Bidirectional Streaming RPC：リクエスト・レスポンス両方がストリームで流れる