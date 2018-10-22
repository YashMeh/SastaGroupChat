var server=require('ws').Server;
var s=new server({port:3000});
const request = require("request")

var name;
s.on('connection',function(ws){
	ws.on('message',function(message){
		message=JSON.parse(message);
		if(message.type=="name")
		{
			ws.personName=message.data;
			return;
		}
		//ws.send(message);
		s.clients.forEach(function(client){
			if(client!=ws){
				client.send(JSON.stringify({
					name:ws.personName,
					data:message.data
				}));
			}
		})
	})


	ws.on("sub",(data)=>{
		request.post("http://localhost:5000/api/check",data,(err,resp,body)=>{
			if(err)
				console.log(err);
			ws.emit("sub",body);
		})
	})

	ws.on('close',function(message){
		console.log("Lost a client")
	})
	console.log("One More Client Connected !!")
})