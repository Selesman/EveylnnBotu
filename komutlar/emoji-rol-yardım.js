const Discord = require('discord.js');

exports.run = function(client, message) {
const embed = new Discord.RichEmbed()
.setColor('RANDOM')
.setTitle('🔔 Emoji Rol Komutları.')
.setTimestamp()
.addField('📡 Emoji Rol Log Kanalı.', '**▫️** **Kullanım: ( .emoji-rol-log )**')
.addField('💨 Emoji Rol Ayarlama.', '**▫️** **Kullanım: ( .emoji-rol-ayarla )**')
.addField('⚽ Gerekli Olabilecek Destek.', '**▫️** **.emoji-rol-ayarla Kodunu kullanırken mesaj id kullandığınız kanala yapınız**')
.addField('💸 Gerekli Olabilecek Destek 2.', '**▫️** **Sunucunuzda olan bir emojiyi ekleyemessiniz Discordun kendi emojilerini kullanabilirsiniz.**')
.addField('🌪 Örnek.', '**▫️** **.emoji-rol-log #kanal**')
.addField('🔗 Örnek 2.', '**▫️** **.emoji-rol-ayarla MesajİD Emoji @rol**')
.setFooter('💎  Eveylnn', client.user.avatarURL)
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
  name: 'emoji-rol',
  description: 'Tüm komutları gösterir.',
  usage: 'yardım'
};