const Discord = require('discord.js');
const db = require("quick.db")
const ayarlar = require("../ayarlar.json")
exports.run = async (client, message, args) => {
if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(new Discord.RichEmbed()
.setTitle(`Uyarı | Warning!`)
.setDescription(`**[\`System\`]**\nBu Komutu Kullanmak İçin; \`ADMINISTRATOR\` Yetkisine Sahip Olmalısın!`))
  
message.channel.send(new Discord.RichEmbed()
.setColor("ff0000")
.setThumbnail(client.user.avatarURL) 
.setDescription(`Seviye-Sistemi Bütün Fonksiyonları Sıfırlandı!`)
.setFooter(`${client.user.username} Seviye Sistemi!`)   )
db.delete(`seviyesınır${message.guild.id}`)
db.delete(`seviyexp${message.guild.id}`)
db.delete(`seviyekanal${message.guild.id}`)

};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'seviye-sıfırla'
};