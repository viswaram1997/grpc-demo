

var PROTO_PATH = __dirname + '/protos/route_guide.proto';

var fs = require('fs');
var parseArgs = require('minimist');
var path = require('path');
var _ = require('lodash');
var grpc = require('grpc');
var protoLoader = require('@grpc/proto-loader');
var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });
var routeguide = grpc.loadPackageDefinition(packageDefinition).routeguide;


async function  getOrderDetails(point) {  

  let result =  await new Promise((resolve,reject)=>{
    setTimeout(()=>{   
     resolve({ orderName:'viswa' })
      }, 3000);
  }) 
  return result 
}


async function GetOrderInfo(call, callback) {
  let result = await getOrderDetails(call.request)
  callback(null,result);
}


function GetOrderListInfo (call) {

  let orderId  = call.request.orderId

   _.each(orderId, function(order) {
      call.write({ orderName:`viswa${order}` })
  });

  call.end()

  } 

function getServer() {
  var server = new grpc.Server();
  server.addProtoService(routeguide.RouteGuide.service, {
    GetOrderInfo: GetOrderInfo,  
    GetOrderListInfo:GetOrderListInfo,
    dispatch:(...res)=>{console.log(res)}
  });
  return server;
}


  var routeServer = getServer();
  routeServer.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure());
 

    routeServer.start();
 


