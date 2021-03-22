const Discord = require('discord.js');

exports.run = function(client, message) {
const embed = new Discord.RichEmbed()
.setColor('RANDOM')
.setTitle('JAİL SİSTEMİ')
.setTimestamp()
.addField('<a:parilti:742770189149405250> Jail Kanal.', '**▫️** **Kullanım: ( .jail-kanal ayarla #kanal )**')
.addField('<a:parilti:742770189149405250> Jail Rol.', '**▫️** **Kullanım: ( .jail-rol ayarla @rol )**')
.addField('<a:parilti:742770189149405250> Jail Yetkilisi.', '**▫️** **Kullanım: ( .jail-yetkilisi ayarla @rol )**')
.addField('<a:parilti:742770189149405250> Jail.', '**▫️** **Kullanım: ( .jail )**')
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
  name: 'jail-yardım',
  description: 'Tüm komutları gösterir.',
  usage: 'jail-yardım'
};