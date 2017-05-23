module.exports = (oldMember, newMember) => {
    if(newMember.user.username == "bramas"){
        if(oldMember.presence.status == 'offline' && newMember.presence.status == "online"){
            newMember.sendMessage("Bonjour maitre, je suis le bot de Sandra et de Damien, que puis-je faire pour vous aujourd'hui?")
        }
    }
};
