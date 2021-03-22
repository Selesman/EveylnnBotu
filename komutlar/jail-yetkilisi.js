const Discord = require('discord.js')
const db = require('quick.db');
const ayarlar = require('../ayarlar.json')

exports.run = async(client, message, args) => {
  
   var başarılı = ['**İŞTE BU!** <a:iet:742761491064815637>', '**SÜPER!** <a:iet:742761491064815637>', '**NASIL YAPTIN BUNU?!** <a:iet:742761491064815637>', '**MÜKEMMEL!** <a:iet:742761491064815637>', '**SEVDİM BUNU!** <a:iet:742761491064815637>', '**ŞİMDİ OLDU!** <a:iet:742761491064815637>'];
   var x = başarılı[Math.floor(Math.random() * başarılı.length)];
   var başarısız = ['**TÜH!** <a:hayr:742770353058873375>', '**OLMADI BU!** <a:hayr:742770353058873375>', '**HAY AKSİ!** <a:hayr:742770353058873375>', '**HADİ ORADAN!** <a:hayr:742770353058873375>', '**OLMADI YA, <a:hayr:742770353058873375>', '**BÖYLE OLMAZ?!** <a:hayr:742770353058873375>', '**HADİ YA!** <a:hayr:742770353058873375>'];
   var x2 = başarısız[Math.floor(Math.random() * başarısız.length)];
  
if (!message.member.hasPermission('MANAGE_GUILD')) return message.reply(`**${ayarlar.prefix}jail-yetkilisi ayarla/sıfırla** isimli komutu kullanabilmek için \`SUNUCUYU YÖNET\` yetkisine sahip olman gerekiyor.`)
if (!args[0]) return message.reply(`Sistemi kullanabilmek için, s-jail-yetkilisi ayarla/sıfırla @rol yazmalısın.\nDetaylı bilgi için: s-yardım`)
   
  
  if (args[0] == 'ayarla') {
  
  let yetkilirol = message.mentions.roles.first() || message.guild.roles.find(c => c.name === args[1].join(' '))
  if (!yetkilirol) return message.channel.send(x2 + ` Bir rol etiketle.`)
  
  db.set(`jailyetkilisi_${message.guild.id}`, yetkilirol.id)
  message.channel.send(x + ` Jail yetkilisi ${yetkilirol} olarak ayarlandı.`)
  } 
  

  if (args[0] == 'sıfırla') {
    db.delete(`jailyetkilisi_${message.guild.id}`)
    message.channel.send(x + ` Jail yetkilisi başarıyla sıfırlandı.`)
  }
  
  
};
exports.conf = {
 enabled: true,
 guildOnly: false,
 aliases: ['jailyetkilisi'],
 permLevel: 0
};

exports.help = {
 name: 'jail-yetkilisi',
 description: 'Hangi role sahip kişilerin jaile atabileceğini ayarlarsınız.',
 usage: 'jail-yetkilisi ayarla/sıfırla @rol',
 kategori: '**MODERASYON**',
 permLvl: '**SUNUCUYU YÖNET**'
};