const grpc = require('@grpc/grpc-js');
const loadProto = require('../loader');
const config = require("../../config/config");

const { GRPC_HOST } = config;

function getNestedService(obj, path) {
  return path.split('.').reduce((o, k) => (o && o[k] ? o[k] : undefined), obj);
}

function createGrpcClient(protoFile, servicePath, host = `${GRPC_HOST}`) {
  const proto = loadProto(protoFile);
  const Service = getNestedService(proto, servicePath);

  if (!Service) {
    throw new Error(`Service "${servicePath}" not found in ${protoFile}`);
  }

  return new Service(host, grpc.credentials.createInsecure());
}

const snackClient = createGrpcClient('snacks.proto', 'snack.SnackService');
const notificationClient = createGrpcClient('noti.proto', 'notification.NotificationService');
const discountClient = createGrpcClient('discounts.proto', 'discount.DiscountService');

module.exports = { snackClient, notificationClient, discountClient };
