module.exports = {
    handleMessage: function(message, bot){
        
        //console.log(message.content);
        let cmdTxt = "";
        let cmdArg = "";
        let cmdArgs = [];
        let tab = message.content.split(" ");
        var botId = `${bot.user}`;
        
        let regex1 = RegExp("^("+botId+"){1}(\\s){1}(![a-z]+){1}((\\s){1}[a-z]+)*$", "g");
        let regex2 = RegExp(/^(![a-z]+){1}(\s+[a-z]+)*$/g);
        
        if (regex1.test(message.content)){
            console.log("toto");
            cmdTxt = message.content.split(" ")[1];
			cmdArg = message.content.substring(botId.length+cmdTxt.length+"!".length+1);
			cmdArgs = cmdArg.split(" ");
			console.log(cmdTxt + " cmd");
            console.log(cmdArg + " args");
            console.log(cmdArgs);
        } else if(regex2.test(message.content)){
            console.log("lol");
            console.log("treating " + message.content + " from " + message.author + " as command");
            cmdTxt = message.content.split(" ")[0].substring("!".length);
            cmdArg = message.content.substring(cmdTxt.length+"!".length+1);
            cmdArgs = cmdArg.split(" ");
            console.log(cmdTxt + " cmd");
            console.log(cmdArgs + " args");
        } else {
            console.log("prout");
        }
        
        /*
        if(message.content.startsWith("!") && message.channel.type == 'dm'){
            console.log("treating " + message.content + " from " + message.author + " as command");
            cmdTxt = message.content.split(" ")[0].substring("!".length);
            cmdArg = message.content.substring(cmdTxt.length+"!".length+1);
            console.log(cmdTxt + " cmd");
            console.log(cmdArg + " suff");
        }
        cmdTxt = message.content.split(" ")[1];*/
		//cmdArg = message.content.substring(bot.user.mention().length+cmdTxt.length+Config.commandPrefix.length+1);
    },
    //(<@296536491361042433>){1}(\s+)(![a-z]+){1}(\s+[a-z]+)*
    toto: function(){
        
    }
    //faire un switch sur les eventuelles commandes contenues dans le message
    //appeler dans chaque case un autre callback en fonction de la commande
    //callback(trucaretourner)
    //handleMessage(msg)
    //checkCmd(msg)
    //reply(cmd, type, msg)
}
 /*message.channel.sendMessage('Cool une commande :o');
            console.log("treating " + message.content + " from " + message.author + " as command");
            var cmdTxt = message.content.split(" ")[0].substring("!".length);
            var cmdArg = message.content.substring(cmdTxt.length+"!".length+1);
            console.log(cmdTxt + " cmd");
            console.log(cmdArg + " suff");*/