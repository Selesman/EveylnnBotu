const Discord = require('discord.js');

exports.run = function(client, message) {
const embed = new Discord.RichEmbed()
.setColor('RANDOM')
.setTitle('🔔 Seviye Komutları')
.setTimestamp()
.addField('🎐 Seviye.', '**▫️** **Kullanım: ( .seviye )**')
.addField('🤿 Seviye Ayarlar.', '**▫️** **Kullanım: ( .seviye-ayarlar )**')
.addField('🥫 Seviye Top.', '**▫️** **Kullanım: ( .seviye-top )**')
.addField('🩸 Seviye Log.', '**▫️** **Kullanım: ( .seviye-log )**')
.addField('🧩 Seviye Rol.', '**▫️** **Kullanım: ( .seviye-rol )**')
.addField('🪕 Seviye Sınır.', '**▫️** **Kullanım: ( .seviye-sınır )**')
.addField('💐 Seviye XP.', '**▫️** **Kullanım: ( .seviye-xp )**')
.addField('📮 Seviye Rolleri.', '**▫️** **Kullanım: ( .seviye-rolleri )**')
.addField('❌ Seviye Sıfırla.', '**▫️** **Kullanım: ( .seviye-sıfırla )**')
.addField('🎰 NOT.', '**▫️** **Sistem Çok Uzun Olduğundan Dolayı 2 Yardım Koduna Ayrılmıştır. .level2**')
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
  name: 'level',
  description: 'Tüm komutları gösterir.',
  usage: 'yetkili'
};