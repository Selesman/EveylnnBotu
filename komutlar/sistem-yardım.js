const Discord = require('discord.js');

exports.run = function(client, message) {
const embed = new Discord.RichEmbed()
.setColor('GRAY')
.setTitle('🔔 Sistem Komutları.')
.setTimestamp()
.addField('📬 Sistemleri Aç', '**▫️** **Kullanım: ( .sistem aç )**')
.addField('📬 Sistemler Hakkında', '**▫️** **Bu sistem siz uğraşmadan reklam,küfür engel gibi komutları otomatik açar**')
.addField('🚩 Küfür Engel.', '**▫️** **Kullanım: ( .küfür-aç )**')
.addField('➕ Reklam Engel.', '**▫️** **Kullanım: ( .reklam-aç )**')
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
  name: 'sistemler',
  description: 'Tüm komutları gösterir.',
  usage: 'yardım'
};