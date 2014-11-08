// initialize client with app credentials
SC.initialize({
  client_id: '103e05240820b5d0d7d5220ba773612c',
});


$.getJSON('http://soundcloud.com/oembed?callback=?',
   {format: 'js', 
    auto_play: true,
    url: 'https://soundcloud.com/lovekyle/sets/beautiful-loser',
    iframe: true}, 
    function(data) {
            // Put html content returned into 'player' div
            $('#player').html(data['html'])
    }
);
