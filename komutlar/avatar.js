 const Discord = require('discord.js');

  exports.run = (client, message, args) => {

    let user = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]) || message.author)

      const avatar = new Discord.RichEmbed()
    .setAuthor(user.user.username, user.user.avatarURL)
    .setImage(user.user.avatarURL)
   .setFooter(`${message.author.tag} tarafından istendi.`, message.author.avatarURL)
    .setColor("RANDOM")
      message.channel.send(avatar)
  };

  exports.conf = {
      enabled: true,
      guildOnly: false,
      aliases: ["pp","profil-foto","profil-fotoğraf"],
      permLevel: 0,
  }
  exports.help = {
      name: 'avatar',
      description: 'Etiketlediğiniz kullanıcının avatarını gösterir.',
      usage: 'avatar'
  }