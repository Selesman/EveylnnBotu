const Discord = require("discord.js");
const db = require("quick.db");
const a = require("../ayarlar.json");

exports.run = async (client, message, args, params, modlog) => {
  if (!message.member.hasPermission("ADMINISTRATOR"))
    return message.channel.send(new Discord.RichEmbed().setDescription("**Bu Komutu Kullanmak için `YÖNETİCİ` Yetkisine Sahip Olmalısın!").setColor("RED"));
  if (!args[0])
  message.channel.send(new Discord.RichEmbed().setDescription("**Eksik Komut Kullanımı!**").addField("Doğru Kullanım",`\`${a.prefix}rol-log ayarla #kanal-ismi\` **veya** \`${a.prefix}rol-log sıfırla\``).setColor("RED"));
  
  if (args[0] === "ayarla") {
    let mesajlog = message.mentions.channels.first();
    if (!mesajlog)
    message.channel.send(new Discord.RichEmbed().setAuthor(message.author.username).setDescription("**Bir Kanal Etiketlemelisin!**").addField("Doğru Kullanım",`\`${a.prefix}rol-log ayarla #kanal-ismi\``).setColor("RED"));
    
    await db.set(`rslog_${message.guild.id}`, `${mesajlog.id}`);
    message.channel.send(new Discord.RichEmbed().setAuthor(message.author.username).setDescription(`**Rol \`Silme\` - \`Oluşturma\` Bildirim Kanalı Başarıyla <#${mesajlog.id}> Olarak Ayarlandı!**`)).setColor("GREEN")}
  if (args[0] === "sıfırla") {
    await db.delete(`rslog_${message.guild.id}`);
    let log = new Discord.RichEmbed().setAuthor(message.author.username).setDescription("**Rol `Silme` - `Oluşturma` Bildirim Kanalı Başarıyla Sıfırlandı!**")
    message.channel.send(log)}
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["rs-log", "rs-log", "rol-log","rol-log-ayarla","rslog","rslog","rollog","rollogayarla","r-log"],
  permLevel: 0
};

exports.help = {
  name: "rol-log",
  description: "Rol Oluşturma ve Silme Bildirim Log Kanalını Ayarlar",
  usage: "!rol-log ayarla #kanal-ismi veya !rol-log sıfırla"
};
