const Discord = require('discord.js');

exports.run = (client, message) => {
  
  const alp = new Discord.RichEmbed()
  .setColor('RANDOM')
  .setTitle("Bot Davet Sistemi")
  .setDescription(`[Bot İnternet Sitesi İçin](https://evelynn-site.glitch.me/)\n [Botu Davet Et](https://discord.com/oauth2/authorize?client_id=797118261195046952&scope=bot&permissions=8)\n [Destek Sunucusuna Gelmek İçin](https://discord.gg/6xnHpdpVXm)`)
  message.channel.send(alp)
}
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['davet', 'botdavet', 'davetet'],
  permLevel: 0
}
exports.help = {
  name: "davet",
  usage: "bot-davet",
  description: "botu davet eder."
}
