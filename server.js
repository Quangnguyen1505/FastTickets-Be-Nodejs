const app = require('./src/app');
const startGrpcServer = require('./src/grpc/startGrpcServer');
const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{
    console.log(`Server running is port ${PORT}`);
})

startGrpcServer()