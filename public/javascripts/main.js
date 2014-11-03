var socket = io.connect();

socket.on('info',function(data){
	//#tb1 + = 'td '+data.usd
	console.log(data);
});