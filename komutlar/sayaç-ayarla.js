const Discord = require('discord.js');
const db = require('quick.db')
exports.run = (client, message, args) => { 
  
let kanal = message.mentions.channels.first() 
let sayı = args[1]
let kalan = args[1] - message.guild.memberCount
 if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(`Bu komutu kullanabilmek için "\`Yönetici\`" yetkisine sahip olmalısın.`);
 
 if(!kanal) return message.channel.send(`Lütfen Bir Kanal Belirt. `)
  
 if(isNaN(args[1])) return message.channel.send(`
<Belirttiğin Sayı Çok Küçük Veya O Sayıya Zaten Ulaşmışsın  `)
 
 if(message.guild.memberCount > args[1]) return message.channel.send(`   Belirttiğin Sayı Çok Küçük Veya O Sayıya Zaten Ulaşmışsın `)

 
  message.channel.send(`
Sayaç Aktif Edildi.
**${args[1]}** Olarak Güncelledim! 
Kayıt Kanalını **${kanal}** Olarak Güncelledim! 
${args[1]} Kişi Olmaya Son **${kalan}** Kişi Kaldı!
`)

  
  db.set(`sayacK_${message.guild.id}`, kanal.id)  
  db.set(`sayacS_${message.guild.id}`, sayı) 
};
exports.conf = {
  enabled: true,  
  guildOnly: false, 
  aliases: [], 
  permLevel: 0
};

exports.help = {
  name: 'sayaç-ayarla',
  description: 'taslak', 
  usage: 'sayaç-ayarla'
};
