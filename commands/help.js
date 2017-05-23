const config = require('../config.json');
exports.run = (client, message, params) => {
    if (!params[0]) {
        const commandNames = Array.from(client.commands.keys());
        const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);
        message.channel.sendCode('asciidoc', `--- Liste des Commandes ---\n\n[Utilisez ${config.prefix}help <commandname> pour plus de détails sur une commande]\n\n${client.commands.map(c => `${config.prefix}${c.help.name}${' '.repeat(longest - c.help.name.length)} :: ${c.help.description}`).join('\n')}`);
    } else {
        let command = params[0];
        if (client.commands.has(command)) {
            command = client.commands.get(command);
            message.channel.sendCode('asciidoc', `= ${command.help.name} = \n${command.help.description}\nutilisation::${command.help.usage}`);
        }
    }
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    permLevel: 0
};

exports.help = {
    name: 'help',
    description: 'Affiche la liste des commandes que vous avez le droit d\'utiliser.',
    usage: 'help [command]'
};
