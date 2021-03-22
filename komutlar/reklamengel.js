const Discord = require('discord.js');
const db = require('quick.db')
exports.run = (client, message, args) => { 
      if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(` Bu komutu kullanabilmek için "\`Yönetici\`" yetkisine sahip olmalısın.`);
  if (db.fetch(`reklamK_${message.channel.id}`)) {
  return message.reply(`Kontrol Yaptım ! \n Sanırım Bu Özellik Zaten Aktif `)
}
  db.set(`reklamK_${message.channel.id}`, message.channel.id)
  message.reply(`Bu özellik **başarıyla açıldı.**`) 
};
exports.conf = {
  enabled: true,  
  guildOnly: false, 
  aliases: [], 
  permLevel: 0
};

exports.help = {
  name: 'reklam-aç',
  description: 'sayaç', 
  usage: 'sayaç'
};