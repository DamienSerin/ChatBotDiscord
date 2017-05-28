const ytdl = require("ytdl-core");
const request = require("request");

var stopped = false;
var inform_np = true;

var now_playing_data = {};
var queue = [];
var aliases = {};

var voice_connection = null;
var voice_handler = null;
var text_channel = null;

var yt_api_key = process.env.YT_KEY;

var isMusicInit = false;

exports.run = (client, message, params) => {
    var commands = [
        {
            command: "stop",
            description: "Stop la playlist (passe aussi la chanson en cours)",
            parameters: [],
            execute: function(message, args) {
                if(stopped) {
                    message.reply("La lecture est déjà stop");
                } else {
                    stopped = true;
                    if(voice_handler !== null) {
                        voice_handler.end();
                    }
                    message.reply("Stop!");
                }
            }
        },

        {
            command: "resume",
            description: "Redémarre la lecture",
            parameters: [],
            execute: function(message, args) {
                if(stopped) {
                    stopped = false;
                    if(!is_queue_empty()) {
                        play_next_song();
                    }
                } else {
                    message.reply("Lecture déjà en cours");
                }
            }
        },

        {
            command: "request",
            description: "Ajoute la vidéo demandée à la playlist",
            parameters: ["URL Vidéo, ID Vidéo, URL Playlist"],
            execute: function (message, args) {
                var regExp = /^.*(youtu.be\/|list=)([^#\&\?]*).*/;
                var match = regExp.test(args[0]);
                if (match && match[2]){
                    queue_playlist(match[2], message);
                } else {
                    add_to_queue(args[0], message);
                }
            }
        },

        {
            command: "search",
            description: "Cherche une vidéo sur youtube et l'ajoute à la playlist",
            parameters: ["recherche"],
            execute: function(message, args) {
                if(yt_api_key === null) {
                    message.reply("api key not set");
                } else {
                    var q = "";
                    for(var i = 1; i < args.length; i++) {
                        q += args[i] + " ";
                    }
                    search_video(message, q);
                }
            }
        },

        {
            command: "np",
            description: "Affiche la musique actuelle",
            parameters: [],
            execute: function(message, args) {

                var response = "Now playing: ";
                if(is_bot_playing()) {
                    response += "\"" + now_playing_data["title"] + "\" (requested by " + now_playing_data["user"] + ")";
                } else {
                    response += "nothing!";
                }

                message.reply(response);
            }
        },

        {
            command: "setnp",
            description: "Active ou désactive l'annonce des musiques",
            parameters: ["on/off"],
            execute: function(message, args) {

                if(args[0].toLowerCase() == "on") {
                    var response = "Les musiques vont êtres annoncées";
                    inform_np = true;
                } else if(args[0].toLowerCase() == "off") {
                    var response = "Je ne vais plus annoncer les musiques";
                    inform_np = false;
                } else {
                    var response = "Oui?";
                }

                message.reply(response);
            }
        },

        {
            command: "commands",
            description: "Affiche la liste des commandes",
            parameters: [],
            execute: function(message, args) {
                var response = "Commandes disposs :";

                for(var i = 0; i < commands.length; i++) {
                    var c = commands[i];
                    response += "\n!" + c.command;

                    for(var j = 0; j < c.parameters.length; j++) {
                        response += " <" + c.parameters[j] + ">";
                    }

                    response += ": " + c.description;
                }

                message.reply(response);
            }
        },

        {
            command: "skip",
            description: "Passe la chanson",
            parameters: [],
            execute: function(message, args) {
                if(voice_handler !== null) {
                    message.reply("Skipping...");
                    voice_handler.end();
                } else {
                    message.reply("Pas de musique actuellement.");
                }
            }
        },

        {
            command: "queue",
            description: "Affiche la playlist",
            parameters: [],
            execute: function(message, args) {
                var response = "";

                if(is_queue_empty()) {
                    response = "La playlist est vide.";
                } else {
                    var long_queue = queue.length > 30;
                    for(var i = 0; i < (long_queue ? 30 : queue.length); i++) {
                        response += "\"" + queue[i]["title"] + "\" (requested by " + queue[i]["user"] + ")\n";
                    }

                    if(long_queue) response += "\n**...and " + (queue.length - 30) + " more.**";
                }

                message.reply(response);
            }
        },

        {
            command: "clearqueue",
            description: "Supprime les chansons de la playlist",
            parameters: [],
            execute: function(message, args) {
                queue = [];
                message.reply("Playlist vide");
            }
        },

        {
            command: "remove",
            description: "Retire une musique de la playlist",
            parameters: ["index de la requete ou 'last'"],
            execute: function(message, args) {
                var index = args[0];

                if(is_queue_empty()) {
                    message.reply("La playlist est vide");
                    return;
                } else if(isNaN(index) && index !== "last") {
                    message.reply("Argument '" + index + "' is not a valid index.");
                    return;
                }

                if(index === "last") { index = queue.length; }
                index = parseInt(index);
                if(index < 1 || index > queue.length) {
                    message.reply("Cannot remove request #" + index + " from the queue (there are only " + queue.length + " requests currently)");
                    return;
                }

                var deleted = queue.splice(index - 1, 1);
                message.reply('Request "' + deleted[0].title +'" was removed from the queue.');
            }
        }
    ];

    /**************************************************************************/

    if(!isMusicInit){
        initMusic();
    }
    let cmd = commandExist(params[0]);
    let args = params.slice(1);
    if(cmd){
        if(args.length < cmd.parameters.length){
            message.reply("Arguments invalides");
        } else {
            cmd.execute(message, args);
        }
    }


    /**************************************************************************/

    function initMusic(){
        console.log(isMusicInit);
        var server = client.guilds.find("name", "PROGRES-UPMC");

        if(server === null) throw "Couldn't find server '" + "PROGRES-UPMC" + "'";

        var voice_channel = server.channels.find(chan => chan.name === "General" && chan.type === "voice");
        if(voice_channel === null) throw "Couldn't find voice channel '" + voice_channel_name + "' in server '" + server_name + "'";

        text_channel = server.channels.find(chan => chan.name === "general" && chan.type === "text");
        if(text_channel === null) throw "Couldn't find text channel '#" + text_channel_name + "' in server '" + server_name + "'";

        voice_channel.join().then(connection => {voice_connection = connection;}).catch(console.error);
        client.user.setGame();
        isMusicInit = true;
    }

    function commandExist(name){
        for(let i = 0; i < commands.length; i++){
            if(commands[i].command == name.toLowerCase()){
                return commands[i];
            }
        }
        return false;
    }

    function search_video(message, query) {
        request("https://www.googleapis.com/youtube/v3/search?part=id&type=video&q=" + encodeURIComponent(query) + "&key=" + yt_api_key, (error, response, body) => {
            var json = JSON.parse(body);
            if("error" in json) {
                message.reply("An error has occurred: " + json.error.errors[0].message + " - " + json.error.errors[0].reason);
            } else if(json.items.length === 0) {
                message.reply("No videos found matching the search criteria.");
            } else {
                add_to_queue(json.items[0].id.videoId, message);
            }
        })
    }

    function get_video_id(string) {
        console.log("get_id " + string);
        var regex = /(?:\?v=|&v=|youtu\.be\/)(.*?)(?:\?|&|$)/;
        var r = new RegExp(regex);

        var matches = string.match(r);
        console.log(matches);
        if(matches) {
            return matches[1];
        } else {
            return string;
        }
    }

    function add_to_queue(video, message, mute = false) {
        console.log("add");
        console.log(video);
        var video_id = get_video_id(video);
        console.log("in add "+video_id);
        ytdl.getInfo("https://www.youtube.com/watch?v=" + video_id, (error, info) => {
            if(error) {
                message.reply("The requested video (" + video_id + ") does not exist or cannot be played.");
                console.log("Error (" + video_id + "): " + error);
            } else {
                queue.push({title: info["title"], id: video_id, user: message.author.username});
                if (!mute) {
                    message.reply('"' + info["title"] + '" has been added to the queue.');
                }
                if(!stopped && !is_bot_playing() && queue.length === 1) {
                    play_next_song();
                }
            }
        });
    }

    function queue_playlist(playlistId, message, pageToken = '') {
        request("https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=" + playlistId + "&key=" + yt_api_key + "&pageToken=" + pageToken, (error, response, body) => {
            var json = JSON.parse(body);
            if ("error" in json) {
                message.reply("An error has occurred: " + json.error.errors[0].message + " - " + json.error.errors[0].reason);
            } else if (json.items.length === 0) {
                message.reply("No videos found within playlist.");
            } else {
                for (var i = 0; i < json.items.length; i++) {
                    add_to_queue(json.items[i].snippet.resourceId.videoId, message, true)
                }
                if (json.nextPageToken == null){
                    return;
                }
                queue_playlist(playlistId, message, json.nextPageToken)
            }
        });
    }


    function is_queue_empty() {
        return queue.length === 0;
    }

    function play_next_song() {
        if(is_queue_empty()) {
            text_channel.sendMessage("The queue is empty!");
        }

        var video_id = queue[0]["id"];
        var title = queue[0]["title"];
        var user = queue[0]["user"];

        now_playing_data["title"] = title;
        now_playing_data["user"] = user;

        if(inform_np) {
            text_channel.sendMessage('Now playing: "' + title + '" (requested by ' + user + ')');
            client.user.setGame(title);
        }

        var audio_stream = ytdl("https://www.youtube.com/watch?v=" + video_id);
        voice_handler = voice_connection.playStream(audio_stream);

        voice_handler.once("end", reason => {
            voice_handler = null;
            client.user.setGame();
            if(!stopped && !is_queue_empty()) {
                play_next_song();
            }
        });

        queue.splice(0,1);
    }

    function is_bot_playing() {
        return voice_handler !== null;
    }

    /**************************************************************************/


};

exports.conf = {
    enabled: true,
    guildOnly: false,
    permLevel: 0
};

exports.help = {
    name: 'music',
    description: 'Gère des requetes vers des videos sur youtube (@Damien_Bot !music commands)',
    usage: 'music <command> <param>'
};
