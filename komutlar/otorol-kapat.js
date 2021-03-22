const Discord = require('discord.js');
const db = require('quick.db')
exports.run = (client, message, args) => {

if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(`Bu komutu kullanabilmek için "\`Yönetici\`" yetkisine sahip olmalısın.`);
 const rol = db.fetch(`otoRL_${message.guild.id}`)
 if(!rol) return message.reply(`<:red:729390621093003275> Sanırım bu özellik zaten kapalıymış `)


  message.reply(`<:onay:729390621193666680> Bu özellik **başarıyla kapatıldı.**`)


  db.delete(`otoRL_${message.guild.id}`)
  db.delete(`otoRK_${message.guild.id}`)
  db.delete(`otoRM_${message.guild.id}`)
};
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["otorol-kapat", "otorolkapat"],
  permLevel: 0
};

exports.help = {
  name: 'otorol-kapat',
  description: 'taslak',
  usage: 'otorol-kapat'
};
