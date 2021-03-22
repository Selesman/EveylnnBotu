const Discord = require('discord.js');

exports.run = function(client, message) {
const embed = new Discord.RichEmbed()
.setColor('RANDOM')
.setTitle('🔔 Kullanıcı Komutları')
.setTimestamp()
.addField('🍈 Davet.', '**▫️** **Kullanım: ( .davet )**')
.addField('🔍 Havadurumu.', '**▫️** **Kullanım: ( .havadurumu )**')
.addField('🎉 Avatar (İD Girseniz Bile Olur).', '**▫️** **Kullanım: ( .avatar )**')
.setFooter('💎 Eveylnn  ', client.user.avatarURL)
.setTimestamp()
message.channel.send(embed)
};

exports.conf = {
  enabled: true,
  guildOnly: false, 
  aliases: [], 
  permLevel: 0 
};

exports.help = {
  name: 'kullanıcı',
  description: 'Tüm komutları gösterir.',
  usage: 'yetkili'
};