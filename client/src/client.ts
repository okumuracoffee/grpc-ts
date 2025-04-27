import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';

const PROTO_PATH = path.resolve(__dirname, '../../proto/greeter.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition) as any;
const greeter = protoDescriptor.greeter;

function main() {
  const client = new greeter.GreeterService(
    'grpc-server:50051',  // ※サーバーのサービス名
    grpc.credentials.createInsecure()
  );

  // --- Unary呼び出し
  const unaryRequest = { name: '田中太郎' };
  client.SayHello(unaryRequest, (err: grpc.ServiceError | null, response: any) => {
    if (err) {
      console.error('Unaryエラー:', err);
      return;
    }
    console.log('Unaryレスポンス:', response.message);
  });

  // --- Server Streaming呼び出し
  const streamRequest = { name: '田中太郎' };
  const call = client.SayHelloStream(streamRequest);

  call.on('data', (response: any) => {
    console.log('ストリームデータ受信:', response.message);
  });

  call.on('end', () => {
    console.log('ストリーム受信完了');
  });

  call.on('error', (err: grpc.ServiceError) => {
    console.error('ストリームエラー:', err);
  });
}

main();