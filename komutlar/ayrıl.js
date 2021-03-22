const Discord = require("discord.js");

exports.run = (client, message, args) => {


  let alp = new Discord.RichEmbed()
    .setTitle(`Hata`)
    .setTimestamp()
    .setFooter(client.user.username)
    .setThumbnail("https://cdn.discordapp.com/attachments/667450656050905118/686304135523336203/elif-ipek-in-bay-bay-memeler-partisi_1963727.gif")
    .setDescription(`**Sunucudan Ayrılmamı İstediğinden Eminmisin??**`)
    .setColor("#ffffff");
  message.channel.send(alp).then(sunucu => {
    sunucu.react("✅").then(() => sunucu.react("❌"));//Eveylnn 🔒 = Evet  🔓 = Hayır

    let yesFilter = (reaction, user) =>
      reaction.emoji.name === "✅" && user.id === message.author.id;
    let noFilter = (reaction, user) =>
      reaction.emoji.name === "❌" && user.id === message.author.id;

    let yes = sunucu.createReactionCollector(yesFilter, { time: 0 });
    let no = sunucu.createReactionCollector(noFilter, { time: 0 });
    yes.on("collect", r => {
      let codefest = new Discord.RichEmbed()
        .setTitle(`✅  İşlem Başarılı!`)
        .setDescription(`**Sunucudan Ayrılıyorum! Güle Güle!**`)
        .setColor("#1800ff")
        .setThumbnail(client.user.avatarURL)
        .setTimestamp()
        .setThumbnail(message.guild.iconURL)
        .setFooter(message.guild.name);
      message.channel.send(codefest).then(x => {
        x.delete(3000);
      });
      message.delete(3000);
      setInterval(() => {
        message.guild.leave();
      }, 4000);
    });

    no.on("collect", r => {
      sunucu.delete();
    });
  });
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["ayrıl"],
  permLevel: 3
};

exports.help = {
  name: "ayrıl",
  description: "Bot Sunucudan Ayrılır!",
  usage: "ayrıl"
};