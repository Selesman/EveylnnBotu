const Discord = require('discord.js');
const db = require("quick.db")
exports.run = async (client, message, args) => {
 if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(new Discord.RichEmbed()
.setTitle(`Uyarı | Warning!`)
.setDescription(`**[\`System\`]**\nBu Komutu Kullanmak İçin; \`ADMINISTRATOR\` Yetkisine Sahip Olmalısın!`))
  
  
   if(args[0] == "sıfırla") {
    db.delete(`seviyekanal${message.guild.id}`)
    return message.channel.send(`Seviye-Log sıfırlandı!`);
  }
    
    
   if (args[0]) {
      let akanal =
        message.mentions.channels.first() ||
        message.guild.channels.find(ff => ff.name === args.slice(1).join(" "));
      db.set(`seviyekanal${message.guild.id}`, akanal.id);
      message.channel.send(`Seviye Log Kanalı Ayarlandı! Ayarlanan Kanal: <#${akanal.id}>`)           
    }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'seviye-log'
};
