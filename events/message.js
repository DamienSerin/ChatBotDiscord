const config = require('../config.json');
module.exports = message => {
    let client = message.client;

    if(message.author.bot){
        return;
    }

    let command;
    let args;

    let r1 = RegExp("^("+config.botId+"){1}(\\s){1}("+config.prefix+"[a-z]+){1}((\\s){1}[a-z]+)*$", "g");
    let r2 = RegExp("^("+config.prefix+"[a-z]+){1}(\\s+[a-z]+)*$", "g");

    if(message.channel.type == 'dm' || message.mentions.users.has(config.bot_id)){
        if(r1.test(message.content)){
            command = message.content.split(' ')[1].slice(config.prefix.length);
            args = message.content.split(' ').slice(2);
        } else if(r2.test(message.content)){
            command = message.content.split(' ')[0].slice(config.prefix.length);
            args = message.content.split(' ').slice(1);
        } else {
            message.reply("Oui ?");
            message.reply("Pour utiliser une commande: @Damien_Bot !commande arguments");
            message.reply("Pour voir la liste des commandes: @Damien_Bot !help");
            return;
        }

        let perms = client.checkForPerm(message);
        let cmd;

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
        cmd.run(client, message, args, perms);
    }
};
