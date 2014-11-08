$(function(){

    $(document).height($(window).height());

    // SC api key
    var client_id = '0448ca85ad04b55fdabbfbac1d4f7217';

    // store all tracks after a search query
    var all_tracks = [];

    // timer to search only after a while
    var timer;

    // initialize the soundcloud app
    SC.initialize({
        client_id: client_id
    });

    // main function that handles searching
    $('#searchterm').keyup(function(event) {

        event.preventDefault();

        // google analytics
        ga('send', 'event', 'input', 'search');

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
            instaSearch(q);
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
                playTrack(track);
            }
        });
    }

    // takes a track from SoundCloud and plays it.
    function playTrack(track) {
        ga('send', 'event', 'play', 'songPla');
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
});

