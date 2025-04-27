import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';

// protoファイルのパス
const PROTO_PATH = path.resolve(__dirname, '../../proto/greeter.proto');

// protoファイルをNode.js用に読み込む
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
// gRPCサーバーで使える形にする
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition) as any;

// GreeterServiceを取り出す
const greeter = protoDescriptor.greeter;

// サーバー実装	クライアントからのリクエストを受け取って、レスポンスを返す
// --- Unary通信のSayHello
function sayHello(
  call: grpc.ServerUnaryCall<any, any>,
  callback: grpc.sendUnaryData<any>
) {
  const name = call.request.name;
  console.log(`受信: name=${name}`);
  callback(null, { message: `こんにちは、${name}さん！` });
}

// --- Server Streaming通信のSayHelloStream
function sayHelloStream(
  call: grpc.ServerWritableStream<any, any>
) {
  const name = call.request.name;
  console.log(`ストリーミング開始: name=${name}`);

  let count = 0;
  const intervalId = setInterval(() => {
    count++;
    const message = `こんにちは、${name}さん！ [${count}]`;
    console.log(`送信: ${message}`);
    call.write({ message }); // ←1回送信！

    if (count >= 5) { // 5回送ったら終了
      clearInterval(intervalId);
      call.end(); // ストリームを終了！
      console.log('ストリーミング終了');
    }
  }, 1000); // 1秒に1回送る
}

// gRPCサーバーを作る
function main() {
  const server = new grpc.Server();
  // サーバーにRPCサービス（GreeterService）を登録する
  server.addService(greeter.GreeterService.service, { 
    SayHello: sayHello,
    SayHelloStream: sayHelloStream, 
  });
  // サーバーを指定ポートで待ち受け開始
  server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
    server.start();
    console.log('gRPCサーバー起動: 0.0.0.0:50051');
  });
}

main();
