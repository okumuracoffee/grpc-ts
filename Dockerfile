# Node.jsのLTSバージョンを使う（20系）
FROM node:20

# protocインストール
RUN apt-get update && apt-get install -y unzip curl && \
    curl -OL https://github.com/protocolbuffers/protobuf/releases/download/v21.12/protoc-21.12-linux-x86_64.zip && \
    unzip protoc-21.12-linux-x86_64.zip -d /usr/local && \
    rm protoc-21.12-linux-x86_64.zip

WORKDIR /usr/src/app

# 依存ファイルだけコピーして、パッケージインストール
COPY package*.json ./

# 必要なパッケージをすべて入れる
RUN npm install \
    && npm install --save-dev typescript ts-node \
    && npm install -g grpc-tools grpc_tools_node_protoc_ts

# プロジェクトソースをコピー
COPY . .

# デフォルトコマンド
CMD [ "bash" ]
