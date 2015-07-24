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

    /**
    * Returns the url field of the Parse Track Object corresponding to
    * a upvote/downvote button (yes, using the horrid hacky numbering system...
    * hackathon code is beautiful, isn't it?)
    */
    function getTrackUrlFromButtonId(buttonId) {
       var numSuffix = buttonId.substring(buttonId.length - 2, buttonId.length);
       var playerSrc = $("#rPlayer" + numSuffix).prop("src");
       var trackUrl = playerSrc.substring(playerSrc.indexOf("https://api.soundcloud.com"),
                                     playerSrc.indexOf("?show_artwork=false"));
       return trackUrl;
    };

    $(document).ready(function() {
        Parse.initialize("ovwXFPTmzVJfebpzH1iJLLdJsKtMEqn9jD3cmBZW", "q7n9xQOnhCtcGzKUgGfW196IyuFqYGJnLMCZeWGZ");
        var Track = Parse.Object.extend("Track");


        $("#start").click(function(){
            $("#top").hide(500);
            $("#search").show(500);
        });

        $(".upvote").click(function() {
            var query = new Parse.Query(Track);
            // HORRENDOUS way to retrieve & update the proper Parse Track object
            // I said I'd at least fix the rating system one day; so I did!
            var buttonId = this.id;
            var trackUrl = getTrackUrlFromButtonId(buttonId);
            var numSuffix = buttonId.substring(buttonId.length - 2, buttonId.length);
            query.equalTo("url", trackUrl);
            query.first({
               success: function(track) {
                  track.increment("rating");
                  track.save();
                  $("#rating" + numSuffix + " span").html(track.get('rating'));
                  getTopTenSongsList();
                  console.log("\'" + track.get("name") + "\' rating increased to " + track.get('rating'));
               },
               error: function(error) {
                  console.log(error);
               }
            });
        });

        $(".downvote").click(function() {
            var query = new Parse.Query(Track);
            // HORRENDOUS way to retrieve & update the proper Parse Track object
            // I said I'd at least fix the rating system one day; so I did!
            var buttonId = this.id;
            var trackUrl = getTrackUrlFromButtonId(buttonId);
            var numSuffix = buttonId.substring(buttonId.length - 2, buttonId.length);
            query.equalTo("url", trackUrl);
            query.first({
               success: function(track) {
                  track.increment("rating", -1);
                  track.save();
                  $("#rating" + numSuffix + " span").html(track.get('rating'));
                  getTopTenSongsList();
                  console.log("\'" + track.get("name") + "\' rating decreased to " + track.get('rating'));
               },
               error: function(error) {
                  console.log(error);
               }
            });
        });

        $('#recent').scroll();
        $("#recent").animate({ scrollBottom: 1000 }, 2000);

        var artist = 'G-Eazy';
        var my_json;
        // $.getJSON("http://api.jambase.com/events?artistId=91145&page=0&api_key=r4peddjenqt3eyx23j37vusn", function(json) {
        // my_json = json;
        // });
        // var parsedData = JSON.parse(my_json);
        // var location = parsedData.City + ", " + parsedData.State;
        // var date = parsedData.Date;
        my_json = $.getJSON("http://api.jambase.com/events?artistId=91145&page=0&api_key=r4peddjenqt3eyx23j37vusn");
        console.log(my_json);

        // $("#concert1").html(artist + " - " + location + " " + date);

        $("#concert1").html("Artist" + " - " + "Location" + " " + "Date");

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
                            // Update lists
                            getTopTenSongsList();
                            getRecentSongsList();
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
                    // Also display each top song's rating
                    $("#rating" + (i + 1) + " span").html(results[i].get('rating'));
                    if(i<2) {
                        // use jam base api here
                    }
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
                    // Also display rating
                    var ratingDisplayVal = $("#rating" + (i + 11) + " span");
                    ratingDisplayVal.html(results[i].get("rating"));
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


    $('#searchterm').keyup(function(event) {

        event.preventDefault();
        var q = $("#searchterm").val();

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
                search(q);
            }
        }, 200); // wait for 200ms after search query

    });

    // searches and plays a track
    function search(q) {
        $('#songList').show();
        SC.get('/tracks', { q: q, limit: 10 }, function(tracks) {
            if (tracks.length == 0) {
                clean();
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


    function playTrack(track) {

        cleanUp();
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
        $('#trackname').text(track.title);
    }

    var toggle = function() {
        widget.toggle();
    }

    var next = function() {
        if (all_tracks.length != 0) {
            var track = all_tracks.splice(0, 1)[0];
            playTrack(track);
        } else {
            clean();
            $('#error').append('No more songs. Try searching.');
            $('#searchterm').focus();
        }
    }

    var volumeUp = function() {
        widget.getVolume(function(volume) {
            widget.setVolume(Math.min(100, volume + 3));
        });
    }

    var volumeDown = function() {
        widget.getVolume(function(volume) {
            widget.setVolume(Math.max(0, volume - 3));
        });
    }

    var cleanUp = function() {
        $('#widget').empty();
        $('#error').empty();
    }
});
