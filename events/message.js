const config = require('../config.json');
const {Wit, log} = require('node-wit');
const witClient = new Wit({accessToken: process.env.WIT_TOKEN});
module.exports = message => {
    let client = message.client;

    if(message.author.bot){
        return;
    }

    let command;
    let args;
    let cmd="";

    let r1 = RegExp("^("+config.botId+"){1}(\\s){1}("+config.prefix+"[a-z]+){1}((\\s){1}[a-zA-Z]+)*$", "g");
    let r2 = RegExp("^("+config.prefix+"[a-z]+){1}(\\s+[a-zA-Z]+)*$", "g");

    if(message.channel.type == 'dm' || message.mentions.users.has(config.bot_id)){
        if(r1.test(message.content)){
            command = message.content.split(' ')[1].slice(config.prefix.length);
            args = message.content.split(' ').slice(2);
            execCmd(client, message, command, args);
        } else if(r2.test(message.content)){
            command = message.content.split(' ')[0].slice(config.prefix.length);
            args = message.content.split(' ').slice(1);
            execCmd(client, message, command, args);
        } else {
            witClient.message(message.content, {})
            .then((data) => {
                console.log(JSON.stringify(data));
                if(data.entities.intent){
                    cmd = data.entities.intent[0].value;
                    console.log(cmd);
                } else {
                    message.reply("Oui ?");
                    message.reply("Pour utiliser une commande: @Damien_Bot !commande arguments");
                    message.reply("Pour voir la liste des commandes: @Damien_Bot !help");
                    return;
                }
                if(data.entities.params){
                    args = data.entities.params[0].value.split(' ');
                }
                console.log(args);
                execCmd(client, message, cmd, args);
            })
            .catch(console.error);
        }
    }

    function execCmd(client, message, command, args){
        let perms = client.checkForPerm(message);

        if(client.commands.has(command)){
            cmd = client.commands.get(command);
        }
        if(!cmd){
            message.reply("La commande \""+command+"\" n'existe pas ou vous n'avez pas les permissions nécessaires pour l'utiliser");
            return;
        }
        if(perms < cmd.conf.permLevel){
            message.reply("Vous n'avez pas le niveau de permission nécessaire pour utiliser cette commande");
        }
        console.log(args);
        cmd.run(client, message, args, perms);
    }
};
