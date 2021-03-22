const Discord = require('discord.js');

exports.run = function(client, message) {
const embed = new Discord.RichEmbed()
.setColor('RANDOM')
.setTitle('🔔 Sayaç Komutlarımız')
.setTimestamp()
.addField('🎡 Sayaç Ayarlama.', '**▫️** **Kullanım:( .sayaç-ayarla )**')
.addField('🚨 Sayaç Kapatma.', '**▫️** **Kullanım   sayaç sıfırlamak için sayaçcı başka kanala ayarlayın ve o kanalı silin**')
.addField('🌙 Sayaç HG Mesajı.', '**▫️** **Kullanım: ( .sayaç-hg-msg )**')
.addField('🌀 Sayaç BB Mesajı.', '**▫️** **Kullanım: ( .sayaç-bb-msg )**')

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
  name: 'sayaç',
  description: 'Tüm komutları gösterir.',
  usage: 'yardım'
};