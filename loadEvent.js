const evnt = (event) => require(`./events/${event}`);
module.exports = client => {
    client.on('ready', () => evnt('ready')(client));
    client.on('message',  evnt('message'));
    client.on('presenceUpdate', evnt('presenceUpdate'));
}
