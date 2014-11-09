$(function(){

    $(document).height($(window).height());

    // SC api key
    var client_id = '103e05240820b5d0d7d5220ba773612c';

    // store all tracks after a search query
    var all_tracks = [];

    var recentlyAdded = [];

    // timer to search only after a while
    var timer;

    // iframe that stores the SC player
    var iframe = $("#widget")[0];

    // the SC Widget object
    var widget;

    // initialize the soundcloud app
    SC.initialize({
        client_id: client_id
    });

    // on page load, start with a single song
    iframe.src = "http://w.soundcloud.com/player/?url=https://soundcloud.com/porter-robinson/divinity-feat-amy-millan";
    widget = SC.Widget(iframe);

    // keyboard shortcut bindings
    $(document).keydown(function(e) {
        // this won't work if search field is focussed
        if (!$("#searchterm").is(':focus')) {
            if (e.keyCode == 39) {
                // right arrow key pressed, play next
                next();
            } else if (e.keyCode == 32) {
                // space key to toggle playback
                toggle();
            } else if (e.shiftKey && e.keyCode == 38) {
                // shift up
                volumeUp();
            } else if (e.shiftKey && e.keyCode == 40) {
                // shift down
                volumeDown();
            }
        }
    });

    // bind events to the widget
    widget.bind(SC.Widget.Events.READY, function() {
        // when the track finishes, play the next one
        widget.bind(SC.Widget.Events.FINISH, function(e) {
            next();
        });
    });



    // main function that handles searching
    $('#searchterm').keyup(function(event) {

        event.preventDefault();

        // google analytics
      
        var q = $("#searchterm").val();

        // validate query
        if (q == '' || q == undefined) {
            return;
        }

        if (event.keyCode == 17 || event.keyCode == 18 || event.keyCode == 91 ||
            event.keyCode == 9 || event.keyCode == 16) {
            // control, option, command, tab, shift
            return;
        }

        clearTimeout(timer);

        timer = setTimeout(function() {
                if(event.which == 13)
            {
                instaSearch(q);
            }
        }, 200); // wait for 200ms after search query

    });

    // searches and plays a track
    function instaSearch(q) {
        SC.get('/tracks', { q: q, limit: 10 }, function(tracks) {
            if (tracks.length == 0) {
                cleanUpSpace();
                $('#error').append('No tracks found');
            } else {
                all_tracks = tracks;
                var track = all_tracks.splice(0, 1)[0];
                // recentlyAdded.push(track.title);
                // $("#recentList").append("<p>"+track.title+"</p>");
                for(var key in all_tracks)
                {
                    if(all_tracks.hasOwnProperty(key)) {
                        $("#songList").append("<option value="+ all_tracks[key][val] + ">" + all_tracks[key]["title"]+"</option>");
                    }
                }
                playTrack($("#songList option:selected"));


                //playTrack(track);
            }
        });
    }


    // takes a track from SoundCloud and plays it.
    function playTrack(track) {

        cleanUpSpace();
        // console.log(track.uri);
        // update the iframe source
        widget.load(track.uri, {
            auto_play: true,
            buying: false,
            sharing: false,
            show_playcount: false,
            show_comments: false
        });

        // set the title of the track
        $('#trackname').text(track.title);

        // console.log("loaded " + track.title);
    }

    // toggle play and paused state of audio player
    var toggle = function() {
        widget.toggle();
    }

    // play the next song in queue and remove the track that
    // is to be played.
    var next = function() {
        if (all_tracks.length != 0) {
            var track = all_tracks.splice(0, 1)[0];
            playTrack(track);
        } else {
            cleanUpSpace();
            $('#error').append('No more songs. Try searching.');
            $('#searchterm').focus();
        }
    }

    var volumeUp = function() {
        widget.getVolume(function(volume) {
            widget.setVolume(Math.min(100, volume + 5));
        });
    }

    var volumeDown = function() {
        widget.getVolume(function(volume) {
            widget.setVolume(Math.max(0, volume - 5));
        });
    }

    var cleanUpSpace = function() {
        $('#widget').empty();
        $('#error').empty();
    }

});
