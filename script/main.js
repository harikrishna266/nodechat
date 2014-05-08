$(document).ready(function(){
		
	var socket = io.connect('http://localhost:3000');
	
	socket.on('welcome',function(data){
		if(data.message){
			$("#chatinput").append(data.message);
		}
	});

	socket.on('newuser',function(data){
		var table = "";
		$.each(data,function(i,item){
			console.log(item);
			table += '<tr><td>'+item+' <input type="button" class=\'btn btn-success pull-right\' name="user" id=\'send\',value=\'chat\'/></td></tr>';
		})
		$("#userstable").html(table);

	});


	socket.on('message',function(data){
		//getting the new messages and injecting it to the message box
		$("#chatinput").append('<p>'+data.message+'<p/>');
	})

	$('#addUser').click(function(){
		var username = $("#username").val();
		if(username){
			socket.emit('newuser', {message: username});
		}else{
			alert('please enter the username');
		}
	})

	$("#send").click(function(){
		var text	=	 $("#message").val();
		if(text){
			socket.emit('send', {message: text});
			$("#message").val("");
		}else{
			alert("Please enter a message");

		}

	})



})