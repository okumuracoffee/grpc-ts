// ===============================
// server/src/server.ts
// ===============================
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';

const PROTO_PATH = path.resolve(__dirname, '../../proto/greeter.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition) as any;
const greeter = protoDescriptor.greeter;

function sayHello(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) {
  const name = call.request.name;
  console.log(`Unary受信: name=${name}`);
  callback(null, { message: `こんにちは、${name}さん！` });
}

function sayHelloStream(call: grpc.ServerWritableStream<any, any>) {
  const name = call.request.name;
  console.log(`Server Streaming開始: name=${name}`);
  let count = 0;
  const intervalId = setInterval(() => {
    count++;
    const message = `こんにちは、${name}さん！ [${count}]`;
    console.log(`Server Streaming送信: ${message}`);
    call.write({ message });
    if (count >= 5) {
      clearInterval(intervalId);
      call.end();
      console.log('Server Streaming終了');
    }
  }, 1000);
}

function sayHelloClientStream(call: grpc.ServerReadableStream<any, any>, callback: grpc.sendUnaryData<any>) {
  const names: string[] = [];
  call.on('data', (request) => {
    console.log(`Client Streaming受信: name=${request.name}`);
    names.push(request.name);
  });
  call.on('end', () => {
    const message = `こんにちは、${names.join('さん、')}さん！`;
    console.log(`Client Streamingまとめ応答: ${message}`);
    callback(null, { message });
  });
  call.on('error', (err: grpc.ServiceError) => {
    console.error('Client Streamingエラー:', err);
  });
}

function sayHelloBidirectionalStream(call: grpc.ServerDuplexStream<any, any>) {
  call.on('data', (request) => {
    console.log(`Bidirectional受信: name=${request.name}`);
    const message = `こんにちは、${request.name}さん！`;
    console.log(`Bidirectional応答: ${message}`);
    call.write({ message });
  });
  call.on('end', () => {
    console.log('Bidirectionalストリーム終了');
    call.end();
  });
  call.on('error', (err: grpc.ServiceError) => {
    console.error('Bidirectionalエラー:', err);
  });
}

function main() {
  const server = new grpc.Server();
  server.addService(greeter.GreeterService.service, {
    SayHello: sayHello,
    SayHelloStream: sayHelloStream,
    SayHelloClientStream: sayHelloClientStream,
    SayHelloBidirectionalStream: sayHelloBidirectionalStream,
  });
  server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
      console.error('サーバーバインド失敗:', err);
      return;
    }
    server.start();
    console.log(`gRPCサーバー起動: 0.0.0.0:${port}`);
  });
}

main();