const axios = require("axios");
const baseURL = "http://api.openweathermap.org/data/2.5/";
const iconBaseURL = "http://openweathermap.org/img/w/"
const apikey = process.env.WEATHER_KEY;
const Discord = require('discord.js');
const moment = require('moment');

exports.run = (client, message, params) => {
    let type = 'forecast/daily';
    let date = moment();
    if(!params[0]){
        message.reply("!help meteo pour la syntaxe de la commande");
        return;
    } else {
        let requestURL = baseURL + type + "?q=" + params[0] + "&units=metric" + "&APPID=" + apikey +"&cnt=1" + "&lang=fr";
        axios.get(requestURL)
            .then(function (response) {
                const embed = new Discord.RichEmbed()
                    .setTitle("Météo à " + params[0] + " le " + moment(date).format("DD-MM-YYYY"))
                    .setImage(iconBaseURL + response.data.list[0].weather[0].icon + ".png")
                    .addField('Prévision:', response.data.list[0].weather[0].description)
                    .addField('Temp Min:', response.data.list[0].temp.min)
                    .addField('Temp Max:', response.data.list[0].temp.max);
                message.reply({embed: embed});
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
    name: 'meteo',
    description: 'Donne la météo du lendemain pour la ville demandée',
    usage: 'meteo <ville>'
};
