const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const loadProto = (protoFile) => {
  const packageDefinition = protoLoader.loadSync(
    path.join(__dirname, '../../proto', protoFile),
    {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
    }
  );

  return grpc.loadPackageDefinition(packageDefinition);
};

module.exports = loadProto;
