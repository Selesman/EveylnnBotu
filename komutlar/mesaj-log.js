const Discord = require("discord.js");
const db = require("quick.db");
const a = require("../ayarlar.json");

exports.run = async (client, message, args, params, modlog) => {
  if (!message.member.hasPermission("ADMINISTRATOR"))
    return message.channel.send(new Discord.RichEmbed().setDescription("**Bu Komutu Kullanmak için `YÖNETİCİ` Yetkisine Sahip Olmalısın!").setColor("RED"));
  if (!args[0])
  message.channel.send(new Discord.RichEmbed().setDescription("**Eksik Komut Kullanımı!**").addField("Doğru Kullanım",`\`${a.prefix}mesaj-log ayarla #kanal-ismi\` **veya** \`${a.prefix}mesaj-log sıfırla\``).setColor("RED"));
  
  if (args[0] === "ayarla") {
    let mesajlog = message.mentions.channels.first();
    if (!mesajlog)
    message.channel.send(new Discord.RichEmbed().setAuthor(message.author.username).setDescription("**Bir Kanal Etiketlemelisin!**").addField("Doğru Kullanım",`\`${a.prefix}mesaj-log ayarla #kanal-ismi\``).setColor("RED"));
    
    await db.set(`mslog_${message.guild.id}`, `${mesajlog.id}`);
    message.channel.send(new Discord.RichEmbed().setAuthor(message.author.username).setDescription(`**Mesaj \`Silme\` - \`Editleme\` Bildirim Kanalı Başarıyla <#${mesajlog.id}> Olarak Ayarlandı!**`)).setColor("GREEN")}
  if (args[0] === "sıfırla") {
    await db.delete(`mslog_${message.guild.id}`);
    let log = new Discord.RichEmbed().setAuthor(message.author.username).setDescription("**Mesaj `Silme` - `Editleme` Bildirim Kanalı Başarıyla Sıfırlandı!**")
    message.channel.send(log)}
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["ms-log", "md-log", "mesaj-log","mesaj-log-ayarla","mslog","mdlog","mesajlog","mesajlogayarla","m-log"],
  permLevel: 0
};

exports.help = {
  name: "mesaj-log",
  description: "Mesaj Editleme ve Silme Bildirim Log Kanalını Ayarlar",
  usage: "!mesaj-log ayarla #kanal-ismi veya !mesaj-log sıfırla"
};