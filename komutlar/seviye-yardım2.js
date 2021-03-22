const Discord = require('discord.js');

exports.run = function(client, message) {
const embed = new Discord.RichEmbed()
.setColor('RANDOM')
.setTitle('🔔 Seviye 2 Komutları')
.setTimestamp()
.addField('🛕 Örnek Kullanım1', '**▫️** **.seviye-log #kanal**')
.addField('🏏 Örnek Kullanım2', '**▫️** **.seviye-log sıfırla**')
.addField('🎲 Örnek Kullanım3', '**▫️** **.seviye-rol @rol Seviye**')
.addField('⚗️ Örnek Kullanım4', '**▫️** **.seviye-rol sıfırla**')
.addField('🌀 Örnek Kullanım5', '**▫️** **.seviye-sınır 100-500**')
.addField('☠️ Örnek Kullanım6', '**▫️** **.seviye-sınır sıfırla**')
.addField('🥬 Örnek Kullanım7', '**▫️** **.seviye-xp Sayı**')
.addField('🦪 Örnek Kullanım8', '**▫️** **.seviye-xp sıfırla**')
.setThumbnail(client.user.avatarURL)
message.channel.send(embed)
};

exports.conf = {
  enabled: true,
  guildOnly: false, 
  aliases: [], 
  permLevel: 0 
};

exports.help = {
  name: 'level2',
  description: 'Tüm komutları gösterir.',
  usage: 'yetkili'
};