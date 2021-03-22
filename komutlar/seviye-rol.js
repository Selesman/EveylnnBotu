const Discord = require('discord.js');
const db = require("quick.db")
const ayarlar = require("../ayarlar.json")
exports.run = async (client, message, args) => {
  if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(new Discord.RichEmbed()
.setTitle(`Uyarı | Warning!`)
.setDescription(`**[\`System\`]**\nBu Komutu Kullanmak İçin; \`ADMINISTRATOR\` Yetkisine Sahip Olmalısın!`))
let link = `[Destek Sunucusu!](https://discord.gg/ywqVAwb)`
let link2 = `[Support Server!](https://discord.gg/ywqVAwb)`
let link1 = `[Destek](https://discord.gg/ywqVAwb)`
let p = ayarlar.prefix
if(!args[0]) {
return message.channel.send(new Discord.RichEmbed()                              
.setColor("ff0000")
.setTitle(`${client.user.username} | Seviye-Rol Komutları!`)
.setDescription(`**${link} & ${link1}**`)          
.setTimestamp()        
.setThumbnail(client.user.avatarURL)   
.setFooter(`${client.user.username} Seviye-Rol Sistemi!`, client.user.avatarURL)  
.addField(`:ringed_planet: Rol oluşturma:`, `\`${p}seviyerol @etiket <seviye>\``)
.addField(`:ringed_planet: Tüm rolleri silme:`, `\`${p}seviyerol temizle\``)
.addField(`:ringed_planet: Ayarlanan Rolleri Görmek:`, `\`${p}seviyerolleri\``)) 
}
      
      if(args[0] == 'sıfırla' || args[0] == "clear") {
        db.delete(`srol.${message.guild.id}`)
        db.delete(`srol2.${message.guild.id}`)
        db.delete(`srol3.${message.guild.id}`)
        return message.channel.send(`**[\`System\`]**\nSeviye-Rol Başarıyla Sıfırlandı!\n`)
      }
      if(isNaN(args[1])) return message.channel.send(`**[\`System\`]**\nSeviye bir sayı olmalı!`)
      var user = message.mentions.users.first() || message.author
      var role = message.mentions.roles.first()
      db.push(`srol.${message.guild.id}`, role.id)
      db.set(`srol2.${message.guild.id}.${role.id}`, args[1])
      db.push(`srol3.${message.guild.id}.${role.id}`, args[1])
      message.channel.send(args[1]+ ' level ' +role + ' olarak ayarlandı!')

  

};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'seviye-rol'
};