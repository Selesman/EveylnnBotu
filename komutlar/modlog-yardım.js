const Discord = require('discord.js');

exports.run = function(client, message) {
const embed = new Discord.RichEmbed()
.setColor('RANDOM')
.setTitle('🔔 Mod Log sistemimiz.')
.setTimestamp()
.addField('🐇 Emoji Log.', '**▫️** **Kullanım: ( .emoji-log ayarla )**')
.addField('⚒️ Kanal Log.', '**▫️** **Kullanım: ( .kanal-log ayarla )**')
.addField('🖱️ Rol Log.', '**▫️** **Kullanım: ( .rol-log ayarla )**')
.addField('🃏 Mesaj Log.', '**▫️** **Kullanım: ( .mesaj-log ayarla )**')
.addField('🍇 Ses Log.', '**▫️** **Kullanım: ( .ses-log ayarla )**')
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
  name: 'mod-log',
  description: 'Tüm komutları gösterir.',
  usage: 'yardım'
};