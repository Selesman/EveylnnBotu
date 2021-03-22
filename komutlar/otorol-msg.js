const Discord = require('discord.js');
const db = require('quick.db')
exports.run = (client, message, args) => { 
  
        if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(` Bu komutu kullanabilmek için "\`Yönetici\`" yetkisine sahip olmalısın.`);

  
  
  let mesaj = args.slice(0).join(' ');
  if(mesaj.length < 5) return message.channel.send(client.emojis.get("729390621093003275") + ' Otorol Mesaj Sistemi İçin En Az 5 Karakter Belirtebilirsin. Örnek: ')
  
 message.channel.send(client.emojis.get("729390621193666680") + ' Oto-Rol mesajını `'+mesaj+'` Olarak ayarladım.') 
 db.set(`otoRM_${message.guild.id}`, mesaj)  
    
  
  
};
exports.conf = {
  enabled: true,  
  guildOnly: false, 
  aliases: ['oto-rol-msg'], 
  permLevel: 0
};

exports.help = {
  name: 'otorol-msg',
  description: 'taslak', 
  usage: 'sayac-hg-msg'
};