const Discord = require('discord.js'); 
const db = require('quick.db')
exports.run = (client, message, args) => { 
      if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(`Bu komutu kullanabilmek için "\`Yönetici\`" yetkisine sahip olmalısın.`);
  if (db.fetch(`küfürE_${message.channel.id}`)) {
  return message.reply(`Kontrol Yaptım ! \n Sanırım Bu Özellik Zaten Aktif `)
}
  db.set(`küfürE_${message.channel.id}`, "aktif")
  message.reply(`Bu özellik **başarıyla açıldı.** ${client.emojis.get("729390621193666680")}`)
};
exports.conf = {
  enabled: true,  
  guildOnly: false, 
  aliases: [], 
  permLevel: 0
};

exports.help = {
  name: 'küfür-aç',
  description: 'sayaç', 
  usage: 'sayaç'
}