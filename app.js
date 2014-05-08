var express = require('express');
var app = express();


app.get('/hello', function(req, res){
  res.send('hello from node@3000 port');
});

var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});

var io = require('socket.io').listen(server);

//setting the default view 
//app.set('name',value);
app.set('view',__dirname+'/tpl');


//register the template engine
//sysntax - app.engine(ext, callback);
app.engine('jade',require('jade').__express);


//app.use([path], function)
//Use the given middleware function, with optional mount path, defaulting to  "/"




