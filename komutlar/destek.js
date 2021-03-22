const Discord = require("discord.js");
const ayarlar = require('../ayarlar.json');
const db = require('quick.db');

exports.run = async(client, message, args) => {
  let prefix = ayarlar.prefix

   if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send(`Buna yetkin yok!`);
  if (!args[0]) return message.channel.send(new Discord.RichEmbed() .setColor('PURPLE') .setAuthor(`${client.user.username} Destek Sistemi`) .setDescription`**Eksik Veya Hatalı Komut Kullanımı**`

.setFooter(`Komutu Kullanan: ${message.author.tag}`, `${message.author.avatarURL}`) ) 

  if(args[0] == 'kapat') {
    db.delete(`destekkanal${message.guild.id}`)
db.delete(`destekrole${message.guild.id}`)
    message.channel.send(`**Destek Sistemi Başarıyla Kapatıldı!**`)
    return;
  }
  
  if(args[0] == 'rol') {
    let role = message.mentions.roles.first() || message.guild.roles.find(ff => ff.name === args.slice(1).join(' '))
    db.set(`destekrole${message.guild.id}`, role.id)
    message.channel.send(`**Destek Sistemi Yetkili Rolü Ayarlandı!\nAyarlanan Rol:** \`${role.name}\``) 
    return;
  }
  if(args[0] == 'kanal') {
    let akanal = message.mentions.channels.first()  || message.guild.channels.find(ff => ff.name === args.slice(1).join(' '))
db.set(`destekkanal${message.guild.id}`, akanal.id)
    message.channel.send(`**Destek Sistemi Kanalı Ayarlandı!\n Ayarlanan Kanal: \`${akanal.name}\`**`)
}}
exports.conf = { 
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 2
};

exports.help = {
  name: "destek",
  description: "Destek Sistemini Açmayı Sağlar!",
  usage: "destek",
};  