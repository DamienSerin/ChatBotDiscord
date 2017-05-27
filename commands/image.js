const axios = require("axios");
const baseURL = "https://api.imgur.com/3/gallery/search/";
const imgurClientId = process.env.IMGUR_CLIENT;
const imgurClientSecret = process.env.IMGUR_SECRET;
const Discord = require('discord.js');

exports.run = (client, message, params) => {
    if(!params[0]){
        message.reply("!help image pour la syntaxe de la commande");
        return;
    } else {
        let sort = "time";
        if(params[1] && params[1] == "time" || params[1] == "viral", params[1] == "top"){
            sort = params[1];
        }

        let requestURL = baseURL + sort + "/?q=" + params[0] + "&q_type=jpg";
        console.log(requestURL);

        axios.get(requestURL, {
            headers: {'authorization': 'Client-ID ' + imgurClientId}
        })
            .then(function (response) {
                let img = response.data.data[Math.floor(Math.random()*response.data.data.length)];
                let cpt = 0;
                while(img.nsfw == true){
                    if(cpt>=50) return message.reply("Merci de réessayer");
                    img = response.data.data[Math.floor(Math.random()*response.data.data.length)];
                    cpt++;
                }
                message.reply(img.link);
            })
            .catch(function (error) {
                console.log(error);
            });
    }
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    permLevel: 0
};

exports.help = {
    name: 'image',
    description: 'Donne la météo du lendemain pour la ville demandée',
    usage: 'image <mot> [<time>||<viral>||<top> - default to time]'
};
