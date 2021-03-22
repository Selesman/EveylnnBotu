const Discord = require('discord.js');

exports.run = (client, message, args) => {

    let emojiname = args[0];

    const emoji = (message.guild.emojis.find("name", `${emojiname}`))

    if (!emojiname) return message.channel.send("・ Emoji İsmi Belirtmediniz")

    const embed = new Discord.RichEmbed()

    .setColor("RANDOM")

    .addField("• Emojinin ismi", `・ ${emojiname}`)

    .addField("• Emoji İd", `・ ${emoji.id}`)

    .addField("• Link", `・ ${emoji.url}`)

    .setTimestamp()

    message.channel.send(embed)

}

exports.conf = {

    enabled: true,

    guildOnly: false,

    aliases: [],

    permLevel: 3

}

exports.help = {

    name: 'emoji-bilgi',

}