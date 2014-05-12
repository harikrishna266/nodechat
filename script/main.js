var username ;
var chatto = "all";
var video;
var fps = 30;
var now;
var then = Date.now();
var interval = 1000/fps;
var delta;
//request animation frames
window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

//media device
function hasGetUserMedia() {
  return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia || navigator.msGetUserMedia);
}

$(document).ready(function(){
	var video = document.querySelector('video');
  	var canvas = document.querySelector('canvas');
  	var ctx = canvas.getContext('2d');
  	var localMediaStream = null;
  	var socket = io.connect('http://localhost:3000');
	

	socket.on('welcome',function(data){
		if(data.message){
			$("#chatinput").append(data.message);
		}
	});
	socket.on('newuser',function(data){
		var table = "";
		$.each(data,function(i,item){
			table += '<tr><td>'+item+' <input type="button" user='+item+' class=\'btn btn-success click pull-right\'  chatto="'+item+'" name="user"  value=\'chat\'/></td></tr>';
		})
		$("#userstable").html(table);
	});
	socket.on('message',function(data){
		//getting the new messages and injecting it to the message box
		$("#chatinput").append('<p>'+data.message+'<p/>');
	})
	$('#addUser').click(function(){
		username = $("#username").val();
		$('#error').html('');
		if(username){
			socket.emit('newuser', {message: username},function(data){
				if(data['success'] != undefined) {
				  	$("#addUser").remove();
				} else {
				   $.each(data.error,function(k,v){
						$('#error').append('<div class="alert alert-danger">'+v+'</div>');	
					})
				}
			});
		}else{
			alert('please enter the username');
		}
	})
	$("#send").click(function(){
		var text	=	 $("#message").val();
		if(text){
			socket.emit('send', {message: text,chatto:chatto});
			$("#message").val("");
		}else{
			alert("Please enter a message");
		}
	});
	$("#userstable").on('click',".click",function(){
		if(username==$(this).attr('user')){
			alert('you chat chat with yourself');
		}else{
			chatto = $(this).attr('user');	
			$("#chatwith").html(chatto);
		}	
	})

 	function takePhoto() {
        var photo = document.getElementById('photo'),
        context = photo.getContext('2d');
        photo.width = video.clientWidth;
        photo.height = video.clientHeight;
        context.drawImage(video, 0, 0, photo.width, photo.height);
        var imagedata = context.getImageData( 0, 0, photo.width, photo.height);
        socket.emit('video', {video: imagedata,chatto:chatto});
  	 	 var canvas = document.getElementById('other');
         var contextother = canvas.getContext('2d');
         contextother.putImageData(imagedata,100,100);

        requestAnimationFrame(takePhoto);

        now = Date.now();
	    delta = now - then;
	    if (delta > interval) {
	        // update time stuffs
	         
	        // Just `then = now` is not enough.
	        // Lets say we set fps at 10 which means
	        // each frame must take 100ms
	        // Now frame executes in 16ms (60fps) so
	        // the loop iterates 7 times (16*7 = 112ms) until
	        // delta > interval === true
	        // Eventually this lowers down the FPS as
	        // 112*10 = 1120ms (NOT 1000ms).
	        // So we have to get rid of that extra 12ms
	        // by subtracting delta (112) % interval (100).
	        // Hope that makes sense.
	         
	        then = now - (delta % interval);
	         
	        // ... Code for Drawing the Frame ...
	    }

    }


	function onSuccess(stream) {
     	 video = document.getElementById('webcam');
        var videoSource;
        if (window.webkitURL) {
          videoSource = window.webkitURL.createObjectURL(stream);
        } else {
          videoSource = stream;
        }
        video.autoplay = true;
        video.src = videoSource;
    	requestAnimationFrame(takePhoto);
    }
     
    function onError() {
        alert('There has been a problem retreiving the streams - did you allow access?');
    }

    navigator.getUserMedia ||
  	(navigator.getUserMedia = navigator.mozGetUserMedia ||
  	navigator.webkitGetUserMedia || navigator.msGetUserMedia);
  	navigator.getUserMedia({
				        video: true,
				        audio: true
				    }, onSuccess, onError);

  	if (navigator.getUserMedia) {
  		 navigator.getUserMedia({
	        video: true,
	        audio: true
	    }, onSuccess, onError);
  		}else{
  			alert("sdsd");
  		}










});
