// src/grpc/startGrpcServer.js
const grpc = require('@grpc/grpc-js');
const loadProto = require('./loader');
const uploadService = require('./services/upload.grpc');
const paymentService = require('./services/payment.grpc');
const config = require("../config/config");

function startGrpcServer() {
  const server = new grpc.Server();

  const proto = loadProto('upload.proto');
  const paymentProto = loadProto('chatbot.proto');

  server.addService(proto.upload.UploadService.service, uploadService);

  server.addService(paymentProto.payment.Greeter.service, paymentService);

  const PORT = `0.0.0.0:${config.development.urlPortServerGrpc}`;

  server.bindAsync(PORT, grpc.ServerCredentials.createInsecure(), () => {
    console.log(`🚀 gRPC Server running at ${PORT}`);
  });
}

module.exports = startGrpcServer;
