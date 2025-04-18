// src/grpc/startGrpcServer.js
const grpc = require('@grpc/grpc-js');
const loadProto = require('./loader');
const uploadService = require('./services/upload.grpc');

function startGrpcServer() {
  const server = new grpc.Server();
  const proto = loadProto('upload.proto');

  server.addService(proto.upload.UploadService.service, uploadService);

  const PORT = '0.0.0.0:8083';

  server.bindAsync(PORT, grpc.ServerCredentials.createInsecure(), () => {
    console.log(`🚀 gRPC Server running at ${PORT}`);
  });
}

module.exports = startGrpcServer;
