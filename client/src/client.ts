// ===============================
// client/src/client.ts
// ===============================
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';

const PROTO_PATH = path.resolve(__dirname, '../../proto/greeter.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition) as any;
const greeter = protoDescriptor.greeter;

function main() {
  const client = new greeter.GreeterService(
    'grpc-server:50051',
    grpc.credentials.createInsecure()
  );

  // --- Unary
  client.SayHello({ name: '田中太郎' }, (err: grpc.ServiceError | null, response: any) => {
    if (err) {
      console.error('Unaryエラー:', err);
      return;
    }
    console.log('Unaryレスポンス:', response.message);
  });

  // --- Server Streaming
  const serverStreamCall = client.SayHelloStream({ name: '田中太郎' });
  serverStreamCall.on('data', (response: any) => {
    console.log('Server Streaming受信:', response.message);
  });
  serverStreamCall.on('end', () => {
    console.log('Server Streaming受信完了');
  });
  serverStreamCall.on('error', (err: grpc.ServiceError) => {
    console.error('Server Streamingエラー:', err);
  });

  // --- Client Streaming
  const clientStreamCall = client.SayHelloClientStream((err: grpc.ServiceError | null, response: any) => {
    if (err) {
      console.error('Client Streamingエラー:', err);
      return;
    }
    console.log('Client Streamingレスポンス:', response.message);
  });

  ['佐藤', '鈴木', '高橋', '田中', '伊藤'].forEach((name, index) => {
    setTimeout(() => {
      console.log(`Client Streaming送信: name=${name}`);
      clientStreamCall.write({ name });
      if (index === 4) {
        clientStreamCall.end();
      }
    }, index * 500);
  });

  // --- Bidirectional Streaming
  const bidiCall = client.SayHelloBidirectionalStream();
  ['佐藤', '鈴木', '高橋', '田中', '伊藤'].forEach((name, index) => {
    setTimeout(() => {
      console.log(`Bidirectional送信: name=${name}`);
      bidiCall.write({ name });
      if (index === 4) {
        bidiCall.end();
      }
    }, index * 500);
  });
  bidiCall.on('data', (response: any) => {
    console.log('Bidirectional受信:', response.message);
  });
  bidiCall.on('end', () => {
    console.log('Bidirectionalストリーム受信完了');
  });
  bidiCall.on('error', (err: grpc.ServiceError) => {
    console.error('Bidirectionalエラー:', err);
  });
}

main();