const Discord = require('discord.js');

exports.run = function(client, message) {
const embed = new Discord.RichEmbed()
.setColor('GRAY')
.setTitle('🔔 Botumuzun Komutları.')
.setTimestamp()
.addField('🔰 İstek.', '**▫️** **Kullanım: ( .istek ) **')
.addField('🔅 Ping.', '**▫️** **Kullanım: ( .ping) **')
.addField('🧽 Emoji Bilgi.', '**▫️** **Kullanım: ( .emojibilgi) **')
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
  name: 'bot',
  description: 'Tüm komutları gösterir.',
  usage: 'yardım'
};