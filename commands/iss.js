const axios = require("axios");
const fs = require("fs");
const sharp = require("sharp");
const download = require('image-downloader')
const Discord = require('discord.js');

exports.run = (client, message, params) => {
        let lat = 0;
        let long = 0;
        let map = null;
        axios.get("https://api.wheretheiss.at/v1/satellites/25544")
            .then(function (response) {
                lat = response.data.latitude;
                long = response.data.longitude;
                const options = {
                    url : "http://staticmap.openstreetmap.de/staticmap.php?center="+lat+","+long+"&zoom=4&size=1000x1000&maptype=mapnik",
                    dest: "./issmap.png"
                }
                download.image(options)
                    .then(({ filename, image }) => {
                        sharp('./issmap.png')
                          .overlayWith('./ISS.png', { gravity: sharp.gravity.centre } )
                          .png({'quality': 90})
                          .toFile('./whereisiss.png', function(err) {
                              const embed = new Discord.RichEmbed()
                                  .setTitle("Position de l'ISS")
                                  .attachFile('./whereisiss.png');
                              message.reply({embed: embed});
                          });
                    }).catch((err) => {
                        throw err
                    });
            })
            .catch(function (error) {
                console.log(error);
            });

};

exports.conf = {
    enabled: true,
    guildOnly: false,
    permLevel: 0
};

exports.help = {
    name: 'iss',
    description: 'Affiche la position actuelle de l\'iss',
    usage: 'iss'
};
