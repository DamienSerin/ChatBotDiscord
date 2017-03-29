var SlackBot = require('slackbots');
var axios = require('axios');

var timer = 30000;
var subs = ["aww","wholesomememes"];

// create a bot

module.exports = function(params) {
    this.bot = null;
    this.connected = false;
    var self = this;
    this.connect = function(){
        self.bot = new SlackBot(params);
        self.bot.on('start', self.onStart);
        self.bot.on('message', self.onEvent);

    }

    self.onStart = function() {
        // more information about additional params https://api.slack.com/methods/chat.postMessage
        var params = {
            icon_emoji: ':poop:'
        };

        self.connected = true;
        
        // define channel, where bot exist. You can adjust it there https://my.slack.com/services 
        self.bot.postMessageToChannel('general', 'roule!', params);
        
        // define existing username instead of 'user_name'
        self.bot.postMessageToUser('patate', 'roule pm!', params); 
        
        // If you add a 'slackbot' property, 
        // you will post to another user's slackbot channel instead of a direct message
        self.bot.postMessageToUser('patate', 'roule pm2!', { 'slackbot': true, icon_emoji: ':cat:' }); 
    
        self.bot.getUser(self.bot.name).then(function(user){
            self.user = user;
        });
        
         self.redditTop();
   
    }

    self.onEvent = function(event) {
        var type = "[Unknown]";
        switch(event.type){
            case "message":
                switch(event.channel[0]){
                    case 'D':
                        type = "[PM]";
                        break;
                    case 'C':
                        type = "[Channel]";
                        break;
                }
                if(typeof event.bot_id !== 'undefined'){
                    if(event.bot_id == self.user){break;}
                    type+="[Bot]";
                }
                else {
                    if(event.text[0] == '!'){
                        console.log(self.commandManage(event));
                    }
                    //self.onHumanmsg(event);
                }
                console.log("%s %s: %s",type,event.username,event.text);   
                break;
            default:
                console.log("================");
                console.log(event);
                console.log("================");
        }
    }

    self.commandManage = function(data){
        switch(data.text.substring(0,6)){
            case "!adds ":
                subs.push(data.text.substring(6));
                return "Added !";
            case "!rems ":
                if((x = subs.indexOf(data.text.substring(6))) > -1){
                    subs.splice(x,1);
                }
                return "Removed !";
            case "!post ":
                self.redditTop();
                return;
            case "!time ":
                timer = parseInt(data.text.substring(6));
                return "Timer Set !";
            case "!stop ":
                clearTimeout(self.timerPost);
                return "Stopped !";
            case "!start":
                setInterval(self.timerPost,timer);
                return "Started !";
        }
    }

    self.onHumanmsg = function(data){
        self.bot.postMessage(data.channel, ":poop:");
    }

    self.redditTop = function(){
        var rand = Math.floor(Math.random()*24);
        var randsub = Math.floor(Math.random()*subs.length);
        console.log("http://reddit.com/r/"+ subs[randsub] +"/top.json");
        axios.get("http://reddit.com/r/"+ subs[randsub] +"/top.json").then(function(res){
            var json = res.data;
            self.bot.postMessageToChannel('general', '', {"attachments": [{"title": json.data.children[rand].data.title, "title_link": json.data.children[rand].data.url, "image_url": json.data.children[rand].data.url, "author_name": "Reddit Top", "color": "#FF4500"}]});
            //
            console.log(json.data.children[rand].data.title);
        });
    }

    self.timerPost = function(){
        // reddit.com/top.json
        // x.data.children[0].data.url
        // x.data.children[24].data.title
        self.redditTop();
    }

    setInterval(self.timerPost,timer);


}