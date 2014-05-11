var express =  require('express');
var app 	=	express();
var port 	= 3000;


//set the view folder
app.set('views',__dirname+'/tpl');
//allocating scripts folder 
app.use('/script', express.static(__dirname + '/script'));
//allocating css folder 
app.use('/css', express.static(__dirname + '/css'));
//allocating image folder 
app.use('/image', express.static(__dirname + '/image'));

app.set('view engine','jade');
//jade engine needs a call back
//use is a method to configure the middleware used by the routes of the Express HTTP server object.
// The method is defined as part of Connect that Express is based upon
//http://stackoverflow.com/questions/11321635/node-js-express-what-is-app-use
//not sure what this actually means 
app.engine('jade', require('jade').__express);

app.get('/',function(req,res){
	res.render('index');
});
var users = new Array();

var io = require('socket.io').listen(app.listen(port));

io.sockets.on('connection', function (socket) {

	console.log(socket.id);
	io.sockets.emit('newuser',users);
	//emmiting to every users who is connected
	socket.emit('welcome', { message: 'welcome to the chat' });
	
	//adding a new user
	socket.on('newuser',function(data){
		users['helo']= socket;
		io.sockets.emit('newuser',users);
	})
	
	//send from the clints
	socket.on('send', function (data) {
		io.sockets.emit('message', data);
	});
 	
 });




