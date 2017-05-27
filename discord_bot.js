const Discord = require('discord.js');
const client = new Discord.Client();

const config = require('./config.json');
const fs = require('fs');
const moment = require('moment');
require('./loadEvent')(client);

const log = msg => {
    moment.locale();
    console.log(`[${moment().format('YYYY-MM-DD, HH:mm:ss')}] ${msg}`);
}

client.commands = new Discord.Collection();

fs.readdir('./commands/', (err, files) => {
    if(err){
        console.error(err);
    }
    log(`Loading a total of ${files.length} commands.`);
    files.forEach(f => {
        let cmd = require(`./commands/${f}`);
        log(`Loading Command: ${cmd.help.name} ✔`);
        client.commands.set(cmd.help.name, cmd);
    });
});

client.checkForPerm = message => {
    let lvl = 0;

    if(message.channel.type == 'dm'){
        lvl = 4;
        return lvl;
    }

    let mod = message.guild.roles.find('name', config.modrolename);
    if(mod && message.member.roles.has(mod.id)){
        lvl = 2;
    }

    let admin = message.guild.roles.find('name', config.adminrolename);
    if (admin && message.member.roles.has(admin.id)){
        lvl = 3;
    }

    if (message.author.id === config.ownerid){
        lvl = 4;
    }
    return lvl;
};


client.login(process.env.DISCORD_TOKEN);
