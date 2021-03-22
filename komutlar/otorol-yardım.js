const Discord = require('discord.js');

exports.run = function(client, message) {
const embed = new Discord.RichEmbed()
.setColor('RANDOM')
.setTitle('<a:750076062716788807:760868702785634374> Otorol Komutlarımız')
.setTimestamp()
.addField('Otorol Ayarlama.', '**▫️** **Kullanım: ( .oto-rol-ayarla )**')
.addField('Otorol Kapatma.', '**▫️** **Kullanım: ( .otorol-kapat )**')
.addField('Otorol Mesajı.', '**▫️** **Kullanım: ( .otorol-msg )**')
.addField('Gerekli Olabilecek Destek 1.', '**▫️** ** Botumuzun Yetkisi Üstte Olmalıdır Aksi Takdirde Otorol Veremez.**')
.addField('Örnek 1.', '**▫️** **Kullanım: ( .otorol-msg ) -uye- Hoşgeldin! senle beraber -uyesayisi- Kişiyiz!**')
.addField('🗡 Örnek 2.', '**▫️** **Kullanım: ( .oto-rol-ayarla @rol #kanal )**')
.addField('Değişkenler 1.', '**▫️** **-uye- Kişiyi Doğrudan Etiketler.**')
.addField('Değişkenler 2.', '**▫️** **-uyetag- Kişinin Adını Ve Etiketini Atar.**')
.addField('Değişkenler 3.', '**▫️** **-rol- Otorolde Belirlenmiş Olan Rolü Atar.**')
.addField('Değişkenler 4.', '**▫️** **-server- Sunucu İsmini Atar.**')
.addField('Değişkenler 5.', '**▫️** **-uyesayisi- Sunucuda Olan Üyeleri Sayar Ve Onu Mesaja Döker.**')
.setFooter('Eveylnn', client.user.avatarURL)
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
  name: 'otorol',
  description: 'Tüm komutları gösterir.',
  usage: 'yardım'
};