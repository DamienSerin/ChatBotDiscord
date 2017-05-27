const axios = require("axios");
const utf8 = require("utf8");
const Entities = require('html-entities').AllHtmlEntities;
const entities = new Entities();
exports.run = (client, message, params) => {
    axios.get('https://www.chucknorrisfacts.fr/api/get?data=tri:alea;nb:1')
        .then(function (response) {
            message.reply(entities.decode(response.data[0].fact));
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
    name: 'blague',
    description: 'Affiche une blague',
    usage: 'blague'
};
