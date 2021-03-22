const Discord = require("discord.js");
const db = require("quick.db");
const a = require("../ayarlar.json");

exports.run = async (client, message, args, params, modlog) => {
  if (!message.member.hasPermission("ADMINISTRATOR"))
    return message.channel.send(new Discord.RichEmbed().setDescription("**Bu Komutu Kullanmak için `YÖNETİCİ` Yetkisine Sahip Olmalısın!").setColor("RED"));
  if (!args[0])
  message.channel.send(new Discord.RichEmbed().setDescription("**Eksik Komut Kullanımı!**").addField("Doğru Kullanım",`\`${a.prefix}ses-log ayarla #kanal-ismi\` **veya** \`${a.prefix}ses-log sıfırla\``).setColor("RED"));
  
  if (args[0] === "ayarla") {
    let mesajlog = message.mentions.channels.first();
    if (!mesajlog)
    message.channel.send(new Discord.RichEmbed().setAuthor(message.author.username).setDescription("**Bir Kanal Etiketlemelisin!**").addField("Doğru Kullanım",`\`${a.prefix}ses-log ayarla #kanal-ismi\``).setColor("RED"));
    
    await db.set(`seslog_${message.guild.id}`, `${mesajlog.id}`);
    message.channel.send(new Discord.RichEmbed().setAuthor(message.author.username).setDescription(`**Sesli Kanala Giriş Bildirim Kanalı Başarıyla <#${mesajlog.id}> Olarak Ayarlandı!**`)).setColor("GREEN")}
  if (args[0] === "sıfırla") {
    await db.delete(`seslog_${message.guild.id}`);
    let log = new Discord.RichEmbed().setAuthor(message.author.username).setDescription("**Sesli Kanala Giriş Bildirim Kanalı Başarıyla Sıfırlandı!**")
    message.channel.send(log)}
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["ses-log", "ses-üye-log", "ses-giriş-log","ses-log-ayarla","seslog","sesüyelog","sesgirişlog","seslogayarla","s-log"],
  permLevel: 0
};

exports.help = {
  name: "ses-log",
  description: "Sunucudan Yasaklama Bildirim Log Kanalını Ayarlar",
  usage: "!ses-log ayarla #kanal-ismi veya !ses-log sıfırla"
};