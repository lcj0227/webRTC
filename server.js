//监听服务器
var express = require('express');
var app = express();
var https = require('https');
var fs = require('fs');
var pk = fs.readFileSync('./privatekey.pem');
var pc = fs.readFileSync('./certificate.pem');
var opts = {
  key:pk,
  cert:pc
};
var server = https.createServer(opts,app);
var SkyRTC = require('skyrtc').listen(server);
var path = require("path");

var port = 2000;
server.listen(port);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
	res.sendfile(__dirname + '/index.html');
});

//新用户与服务器建立WebSocket连接时触发
SkyRTC.rtc.on('new_connect', function(socket) {//socket——新建立的WebSocket连接实例
	console.log('创建新连接');
});
//用户关闭连接后触发
SkyRTC.rtc.on('remove_peer', function(socketId) {
	console.log(socketId + "用户离开");
});
//用户加入房间后触发
SkyRTC.rtc.on('new_peer', function(socket, room) {//socket——用户使用的WebSocket连接实例    room——房间名称
  console.log("新用户" + socket.id + "加入房间" + room);
});
//客户端向服务器端发送消息，且非自定义事件格式时触发
SkyRTC.rtc.on('socket_message', function(socket, msg) {
	console.log("接收到来自" + socket.id + "的新消息：" + msg);
});
//接收到ice candidate信令时触发
SkyRTC.rtc.on('ice_candidate', function(socket, ice_candidate) {
	console.log("接收到来自" + socket.id + "的ICE Candidate");
});
//接收到offer信令时触发
SkyRTC.rtc.on('offer', function(socket, offer) {
	console.log("接收到来自" + socket.id + "的Offer");
});
//接收到answer信令时触发
SkyRTC.rtc.on('answer', function(socket, answer) {
	console.log("接收到来自" + socket.id + "的Answer");
});
//接收到error信令时触发
SkyRTC.rtc.on('error', function(error) {
	console.log("发生错误：" + error.message);
});
