import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';

// protoファイルのパス
const PROTO_PATH = path.resolve(__dirname, '../../proto/greeter.proto');

// protoファイルを読み込む
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition) as any;

// GreeterServiceを取り出す
const greeter = protoDescriptor.greeter;

// メイン処理
function main() {
  // サーバーに接続（サーバーのアドレスとポートを指定）
  const client = new greeter.GreeterService(
    'grpc-server:50051', // サーバーアドレス（docker-composeの場合はサービス名でもOK）
    grpc.credentials.createInsecure() // 今回は認証なし
  );

  // リクエストデータ
  const request = { name: '田中太郎' };

  // SayHello RPCを呼び出す
  client.SayHello(request, (err: grpc.ServiceError | null, response: any) => {
    if (err) {
      console.error('エラー:', err);
      return;
    }
    console.log('サーバーからの応答:', response.message);
  });
}

main();