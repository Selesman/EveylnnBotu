const Discord = require('discord.js');

exports.run = function(client, message) {
const embed = new Discord.RichEmbed()
.setColor('GRAY')
.setTitle('🔔 Ticket Komutları.')
.setTimestamp()
.addField('🍗 Destek Kanalı.', '**▫️** **Kullanım: ( .destek kanal )**')
.addField('🌂 Destek Rolü.', '**▫️** **Kullanım: ( .destek rol )**')
.addField('🐲 Destek Kapat.', '**▫️** **Kullanım: ( .destek kapat )**')
.addField('🦴 Örnek Kullanım.', '**▫️** **Kullanım: ( .destek kapat )**')
.addField('📖 Örnek Kullanım2.', '**▫️** **Kullanım: ( .destek kanal #kanal )**')
.addField('🎍 Örnek Kullanım3.', '**▫️** **Kullanım: ( .destek rol @rol )**')
.addField('👥 Gerekli Olabilecek Destek.', '**▫️** **Hepsi Büyük Harfler İle ``DESTEK`` Katagorisi Açmanız Lazım Açmassanız Çalışmaz**')
.addField('⚓ Gerekli Olabilecek Destek2.', '**▫️** **Eğerki ``DESTEK`` Kategorisi Açtıysanız ``.destek`` Yazarak Destek Açılabilirsiniz Ancak Ayarlanan Kanalda Kullanılabilir**')
.addField('💍 Gerekli Olabilecek Destek3.', '**▫️** **Unutmayın Sadece Destek Açan Ve Ayarlanan Rol Açılan Destek Kanalını Görebilir**')
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
  name: 'ticket',
  description: 'Tüm komutları gösterir.',
  usage: 'yardım'
};