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

    //holder for the current track
    var currTrack;

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

    $(document).ready(function() {
        Parse.initialize("ovwXFPTmzVJfebpzH1iJLLdJsKtMEqn9jD3cmBZW", "q7n9xQOnhCtcGzKUgGfW196IyuFqYGJnLMCZeWGZ");
        var Track = Parse.Object.extend("Track");

        getTopTenSongsList();

        $("#start").click(function(){
            $("#top").hide(500);
            $("#search").show(500);
        });

        $(".upvote").click(function() {
            var query = new Parse.Query(Track);
            query.first(up).increment();

        });

        $(".downvote").click(function() { 
            var query = new Parse.query(Track);
            query.first(up).decremenet();

        });

        $("#addbutton").click(function(){

            var track = new Track();
            var song = all_tracks[$('#songList').val()];
            track.set("name", song.title);
            track.set("url", song.uri);
            track.set("rating", 0);
            track.set("timeAdded", getDateTime());

            // Check if this song is already in the Parse DB, based on its name
              if (!track.get("name")) {
               alert('A Track must have a name.');
              } 
              else {
                var query = new Parse.Query(Track);
                query.equalTo("name", track.get("name"));
                query.first({
                  success: function(object) {
                    if (object) {
                      alert("A Track with this name already exists.");
                    } 
                    else {
                        // Seems to be a unique song, so it's okay to add
                        track.save(null, {
                          success: function(track) {
                            // Execute any logic that should take place after the object is saved.
                            alert("'" + track.title + "' was added to the Recently Added list.");
                          },
                          error: function(track, error) {
                            // Execute any logic that should take place if the save fails.
                            // error is a Parse.Error with an error code and message.
                            alert('Failed to add new song to Recently Added list, with error code: ' + error.message);
                          }
                        });
                    }
                  },
                  error: function(error) {
                    alert("There was an error while validating uniqueness for this Track object.");
                  }
                });
              }
        }); // End addbutton action
        document.getElementById("currTime").innerHTML = getDateTime();

        // Inject URIs into Top Songs embedded players
        getTopTenSongsList();
        getRecentSongsList();
    });

    var MAX_NUM_TOP_SONGS = 5;
    var MAX_NUM_RECENT_SONGS = 10;

    // returns a list of the top Songs highest rated songs
    function getTopTenSongsList() {
        var Track = Parse.Object.extend("Track");
        var query = new Parse.Query(Track);
        query.descending("rating");
        query.limit(MAX_NUM_TOP_SONGS);
        query.find({
           success: function(results) {
                // On successful find, populate Top Songs list with players
                for(i = 0; i < results.length; i++) {
                    var frame = $("#top" + (i + 1))[0];
                    frame.src = "https://w.soundcloud.com/player/?url=" + results[i].get("url") + "?show_artwork=false";
                    SC.Widget(frame);
                }
           }
        });
    }

    // returns a list of the 5 most recently added songs
    function getRecentSongsList() {
        var Track = Parse.Object.extend("Track");
        var query = new Parse.Query(Track);
        query.descending("timeAdded");
        query.limit(MAX_NUM_RECENT_SONGS);
        query.find({
           success: function(results) {
                // On successful find, populate Recently Added song list with players
                for(i = 0; i < results.length; i++) {
                    var frame = $("#rPlayer" + (i + 11))[0];
                    frame.src = "https://w.soundcloud.com/player/?url=" + results[i].get("url") + "?show_artwork=false";
                    SC.Widget(frame);
                }              
           }
        });
    }

    function getDateTime() {
        var now     = new Date(); 
        var year    = now.getFullYear();
        var month   = now.getMonth()+1; 
        var day     = now.getDate();
        var hour    = now.getHours();
        var minute  = now.getMinutes();
        var second  = now.getSeconds(); 
        if(month.toString().length == 1) {
            var month = '0'+month;
        }
        if(day.toString().length == 1) {
            var day = '0'+day;
        }   
        if(hour.toString().length == 1) {
            var hour = '0'+hour;
        }
        if(minute.toString().length == 1) {
            var minute = '0'+minute;
        }
        if(second.toString().length == 1) {
            var second = '0'+second;
        }   
        var dateTime = year+'/'+month+'/'+day+' '+hour+':'+minute+':'+second;   
         return dateTime;
    }

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
        $('#songList').show();
        SC.get('/tracks', { q: q, limit: 10 }, function(tracks) {
            if (tracks.length == 0) {
                cleanUpSpace();
                $('#error').append('No tracks found');
            } else {
                all_tracks = tracks;
                $("#songList").empty();
                for(var key in all_tracks)
                {
                    if(all_tracks.hasOwnProperty(key)) {
                        $("#songList").append("<option value="+ key + ">" + all_tracks[key]["title"]+"</option>");
                    }
                }
                playTrack(all_tracks[0]);
            }
        });
    }

    $('#songList').change(function() {
        var song = all_tracks[$(this).val()];
        playTrack(song);
    });
    

    // takes a track from SoundCloud and plays it.
    function playTrack(track) {

        cleanUpSpace();
        widget.load(track.uri, {
            auto_play: true,
            buying: false,
            sharing: false,
            show_playcount: false,
            show_comments: false
        });
        currUri = track.uri;
        document.getElementById("currTrack").innerHTML = track.title;
        document.getElementById("currUri").innerHTML = currUri;
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
