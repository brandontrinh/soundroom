SC.initialize({
   client_id: "103e05240820b5d0d7d5220ba773612c",
   redirect_uri: "http://brandontrinh.github.io/HackSC2014/callback.html",
});

// initiate auth popup
SC.connect(function() {
  SC.get('/me', function(me) { 
    alert('Hello, ' + me.username); 
  });
});