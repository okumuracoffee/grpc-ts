FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run generate

CMD ["npm", "run", "start"]
# ベースイメージとしてNode.js公式イメージを使う
FROM node:20

# コンテナ内の作業ディレクトリを設定
WORKDIR /app

# 依存関係（npm packages）だけ先にコピーしてインストール
# キャッシュを効かせるため、先にpackage.jsonとpackage-lock.jsonだけ
COPY package.json package-lock.json ./

# 依存関係をインストール
RUN npm install

# 残りのソースコードをコンテナ内にコピー
COPY . .

# 開発用コマンド（ホットリロード）
# ts-node-devを使って変更即反映できる状態にする
CMD ["npm", "run", "start:dev"]

# ↓本番用にするときはこっちに切り替える
# CMD ["npm", "start"]