const Discord = require('discord.js');

exports.run = function(client, message) {
const embed = new Discord.RichEmbed()
.setColor('RANDOM')
.setTitle('🔔 Yetkili Komutları')
.setTimestamp()  
.addField('💎 Duyuru Sisteminiz.', '**▫️** **Kullanım:( .duyuru )**')
.addField('✨ Emoji Rol Komutları.', '**▫️** **Kullanım:( .emoji-rol )**')
.addField('🌍 Otorol Komutları.', '**▫️** **Kullanım: ( .otorol )**')
.addField('💡 Sayaç Komutları.', '**▫️** **Kullanım: ( .sayaç )**')
.addField('🧹 Destek Sistemimiz.', '**▫️** **Kullanım: ( .ticket )**')
.addField('💿 Sa-As Sistemimiz.', '**▫️** **Kullanım: ( .sa-as )**')
.addField('💹 Giriş Çıkış Sistemimiz.', '**▫️** **Kullanım: ( .giriş-çıkış )**')
.addField('👣 ModLog Sistemimiz.', '**▫️** **Kullanım: ( .mod-log )**')
.addField('✨  Jail Sistemimiz.', '**▫️** **Kullanım: ( .jail-yardım )**')
.addField('⚡ Seviye Sistemimiz.', '**▫️** **Kullanım: ( .level )**')
.setFooter('💎 Eveylnn', client.user.avatarURL)
.setTimestamp()
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
  name: 'yetkili',
  description: 'Tüm komutları gösterir.',
  usage: 'yetkili'
};