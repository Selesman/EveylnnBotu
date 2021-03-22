const Discord = require('discord.js');
const client = new Discord.Client();
const ayarlar = require('./ayarlar.json');
const chalk = require('chalk');
const moment = require('moment');
const { Client, Util } = require('discord.js');
const fs = require('fs');
const db = require('quick.db');
const http = require('http');
const express = require('express');

require('./util/eventLoader.js')(client);
const path = require('path');
const request = require('request');
const snekfetch = require('snekfetch');
const app = express();
app.get("/", (request, response) => {
response.sendStatus(200);
});
app.listen(process.env.PORT);

var prefix = ayarlar.prefix;

const log = message => {
    console.log(`${message}`);
};

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./komutlar/', (err, files) => {
    if (err) console.error(err);
    log(`${files.length} komut yüklenecek.`);
    files.forEach(f => {
        let props = require(`./komutlar/${f}`);
        log(`Yüklenen komut: ${props.help.name}.`);
        client.commands.set(props.help.name, props);
        props.conf.aliases.forEach(alias => {
            client.aliases.set(alias, props.help.name);
        });
    });
});

client.reload = command => {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(`./komutlar/${command}`)];
            let cmd = require(`./komutlar/${command}`);
            client.commands.delete(command);
            client.aliases.forEach((cmd, alias) => {
                if (cmd === command) client.aliases.delete(alias);
            });
            client.commands.set(command, cmd);
            cmd.conf.aliases.forEach(alias => {
                client.aliases.set(alias, cmd.help.name);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

client.load = command => {
    return new Promise((resolve, reject) => {
        try {
            let cmd = require(`./komutlar/${command}`);
            client.commands.set(command, cmd);
            cmd.conf.aliases.forEach(alias => {
                client.aliases.set(alias, cmd.help.name);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

client.unload = command => {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(`./komutlar/${command}`)];
            let cmd = require(`./komutlar/${command}`);
            client.commands.delete(command);
            client.aliases.forEach((cmd, alias) => {
                if (cmd === command) client.aliases.delete(alias);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

client.elevation = message => {
    if (!message.guild) {
        return;
    }
    let permlvl = 0;
    if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
    if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
    if (message.author.id === ayarlar.sahip) permlvl = 4;
    return permlvl;
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;

client.on('warn', e => {
    console.log(chalk.bgYellow(e.replace(regToken, 'that was redacted')));
});

client.on('error', e => {
    console.log(chalk.bgRed(e.replace(regToken, 'that was redacted')));
});







client.on("message", async message => {
  if(message.author.bot) return;
  var spl = message.content.split(" ");
  if(spl[0] === ".emoji-rol-ayarla") {
  var args = spl.slice(1);
  var msg, emoji, rol, ee = "";
  try {
    msg = await message.channel.fetchMessage(args[0])
    emoji = args[1]
    rol = message.guild.roles.get(args[2]) || message.mentions.roles.first();
    await msg.react(emoji)
    if(!rol) throw new Error("Düzgün bir rol yaz")
  } catch(e) {
    if(!e) return;
    e = (""+e).split("Error:")[1]
    if(e.includes("Cannot read property") || e.includes("Invalid Form Body")) {
      message.channel.send(`:warning: | Mesaj id hatalı!`)
    } else if(e.includes("Emoji")) {
      message.channel.send(`:warning: | Girdiğiniz emoji mesaja eklenemiyor!`)
    } else if(e.includes("ROLÜ")) {
      message.channel.send(`:warning: | Girdiğiniz rol geçersiz!`)
    }
    ee = e
  }
   if(ee) return;
   message.channel.send(`:white_check_mark: | Emoji rol, **${msg.content}** içerikli mesaja atandı!`)
   db.push(`tepkirol.${message.guild.id}`, {
     kanal: msg.channel.id,
     rol: rol.id,
     mesaj: msg.id,
     emoji: emoji
   })
  } else if(spl[0] === ".emoji-rol-log") {
    var args = spl.slice(1)
    var chan = message.guild.channels.get(args[0]) || message.mentions.channels.first()
    if(!chan) return message.channel.send(`:warning: | Kanal etiketle veya id gir`)
    db.set(`tepkirolkanal.${message.guild.id}`, chan.id)
    message.channel.send(":white_check_mark: | Tepkirol log kanalı "+ chan+ " olarak ayarlandı!")
  }
})

client.on("raw", async event => {
  if(event.t === "MESSAGE_REACTION_ADD") {
    var get = db.get(`tepkirol.${event.d.guild_id}`)
    if(!get) return;
    var rol = get.find(a => a.emoji === event.d.emoji.name && a.mesaj === event.d.message_id)
    if(!rol) return;
    rol = rol.rol
    var member = await client.guilds.get(event.d.guild_id).fetchMember(event.d.user_id)
    member.addRole(rol);
    var kanal = db.get(`tepkirolkanal.${event.d.guild_id}`)
    if(kanal) {
      var kanal = client.channels.get(kanal)
      kanal.send(member + " kullanıcısına, **" + kanal.guild.roles.get(rol).name + "** adlı rol verildi! <a:tikk:742761491064815637>")
    }
  } else if(event.t === "MESSAGE_REACTION_REMOVE") {
    var get = db.get(`tepkirol.${event.d.guild_id}`)
    if(!get) return;
    var rol = get.find(a => a.emoji === event.d.emoji.name && a.mesaj === event.d.message_id)
    if(!rol) return;
    rol = rol.rol
    var member = await client.guilds.get(event.d.guild_id).fetchMember(event.d.user_id)
    member.removeRole(rol);
    var kanal = db.get(`tepkirolkanal.${event.d.guild_id}`)
    if(kanal) {
      var kanal = client.channels.get(kanal)
      kanal.send(member + " kullanıcısından, **" + kanal.guild.roles.get(rol).name + "** adlı rol alındı! <a:hayr:742770353058873375>")
    }
  }
})















client.on("guildCreate", guild => {
  let alp1 = client.channels.get("747336242395480114")

 const alp = new Discord.RichEmbed()
.setTitle("SUNUCUYA EKLENDİM")
.setColor("GREEN")
.addField('** Sunucu ID**', `\`${guild.id}\``)
.addField('** Sunucu İsmi**', `\`${guild.name}\``)
.addField('** Üye Sayısı**', `\`${guild.members.size}\``)
.addField('** Kurucu**', `\`${guild.owner.user.tag}\``)
.addField('** Kurucu ID**', `\`${guild.owner.user.id}\``)
alp1.send(alp)
});

client.on("guildDelete", guild => {
  let alp2 = client.channels.get("747336242395480114")

 const alp3 = new Discord.RichEmbed()
.setTitle("SUNUCUDAN ATILDIM")
.setColor("RED")
.addField('** Sunucu ID**', `\`${guild.id}\``)
.addField('** Sunucu İsmi**', `\`${guild.name}\``)
.addField('** Üye Sayısı**', `\`${guild.members.size}\``)
.addField('** Kurucu**', `\`${guild.owner.user.tag}\``)
.addField('** Kurucu ID**', `\`${guild.owner.user.id}\``)
alp2.send(alp3)
});











client.on('guildMemberAdd', async member => {
  let ozelhosgeldin = await db.fetch(`ozelhosgeldin_${member.guild.id}`)
  if (!ozelhosgeldin) return;
  member.send(ozelhosgeldin ? ozelhosgeldin.replace('-sunucu-', `\`${member.guild.name}\``) .replace('-kullanıcı-',`\`${member.user.tag}\``) : ``)
})  

 client.on('guildMemberRemove', async member => {
  let ozelgorusuruz = await db.fetch(`ozelgorusuruz_${member.guild.id}`)
  if (!ozelgorusuruz) return;
  member.send(ozelgorusuruz ? ozelgorusuruz.replace('-sunucu-', `\`${member.guild.name}\``) .replace('-kullanıcı-',`\`${member.user.tag}\``) : ``)
})















client.on("guildMemberAdd", async member => {
  let kanal = await db.fetch(`otoRK_${member.guild.id}`);
  let rol = await db.fetch(`otoRL_${member.guild.id}`);
  let mesaj = db.fetch(`otoRM_${member.guild.id}`);
  if (!rol) return;

  if (!mesaj) {
    client.channels.get(kanal).send(":loudspeaker: :inbox_tray: Otomatik Rol Verildi Seninle Beraber `" + member.guild.memberCount + "` Kişiyiz! Hoşgeldin! `" + member.user.username + "`");
    return member.addRole(rol);
  }

  if (mesaj) {
    var mesajs = mesaj.replace("-uye-", `${member.user}`).replace("-uyetag-", `${member.user.tag}`).replace("-rol-", `${member.guild.roles.get(rol).name}`).replace("-server-", `${member.guild.name}`).replace("-uyesayisi-", `${member.guild.memberCount}`);
    member.addRole(rol);
    return client.channels.get(kanal).send(mesajs);
     }
});



client.on('message', async message => {
if (message.content === 's-fakekatıl') { 
  client.emit('guildMemberAdd', message.member || await message.guild.fetchMember(message.author));
    }
});



client.on('message', async message => {
if (message.content === 's-fakeayrıl') { 
  client.emit('guildMemberRemove', message.member || await message.guild.fetchMember(message.author));
    }
});


client.on("guildMemberAdd", async member => {
  const kanal = await db.fetch(`sayacK_${member.guild.id}`);
  if (!kanal) return;
  const sayaç = await db.fetch(`sayacS_${member.guild.id}`);
    const sonuç = sayaç - member.guild.memberCount;
  const mesaj = await db.fetch(`sayacHG_${member.guild.id}`)
   
  if (!mesaj) {
    return client.channels.get(kanal).send(":loudspeaker: :inbox_tray: Kullanıcı Katıldı! `" + sayaç + "` Kişi Olmamıza `" + sonuç + "` Kişi Kaldı `" + member.guild.memberCount + "` Kişiyiz!" + "`" + member.user.username + "`");
  }

  if (member.guild.memberCount == sayaç) {
    return client.channels.get(kanal).send(`:loudspeaker: Sayaç Sıfırlandı! \`${member.guild.memberCount}\` Kişiyiz!`)
    await db.delete(`sayacK_${member.guild.id}`)
    await db.delete(`sayacS_${member.guild.id}`)
    await db.delete(`sayacHG_${member.guild.id}`)
    await db.delete(`sayacBB_${member.guild.id}`)
  }
  if (mesaj) {
    const mesaj31 = mesaj.replace("-uye-", `${member.user}`).replace("-uyetag-", `${member.user.tag}`).replace("-server-", `${member.guild.name}`).replace("-uyesayisi-", `${member.guild.memberCount}`).replace("-kalanuye-", `${sonuç}`).replace("-hedefuye-", `${sayaç}`)
    return client.channels.get(kanal).send(mesaj31);
    
  }
});

client.on("guildMemberRemove", async member => {

  const kanal = await db.fetch(`sayacK_${member.guild.id}`);
  const sayaç = await db.fetch(`sayacS_${member.guild.id}`);
  const sonuç = sayaç - member.guild.memberCount;
  const mesaj = await db.fetch(`sayacBB_${member.guild.id}`)
  if (!kanal) return;
  if (!sayaç) return;
    ///....

  if (!mesaj) {
    return client.channels.get(kanal).send(":loudspeaker: :outbox_tray: Kullanıcı Ayrıldı. `" + sayaç + "` Kişi Olmamıza `" + sonuç + "` Kişi Kaldı `" + member.guild.memberCount + "` Kişiyiz!" + "`" + member.user.username + "`");
      }

  if (mesaj) {
    const mesaj31 = mesaj.replace("-uye-", `${member.user.tag}`).replace("-uyetag-", `${member.user.tag}`).replace("-server-", `${member.guild.name}`).replace("-uyesayisi-", `${member.guild.memberCount}`).replace("-kalanuye-", `${sonuç}`).replace("-hedefuye-", `${sayaç}`)
    return client.channels.get(kanal).send(mesaj31);
  }
});




























client.on('message', async (msg, member, guild) => {
  let i = await  db.fetch(`saas_${msg.guild.id}`)
      if(i === 'açık') {
        if (msg.content.toLowerCase() === 'sa') {
        msg.reply('**Aleykum Selam Hoşgeldin**');
          await msg.react(':yldz:')
           msg.react('🇦'); 
msg.react('🇸'); 
                     msg.react('<a:gl:726064061489348649')

      } 
      }
    });






client.on("guildMemberAdd", async member => {
  let girenKisi = client.users.get(member.id);
  let girisKanal = client.channels.get(db.fetch(`hgK_${member.guild.id}`));
  let Güvenli = ` ${member} adlı kullanıcının hesabı güvenli!`;
  let Şüpheli = ` ${member} adlı kullanıcının hesabı güvenli değil!`;

  const ktarih = new Date().getTime() - girenKisi.createdAt.getTime();
  var kontrol;
  if (ktarih > 2629800000) kontrol = Güvenli;
  if (ktarih < 2629800001) kontrol = Şüpheli;
  let kanal = await db.fetch(`hgK_${member.guild.id}`);
  if (!kanal) return;
  const giris = new Discord.RichEmbed()
    .setColor("GREEN")
    .setDescription(
      `${member} Adlı Kullanıcı Aramıza Katıldı!\n\n \n Bu Kullanıcıyla Birlikte **${member.guild.memberCount}** Kişi Olduk!\n Kullanıcı İD **${member.user.id}**\n\n**Güvenlik Durumu;**\n${kontrol}`
    );
  client.channels.get(kanal).send(giris);
}); 
client.on("guildMemberRemove", async member => {
  let kanal = await db.fetch(`baybayK_${member.guild.id}`);
  if (!kanal) return;
  const cikis = new Discord.RichEmbed()
    .setColor("RED")
    .setDescription(
      ` ${member} Adlı Kullanıcı Aramızdan Ayrıldı!\n\n Bu Kullanıcının Aramızdan Ayrılmasıyla Birlikte **${member.guild.memberCount}** Kişiye Düştük!\n Kullanıcı İD **${member.user.id}**\n`
    );
  client.channels.get(kanal).send(cikis);
});







client.on("emojiCreate", async(emoji) => {
  let eslog = await db.fetch(`eslog_${emoji.guild.id}`);
  if (!eslog) return;
  const entry = await emoji.guild.fetchAuditLogs({type: 'EMOJI_CREATE'}).then(audit => audit.entries.first());
  let embed = new Discord.RichEmbed() //dcs
  .setThumbnail(entry.executor.avatarURL)
  .setTitle("Emoji Oluşturma")
  .addField("**Emojiyi Oluşturan Kişi**", `<@${entry.executor.id}>`)
  .addField("**Emojinin Resmi**",  `ー ${emoji}`)
  .addField("**Oluşturulan Emoji**", `İsmi: \`${emoji.name}\``)
  .setTimestamp()
  .setColor("GREEN")
  client.channels.get(eslog).send(embed)
})

//MOD LOG EMOJİ SİLME

 client.on("emojiDelete", async(emoji) => {
  let eslog = await db.fetch(`eslog_${emoji.guild.id}`);
  if (!eslog) return;
  const entry = await emoji.guild.fetchAuditLogs({type: 'EMOJI_DELETE'}).then(audit => audit.entries.first()); //dcs
  let embed = new Discord.RichEmbed()
  .setThumbnail(entry.executor.avatarURL)
  .setTitle("Emoji Silme")
  .addField("**Emojiyi Silen Kişi**", `<@${entry.executor.id}>`)
  .addField("**Silinen Emoji**", `İsmi: ${emoji}`)
  .setTimestamp()
  .setColor("RED")
  client.channels.get(eslog).send(embed)
})

//MOD LOG EMOJİ GÜNCELLEME

client.on("emojiUpdate", async(oldEmoji, newEmoji) => {
  let eslog = await db.fetch(`eslog_${oldEmoji.guild.id}`); //dcs
  if (!eslog) return;
  const entry = await oldEmoji.guild.fetchAuditLogs({type: 'EMOJI_UPDATE'}).then(audit => audit.entries.first());
  let embed = new Discord.RichEmbed()
  .setThumbnail(entry.executor.avatarURL)
  .setTitle("Emoji Güncelleme")
  .addField("**Emojiyi Güncelleyen Kişi**", `<@${entry.executor.id}>`)
  .addField("**Emojinin Resmi**", `ー ${newEmoji}`)
  .addField("**Güncellenmeden Önceki Emoji**", `Eski İsmi: \`${oldEmoji.name}\``)
  .addField("**Güncellendikten Sonraki Emoji**", `Yeni İsmi: \`${newEmoji.name}\``)
  .setTimestamp()
  .setColor("GREEN")
  client.channels.get(eslog).send(embed)
})








client.on("channelCreate", async(channel) => {
let kslog = await db.fetch(`kslog_${channel.guild.id}`);
  if (!kslog) return;
  const entry = await channel.guild.fetchAuditLogs({type: 'CHANNEL_CREATE'}).then(audit => audit.entries.first());
  let kanal;
  if (channel.type === "text") kanal = `<#${channel.id}>`
  if (channel.type === "voice") kanal = `\`${channel.name}\``
  let embed = new Discord.RichEmbed() 
  .setThumbnail(entry.executor.avatarURL)
  .setTitle("Kanal Oluşturma")
  .addField("**Kanalı Oluşturan Kişi**", `<@${entry.executor.id}>`)
  .addField("**Oluşturduğu Kanal**", `${kanal}`)
  .setTimestamp()
  .setColor("GREEN")
  client.channels.get(kslog).send(embed)
  })

//MOD LOG KANAL SİLME

client.on("channelDelete", async(channel) => {
let kslog = await db.fetch(`kslog_${channel.guild.id}`);
  if (!kslog) return;
  const entry = await channel.guild.fetchAuditLogs({type: 'CHANNEL_DELETE'}).then(audit => audit.entries.first());
  let embed = new Discord.RichEmbed()
  .setThumbnail(entry.executor.avatarURL)
  .setTitle("Kanal Silme")
  .addField("**Kanalı Silen Kişi**", `<@${entry.executor.id}>`)
  .addField("**Silinen Kanal**", `\`${channel.name}\``)
  .setTimestamp()
  .setColor("RED") 
  client.channels.get(kslog).send(embed)
  })






//MOD LOG MESAJ SİLME

client.on("messageDelete", async message => {
  let mslog = await db.fetch(`mslog_${message.guild.id}`);
  if (!mslog) return;
  const entry = await message.guild.fetchAuditLogs({type: 'MESSAGE_DELETE'}).then(audit => audit.entries.first());
  let embed = new Discord.RichEmbed()
  .setThumbnail(message.author.avatarURL) 
  .setTitle("Mesaj Silme")
  .addField("**Mesajın Sahibi**", `<@${message.author.id}> **|** \`${message.author.id}\``)
  .addField("**Mesaj**", `${message.content}`)
  .setTimestamp()
  .setColor("RED")
  client.channels.get(mslog).send(embed)
});

//MMOD LOG MESAJ EDİTLEME

client.on("messageUpdate", async (oldMessage, newMessage) => {
  let mslog = await db.fetch(`mslog_${oldMessage.guild.id}`);
  if (!mslog) return;
  let embed = new Discord.RichEmbed()
  .setThumbnail(oldMessage.author.avatarURL) 
  .setTitle("Mesaj Düzenleme")
  .addField("**Mesajın Sahibi**", `<@${oldMessage.author.id}> | **${oldMessage.author.id}**`)
  .addField("**Eski Mesajı**", `${oldMessage.content}`)
  .addField("**Yeni Mesajı**", `${newMessage.content}`)
  .setTimestamp()
  .setColor("RED")
  client.channels.get(mslog).send(embed)
});







client.on("roleCreate", async(role) => {
let rslog = await db.fetch(`rslog_${role.guild.id}`);
  if (!rslog) return;
  const entry = await role.guild.fetchAuditLogs({type: 'ROLE_CREATE'}).then(audit => audit.entries.first()); //dcs
  let embed = new Discord.RichEmbed()
  .setThumbnail(entry.executor.avatarURL)
  .setTitle("Rol Oluşturma")
  .addField("**Rolü Oluşturan Kişi**", `<@${entry.executor.id}>`)
  .addField("**Oluşturulan Rol**", `\`${role.name}\` ** | ** \`${role.id}\``)
  .setTimestamp()
  .setColor("GREEN")
  client.channels.get(rslog).send(embed)
  })

//MOD LOG ROL SİLME

client.on("roleDelete", async(role) => {
let rslog = await db.fetch(`rslog_${role.guild.id}`);
  if (!rslog) return;
  const entry = await role.guild.fetchAuditLogs({type: 'ROLE_DELETE'}).then(audit => audit.entries.first());
  let embed = new Discord.RichEmbed()
  .setThumbnail(entry.executor.avatarURL) 
  .setTitle("Rol Silme")
  .addField("**Rolü Silen Kişi**", `<@${entry.executor.id}>`)
  .addField("**Silinen Rol**", `\`${role.name}\` ** | ** \`${role.id}\``)
  .setTimestamp()
  .setColor("RED")
  client.channels.get(rslog).send(embed)
  })




client.on("voiceStateUpdate", async(oldMember, newMember) => {
let seslog = await db.fetch(`seslog_${oldMember.guild.id}`);
 if (!seslog) return;
  let embed = new Discord.RichEmbed()
.setThumbnail(oldMember.user.avatarURL)
 .setTitle("Ses Kanalına Giriş")
 .addField("**Kanala Giren Kişi**", `<@${oldMember.id}>`)
 .addField("**Şuanda Bulunduğu Kanal**", `\`${newMember.voiceChannel.name}\` **|** \`${newMember.voiceChannel.id}\``) 
 .setTimestamp()
  .setColor("RED")
  client.channels.get(seslog).send(embed)
})







client.on("message", async msg => {
  if(msg.content.startsWith(prefix)) return;
  const db = require('quick.db');
  var id = msg.author.id;
  var gid = msg.guild.id;
  var xp = await db.fetch(`xp_${id}_${gid}`);
  var lvl = await db.fetch(`lvl_${id}_${gid}`);
  let seviyexp = await db.fetch(`seviyexp${msg.guild.id}`)
  const skanal = await db.fetch(`seviyekanal${msg.guild.id}`)
  let kanal = msg.guild.channels.get(skanal)
  if (msg.author.bot === true) return;
  let seviyeEmbed = new Discord.RichEmbed()
   seviyeEmbed.setDescription(`Tebrik ederim <@${msg.author.id}>! Seviye atladın ve **${lvl+1}** seviye oldun!`)
   seviyeEmbed.setFooter(`${client.user.username} | Seviye Sistemi`)
   seviyeEmbed.setColor("ff0000")
   if(!lvl) {
    db.set(`xp_${id}_${gid}`, 5);
    db.set(`lvl_${id}_${gid}`, 1);
    db.set(`xpToLvl_${id}_${gid}`, 100);
    db.set(`top_${id}`, 1)
    }
  
  let veri1 = [];
  
  if(seviyexp) veri1 = seviyexp
  if(!seviyexp) veri1 = 5
  
  if (msg.content.length > 7) {
    db.add(`xp_${id}_${gid}`, veri1)
  };
  let seviyesınır = await db.fetch(`seviyesınır${msg.guild.id}`)

    let veri2 = [];
  
  if(seviyesınır) veri2 = seviyesınır
  if(!seviyesınır) veri2 = 250
   
  if (await db.fetch(`xp_${id}_${gid}`) > veri2) {
    if(skanal) {
 kanal.send(new Discord.RichEmbed()
   .setDescription(`Tebrik ederim <@${msg.author.id}>! Seviye atladın ve **${lvl+1}** seviye oldun!`)
   .setFooter(`${client.user.username} | Seviye Sistemi`)
   .setColor("ff0000"))
    }
    db.add(`lvl_${id}_${gid}`, 1)
    db.delete(`xp_${id}_${gid}`)};
    db.set(`top_${id}`, Math.floor(lvl+1))
  });

//SEVİYE-ROL-----------------------------------
client.on('message', async message => {
  var id = message.author.id;
  var gid = message.guild.id;
  let rrol = await db.fetch(`rrol.${message.guild.id}`)
  var level = await db.fetch(`lvl_${id}_${gid}`);
  
    if(rrol) {
  rrol.forEach(async rols => {
    var rrol2 = await db.fetch(`rrol2.${message.guild.id}.${rols}`)
    if(Math.floor(rrol2) <= Math.floor(level)) {
      let author = message.guild.member(message.author)
      author.addRole(rols)
    }
     else if(Math.floor(rrol2) >= Math.floor(level)) {
      let author = message.guild.member(message.author)
      author.removeRole(rols)
    }
  })
  }
  
    if(message.content == 's-rütbeler') {
    if(!rrol) {
                message.channel.send(new Discord.RichEmbed()
                      .setColor("ff0000")
                      .setFooter(`${client.user.username} Seviye-Rol Sistemi!`, client.user.avatarURL)
                      .setDescription(`Herhangi bir rol oluşturulmadı.`))
      
      
      return;
    }
        const { RichEmbed } = require('discord.js')
      let d = rrol.map(x => '<@&'+message.guild.roles.get(x).id+'>' + ' **' + db.get(`rrol3.${message.guild.id}.${x}`)+' Seviye**' ).join("\n")
    message.channel.send(new RichEmbed()
                      .setColor("ff0000")
                      .setFooter(`${client.user.username} Seviye-Rol Sistemi!`, client.user.avatarURL)
                      .setDescription(`${d}`))
  }
  
  
})

client.on('message', async message => {
  var id = message.author.id;
  var gid = message.guild.id;
  let srol = await db.fetch(`srol.${message.guild.id}`)
  var level = await db.fetch(`lvl_${id}_${gid}`);
  if(srol) {
  srol.forEach(async rols => {
    var srol2 = await db.fetch(`srol2.${message.guild.id}.${rols}`)
    if(Math.floor(srol2) <= Math.floor(level)) {
      let author = message.guild.member(message.author)
      author.addRole(rols)
    }
     else if(Math.floor(srol2) >= Math.floor(level)) {
      let author = message.guild.member(message.author)
      author.removeRole(rols)
    }
  })
  }
    if(message.content == '.seviye-rolleri' || message.content == ".levelroles") {
    if(!srol) {
                message.channel.send(new Discord.RichEmbed()
                      .setColor("ff0000")
                      .setFooter(`${client.user.username} Seviye-Rol Sistemi!`, client.user.avatarURL)
                      .setDescription(`Herhangi bir rol oluşturulmadı.`))
      return;
    }
        const { RichEmbed } = require('discord.js')
      let d = srol.map(x => '<@&'+message.guild.roles.get(x).id+'>' + ' **' + db.get(`srol3.${message.guild.id}.${x}`)+' Seviye**' ).join("\n")
    message.channel.send(new RichEmbed()
                      .setColor("ff0000")
                      //.setColor(message.guild.member(message.author).highestRole.hexColor)
                      .setFooter(`${client.user.username} Seviye-Rol Sistemi!`, client.user.avatarURL)
                      .setDescription(`${d}`))
  }
  
})








client.on("message", msg => {
  const reklama = db.fetch(`linkK_${msg.channel.id}`)
  if (!reklama) return
  var regex = new RegExp("^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?");
    if (regex.test(msg.content) == true) {
    if (msg.member.hasPermission("BAN_MEMBERS")) {
      return;
    }
    
   msg.delete()
    const Embed = new Discord.RichEmbed()
    .setColor("BLUE")
    .setAuthor("Eveylnn", client.user.avatarURL)
    .setDescription(`${msg.author} Reklam Yasak Bunu Bilmiyormusun! ${client.emojis.get("726064061489348649")}`)
    msg.channel.send(Embed).then(sil => sil.delete(3000))
  }
})

client.on("message", msg => {
  const reklama = db.fetch(`reklamK_${msg.channel.id}`)
  if (!reklama) return
    const kelime = ["discord.gg", "discord.me", "discordapp.com", "discord.io", "discord.tk", "www.", ".com", ".org", ".net"];
  if (kelime.some(reklam => msg.content.includes(reklam))) {
    if (msg.member.hasPermission("BAN_MEMBERS")) {
      return;
    }
    
   msg.delete()
    const Embed = new Discord.RichEmbed()
    .setColor("BLUE")
    .setAuthor("Eveylnn", client.user.avatarURL)
    .setDescription(`${msg.author} Reklam Yasak Bunu Bilmiyormusun! ${client.emojis.get("726064061489348649")}`)
    msg.channel.send(Embed).then(sil => sil.delete(3000))
  }
})
   
   




client.on("message", async msg => {
  if(msg.author.bot) return;
  if(msg.channel.type === "dm") return;
  let i = await db.fetch(`küfürE_${msg.channel.id}`)
    //
  if (i == 'aktif') {
      const kufur = ["abaza","abazan","aq","ağzınasıçayım","ahmak","am","amarım","ambiti","ambiti","amcığı","amcığın","amcığını","amcığınızı","amcık","amcıkhoşafı","amcıklama","amcıklandı","amcik","amck","amckl","amcklama","amcklaryla","amckta","amcktan","amcuk","amık","amına","amınako","amınakoy","amınakoyarım","amınakoyayım","amınakoyim","amınakoyyim","amınas","amınasikem","amınasokam","amınferyadı","amını","amınıs","amınoglu","amınoğlu","amınoğli","amısına","amısını","amina","aminakoyarim","aminakoyayım","aminakoyayim","aminakoyim","aminda","amindan","amindayken","amini","aminiyarraaniskiim","aminoglu","aminoglu","amiyum","amk","amkafa","amkçocuğu","amlarnzn","amlı","amm","amna","amnda","amndaki","amngtn","amnn","amq","amsız","amsiz","amuna","ana","anaaann","anal","anan","anana","anandan","ananı","ananı","ananın","ananınam","ananınamı","ananındölü","ananınki","ananısikerim","ananısikerim","ananısikeyim","ananısikeyim","ananızın","ananızınam","anani","ananin","ananisikerim","ananisikerim","ananisikeyim","ananisikeyim","anann","ananz","anas","anasını","anasınınam","anasıorospu","anasi","anasinin","angut","anneni","annenin","annesiz","aptal","aq","a.q","a.q.","aq.","atkafası","atmık","avrat","babaannesikaşar","babanı","babanın","babani","babasıpezevenk","bacına","bacını","bacının","bacini","bacn","bacndan","bitch","bok","boka","bokbok","bokça","bokkkumu","boklar","boktan","boku","bokubokuna","bokum","bombok","boner","bosalmak","boşalmak","çük","dallama","daltassak","dalyarak","dalyarrak","dangalak","dassagi","diktim","dildo","dingil","dingilini","dinsiz","dkerim","domal","domalan","domaldı","domaldın","domalık","domalıyor","domalmak","domalmış","domalsın","domalt","domaltarak","domaltıp","domaltır","domaltırım","domaltip","domaltmak","dölü","eben","ebeni","ebenin","ebeninki","ecdadını","ecdadini","embesil","fahise","fahişe","feriştah","ferre","fuck","fucker","fuckin","fucking","gavad","gavat","geber","geberik","gebermek","gebermiş","gebertir","gerızekalı","gerizekalı","gerizekali","gerzek","gotlalesi","gotlu","gotten","gotundeki","gotunden","gotune","gotunu","gotveren","göt","götdeliği","götherif","götlalesi","götlek","götoğlanı","götoğlanı","götoş","götten","götü","götün","götüne","götünekoyim","götünekoyim","götünü","götveren","götveren","götverir","gtveren","hasiktir","hassikome","hassiktir","hassiktir","hassittir","ibine","ibinenin","ibne","ibnedir","ibneleri","ibnelik","ibnelri","ibneni","ibnenin","ibnesi","ipne","itoğluit","kahpe","kahpenin","kaka","kaltak","kancık","kancik","kappe","kavat","kavatn","kocagöt","koduğmunun","kodumun","kodumunun","koduumun","mal","malafat","malak","manyak","meme","memelerini","oc","ocuu","ocuun","0Ç","o.çocuğu","orosbucocuu","orospu","orospucocugu","orospuçoc","orospuçocuğu","orospuçocuğudur","orospuçocukları","orospudur","orospular","orospunun","orospununevladı","orospuydu","orospuyuz","orrospu","oruspu","oruspuçocuğu","oruspuçocuğu","osbir","öküz","penis","pezevek","pezeven","pezeveng","pezevengi","pezevenginevladı","pezevenk","pezo","pic","pici","picler","piç","piçinoğlu","piçkurusu","piçler","pipi","pisliktir","porno","pussy","puşt","puşttur","s1kerim","s1kerm","s1krm","sakso","salaak","salak","serefsiz","sexs","sıçarım","sıçtığım","sıkecem","sicarsin","sie","sik","sikdi","sikdiğim","sike","sikecem","sikem","siken","sikenin","siker","sikerim","sikerler","sikersin","sikertir","sikertmek","sikesen","sikey","sikeydim","sikeyim","sikeym","siki","sikicem","sikici","sikien","sikienler","sikiiim","sikiiimmm","sikiim","sikiir","sikiirken","sikik","sikil","sikildiini","sikilesice","sikilmi","sikilmie","sikilmis","sikilmiş","sikilsin","sikim","sikimde","sikimden","sikime","sikimi","sikimiin","sikimin","sikimle","sikimsonik","sikimtrak","sikin","sikinde","sikinden","sikine","sikini","sikip","sikis","sikisek","sikisen","sikish","sikismis","sikiş","sikişen","sikişme","sikitiin","sikiyim","sikiym","sikiyorum","sikkim","sikleri","sikleriii","sikli","sikm","sikmek","sikmem","sikmiler","sikmisligim","siksem","sikseydin","sikseyidin","siksin","siksinler","siksiz","siksok","siksz","sikti","siktigimin","siktigiminin","siktiğim","siktiğimin","siktiğiminin","siktii","siktiim","siktiimin","siktiiminin","siktiler","siktim","siktimin","siktiminin","siktir","siktiret","siktirgit","siktirgit","siktirir","siktiririm","siktiriyor","siktirlan","siktirolgit","sittimin","skcem","skecem","skem","sker","skerim","skerm","skeyim","skiim","skik","skim","skime","skmek","sksin","sksn","sksz","sktiimin","sktrr","skyim","slaleni","sokam","sokarım","sokarim","sokarm","sokarmkoduumun","sokayım","sokaym","sokiim","soktuğumunun","sokuk","sokum","sokuş","sokuyum","soxum","sulaleni","sülalenizi","tasak","tassak","taşak","taşşak","s.k","s.keyim","vajina","vajinanı","xikeyim","yaaraaa","yalarım","yalarun","orospi","orospinin","orospının","orospı","yaraaam","yarak","yaraksız","yaraktr","yaram","yaraminbasi","yaramn","yararmorospunun","yarra","yarraaaa","yarraak","yarraam","yarraamı","yarragi","yarragimi","yarragina","yarragindan","yarragm","yarrağ","yarrağım","yarrağımı","yarraimin","yarrak","yarram","yarramin","yarraminbaşı","yarramn","yarran","yarrana","yarrrak","yavak","yavş","yavşak","yavşaktır","yrrak","zigsin","zikeyim","zikiiim","zikiim","zikik","zikim","ziksiin","ağzına","am","mk","amcık","amcıkağız","amcıkları","amık","amın","amına","amınakoyim","amınoğlu","amina","amini","amk","amq","anan","ananı","ananızı","ananizi","aminizi","aminii","avradını","avradini","anasını","b.k","bok","boktan","boşluk","dalyarak","dasak","dassak","daşak","daşşak","daşşaksız","durum","ensest","erotik","fahişe","fuck","g*t","g*tü","g*tün","g*tüne","g.t","gavat","gay","gerızekalıdır","gerizekalı","gerizekalıdır","got","gotunu","gotuze","göt","götü","götüne","götünü","götünüze","götüyle","götveren","götvern","guat","hasiktir","hasiktr","hastir","i.ne","ibne","ibneler","ibneliği","ipne","ipneler","it","iti","itler","kavat","kıç","kıro","kromusunuz","kromusunuz","lezle","lezler","nah","o.ç","oç.","okuz","orosbu","orospu","orospucocugu","orospular","otusbir","otuzbir","öküz","penis","pezevenk","pezevenkler","pezo","pic","piç","piçi","piçinin","piçler","pis","pok","pokunu","porn","porno","puşt","sex","s.tir","sakso","salak","sanane","sanane","sçkik","seks","serefsiz","serefsz","serefszler","sex","sıçmak","sıkerım","sıkm","sıktır","si.çmak","sicmak","sicti","sik","sikenin","siker","sikerim","sikerler","sikert","sikertirler","sikertmek","sikeyim","sikicem","sikiim","sikik","sikim","sikime","sikimi","sikiş","sikişken","sikişmek","sikm","sikmeyi","siksinler","siktiğim","siktimin","siktin","siktirgit","siktir","siktirgit","siktirsin","siqem","skiym","skm","skrm","sktim","sktir","sktirsin","sktr","sktroradan","sktrsn","snane","sokacak","sokarim","sokayım","sülaleni","şerefsiz","şerefsizler","şerefsizlerin","şerefsizlik","tasak","tassak","taşak","taşşak","travesti","yarak","yark","yarrağım","yarrak","yarramın","yarrk","yavşak","yrak","yrk","ebenin","ezik","o.ç.","orospu","öküz","pezevenk","piç","puşt","salak","salak","serefsiz","sik","sperm","bok","aq","a.q.","amk","am","amına","ebenin","ezik","fahişe","gavat","gavurundölü","gerizekalı","göte","götü","götüne","götünü","lan","mal","o.ç.","orospu","pezevenk","piç","puşt","salak","salak","serefsiz","sik","sikkırığı","sikerler","sikertmek","sikik","sikilmiş","siktir","sperm","taşak","totoş","yarak","yarrak","bok","aq","a.q.","amk","am","ebenin","fahişe","gavat","gerizakalı","gerizekalı","göt","göte","götü","götüne","götsün","piçsin","götsünüz","piçsiniz","götünüze","kıçınız","kıçınıza","götünü","hayvan","ibne","ipne","kahpe","kaltak","lan","mal","o.c","oc","manyak","o.ç.","oç","orospu","öküz","pezevenk","piç","puşt","salak","serefsiz","sik","sikkırığı","sikerler","sikertmek","sikik","sikiim","siktim","siki","sikilmiş","siktir","siktir","sperm","şerefsiz","taşak","totoş","yarak","yarrak","yosma","aq","a.q.","amk","amına","amınakoyim","amina","ammına","amna","sikim","sikiym","sikeyim","siktr","kodumun","amık","sikem","sikim","sikiym","s.iktm","s.ikerim","s.ktir","amg","am.k","a.mk","amık","rakı","rak","oruspu","oc","ananın","ananınki","bacının","bacını","babanın","sike","skim","skem","amcık","şerefsiz","piç","piçinoğlu","amcıkhoşafı","amınasokam","amkçocuğu","amınferyadı","amınoglu","piçler","sikerim","sikeyim","siktiğim","siktiğimin","amını","amına","amınoğlu","amk","ipne","ibne","serefsiz","şerefsiz","piç","piçkurusu","götün","götoş","yarrak","amcik","sıçarım","sıçtığım","aq","a.q","a.q.","aq.","a.g.","ag.","amınak","aminak","amınag","aminag","amınıs","amınas","ananı","babanı","anani","babani","bacını","bacini","ecdadını","ecdadini","sikeyim","sulaleni","sülaleni","dallama","dangalak","aptal","salak","gerızekalı","gerizekali","öküz","angut","dalyarak","sikiyim","sikeyim","götüne","götünü","siktirgit","siktirgit","siktirolgit","siktirolgit","siktir","hasiktir","hassiktir","hassiktir","dalyarak","dalyarrak","kancık","kancik","kaltak","orospu","oruspu","fahişe","fahise","pezevenk","pezo","kocagöt","ambiti","götünekoyim","götünekoyim","amınakoyim","aminakoyim","amınak","aminakoyayım","aminakoyayim","amınakoyarım","aminakoyarim","aminakoyarim","ananısikeyim","ananisikeyim","ananısikeyim","ananisikeyim","ananisikerim","ananısikerim","ananisikerim","ananısikerim","orospucocugu","oruspucocu","amk","amq","sikik","götveren","götveren","amınoğlu","aminoglu","amınoglu","gavat","kavat","anneni","annenin","ananın","ananin","dalyarak","sikik","amcık","siktir","piç","pic","sie","yarram","göt","meme","dildo","skcem","skerm","skerim","skecem","orrospu","annesiz","kahpe","kappe","yarak","yaram","dalaksız","yaraksız","amlı","s1kerim","s1kerm","s1krm","sikim","orospuçocukları", "oç"]
      
      if (kufur.some(word => msg.content.toLowerCase().startsWith(word))) {
          try {
            if (!msg.member.hasPermission("BAN_MEMBERS")) {
            msg.delete();  
const embed1 = new Discord.RichEmbed()
        .setColor("BLUE")
        .setDescription(`${msg.author} Bu Sunucu Eveylnn Botu İle Korunuyor Küfür Edemessin**!** :rage:`)
                  return msg.channel.send(embed1).then(msg => msg.delete(3000));           
            }              
          } catch(err) {
            console.log(err);
          }
        }
         
    }
    
    if (!i) return;
    });

client.on("message", async msg => {
  
  if(msg.author.bot) return;
  if(msg.channel.type === "dm") return;
  let i = await db.fetch(`küfürE_${msg.channel.id}`)
    //if (kufur.some(word => msg.content.startWith(word))) {}
  if (i == 'aktif') {
      const kufur = ["abaza","abazan","aq","ağzınasıçayım","ahmak","am","amarım","ambiti","ambiti","amcığı","amcığın","amcığını","amcığınızı","amcık","amcıkhoşafı","amcıklama","amcıklandı","amcik","amck","amckl","amcklama","amcklaryla","amckta","amcktan","amcuk","amık","amına","amınako","amınakoy","amınakoyarım","amınakoyayım","amınakoyim","amınakoyyim","amınas","amınasikem","amınasokam","amınferyadı","amını","amınıs","amınoglu","amınoğlu","amınoğli","amısına","amısını","amina","aminakoyarim","aminakoyayım","aminakoyayim","aminakoyim","aminda","amindan","amindayken","amini","aminiyarraaniskiim","aminoglu","aminoglu","amiyum","amk","amkafa","amkçocuğu","amlarnzn","amlı","amm","amna","amnda","amndaki","amngtn","amnn","amq","amsız","amsiz","amuna","ana","anaaann","anal","anan","anana","anandan","ananı","ananı","ananın","ananınam","ananınamı","ananındölü","ananınki","ananısikerim","ananısikerim","ananısikeyim","ananısikeyim","ananızın","ananızınam","anani","ananin","ananisikerim","ananisikerim","ananisikeyim","ananisikeyim","anann","ananz","anas","anasını","anasınınam","anasıorospu","anasi","anasinin","angut","anneni","annenin","annesiz","aptal","aq","a.q","a.q.","aq.","atkafası","atmık","avrat","babaannesikaşar","babanı","babanın","babani","babasıpezevenk","bacına","bacını","bacının","bacini","bacn","bacndan","bitch","bok","boka","bokbok","bokça","bokkkumu","boklar","boktan","boku","bokubokuna","bokum","bombok","boner","bosalmak","boşalmak","çük","dallama","daltassak","dalyarak","dalyarrak","dangalak","dassagi","diktim","dildo","dingil","dingilini","dinsiz","dkerim","domal","domalan","domaldı","domaldın","domalık","domalıyor","domalmak","domalmış","domalsın","domalt","domaltarak","domaltıp","domaltır","domaltırım","domaltip","domaltmak","dölü","eben","ebeni","ebenin","ebeninki","ecdadını","ecdadini","embesil","fahise","fahişe","feriştah","ferre","fuck","fucker","fuckin","fucking","gavad","gavat","geber","geberik","gebermek","gebermiş","gebertir","gerızekalı","gerizekalı","gerizekali","gerzek","gotlalesi","gotlu","gotten","gotundeki","gotunden","gotune","gotunu","gotveren","göt","götdeliği","götherif","götlalesi","götlek","götoğlanı","götoğlanı","götoş","götten","götü","götün","götüne","götünekoyim","götünekoyim","götünü","götveren","götveren","götverir","gtveren","hasiktir","hassikome","hassiktir","hassiktir","hassittir","ibine","ibinenin","ibne","ibnedir","ibneleri","ibnelik","ibnelri","ibneni","ibnenin","ibnesi","ipne","itoğluit","kahpe","kahpenin","kaka","kaltak","kancık","kancik","kappe","kavat","kavatn","kocagöt","koduğmunun","kodumun","kodumunun","koduumun","mal","malafat","malak","manyak","meme","memelerini","oc","ocuu","ocuun","0Ç","o.çocuğu","orosbucocuu","orospu","orospucocugu","orospuçoc","orospuçocuğu","orospuçocuğudur","orospuçocukları","orospudur","orospular","orospunun","orospununevladı","orospuydu","orospuyuz","orrospu","oruspu","oruspuçocuğu","oruspuçocuğu","osbir","öküz","penis","pezevek","pezeven","pezeveng","pezevengi","pezevenginevladı","pezevenk","pezo","pic","pici","picler","piç","piçinoğlu","piçkurusu","piçler","pipi","pisliktir","porno","pussy","puşt","puşttur","s1kerim","s1kerm","s1krm","sakso","salaak","salak","serefsiz","sexs","sıçarım","sıçtığım","sıkecem","sicarsin","sie","sik","sikdi","sikdiğim","sike","sikecem","sikem","siken","sikenin","siker","sikerim","sikerler","sikersin","sikertir","sikertmek","sikesen","sikey","sikeydim","sikeyim","sikeym","siki","sikicem","sikici","sikien","sikienler","sikiiim","sikiiimmm","sikiim","sikiir","sikiirken","sikik","sikil","sikildiini","sikilesice","sikilmi","sikilmie","sikilmis","sikilmiş","sikilsin","sikim","sikimde","sikimden","sikime","sikimi","sikimiin","sikimin","sikimle","sikimsonik","sikimtrak","sikin","sikinde","sikinden","sikine","sikini","sikip","sikis","sikisek","sikisen","sikish","sikismis","sikiş","sikişen","sikişme","sikitiin","sikiyim","sikiym","sikiyorum","sikkim","sikleri","sikleriii","sikli","sikm","sikmek","sikmem","sikmiler","sikmisligim","siksem","sikseydin","sikseyidin","siksin","siksinler","siksiz","siksok","siksz","sikti","siktigimin","siktigiminin","siktiğim","siktiğimin","siktiğiminin","siktii","siktiim","siktiimin","siktiiminin","siktiler","siktim","siktimin","siktiminin","siktir","siktiret","siktirgit","siktirgit","siktirir","siktiririm","siktiriyor","siktirlan","siktirolgit","sittimin","skcem","skecem","skem","sker","skerim","skerm","skeyim","skiim","skik","skim","skime","skmek","sksin","sksn","sksz","sktiimin","sktrr","skyim","slaleni","sokam","sokarım","sokarim","sokarm","sokarmkoduumun","sokayım","sokaym","sokiim","soktuğumunun","sokuk","sokum","sokuş","sokuyum","soxum","sulaleni","sülalenizi","tasak","tassak","taşak","taşşak","s.k","s.keyim","vajina","vajinanı","xikeyim","yaaraaa","yalarım","yalarun","orospi","orospinin","orospının","orospı","yaraaam","yarak","yaraksız","yaraktr","yaram","yaraminbasi","yaramn","yararmorospunun","yarra","yarraaaa","yarraak","yarraam","yarraamı","yarragi","yarragimi","yarragina","yarragindan","yarragm","yarrağ","yarrağım","yarrağımı","yarraimin","yarrak","yarram","yarramin","yarraminbaşı","yarramn","yarran","yarrana","yarrrak","yavak","yavş","yavşak","yavşaktır","yrrak","zigsin","zikeyim","zikiiim","zikiim","zikik","zikim","ziksiin","ağzına","am","mk","amcık","amcıkağız","amcıkları","amık","amın","amına","amınakoyim","amınoğlu","amina","amini","amk","amq","anan","ananı","ananızı","ananizi","aminizi","aminii","avradını","avradini","anasını","b.k","bok","boktan","boşluk","dalyarak","dasak","dassak","daşak","daşşak","daşşaksız","durum","ensest","erotik","fahişe","fuck","g*t","g*tü","g*tün","g*tüne","g.t","gavat","gay","gerızekalıdır","gerizekalı","gerizekalıdır","got","gotunu","gotuze","göt","götü","götüne","götünü","götünüze","götüyle","götveren","götvern","guat","hasiktir","hasiktr","hastir","i.ne","ibne","ibneler","ibneliği","ipne","ipneler","it","iti","itler","kavat","kıç","kıro","kromusunuz","kromusunuz","lezle","lezler","nah","o.ç","oç.","okuz","orosbu","orospu","orospucocugu","orospular","otusbir","otuzbir","öküz","penis","pezevenk","pezevenkler","pezo","pic","piç","piçi","piçinin","piçler","pis","pok","pokunu","porn","porno","puşt","sex","s.tir","sakso","salak","sanane","sanane","sçkik","seks","serefsiz","serefsz","serefszler","sex","sıçmak","sıkerım","sıkm","sıktır","si.çmak","sicmak","sicti","sik","sikenin","siker","sikerim","sikerler","sikert","sikertirler","sikertmek","sikeyim","sikicem","sikiim","sikik","sikim","sikime","sikimi","sikiş","sikişken","sikişmek","sikm","sikmeyi","siksinler","siktiğim","siktimin","siktin","siktirgit","siktir","siktirgit","siktirsin","siqem","skiym","skm","skrm","sktim","sktir","sktirsin","sktr","sktroradan","sktrsn","snane","sokacak","sokarim","sokayım","sülaleni","şerefsiz","şerefsizler","şerefsizlerin","şerefsizlik","tasak","tassak","taşak","taşşak","travesti","yarak","yark","yarrağım","yarrak","yarramın","yarrk","yavşak","yrak","yrk","ebenin","ezik","o.ç.","orospu","öküz","pezevenk","piç","puşt","salak","salak","serefsiz","sik","sperm","bok","aq","a.q.","amk","am","amına","ebenin","ezik","fahişe","gavat","gavurundölü","gerizekalı","göte","götü","götüne","götünü","lan","mal","o.ç.","orospu","pezevenk","piç","puşt","salak","salak","serefsiz","sik","sikkırığı","sikerler","sikertmek","sikik","sikilmiş","siktir","sperm","taşak","totoş","yarak","yarrak","bok","aq","a.q.","amk","am","ebenin","fahişe","gavat","gerizakalı","gerizekalı","göt","göte","götü","götüne","götsün","piçsin","götsünüz","piçsiniz","götünüze","kıçınız","kıçınıza","götünü","hayvan","ibne","ipne","kahpe","kaltak","lan","mal","o.c","oc","manyak","o.ç.","oç","orospu","öküz","pezevenk","piç","puşt","salak","serefsiz","sik","sikkırığı","sikerler","sikertmek","sikik","sikiim","siktim","siki","sikilmiş","siktir","siktir","sperm","şerefsiz","taşak","totoş","yarak","yarrak","yosma","aq","a.q.","amk","amına","amınakoyim","amina","ammına","amna","sikim","sikiym","sikeyim","siktr","kodumun","amık","sikem","sikim","sikiym","s.iktm","s.ikerim","s.ktir","amg","am.k","a.mk","amık","rakı","rak","oruspu","oc","ananın","ananınki","bacının","bacını","babanın","sike","skim","skem","amcık","şerefsiz","piç","piçinoğlu","amcıkhoşafı","amınasokam","amkçocuğu","amınferyadı","amınoglu","piçler","sikerim","sikeyim","siktiğim","siktiğimin","amını","amına","amınoğlu","amk","ipne","ibne","serefsiz","şerefsiz","piç","piçkurusu","götün","götoş","yarrak","amcik","sıçarım","sıçtığım","aq","a.q","a.q.","aq.","a.g.","ag.","amınak","aminak","amınag","aminag","amınıs","amınas","ananı","babanı","anani","babani","bacını","bacini","ecdadını","ecdadini","sikeyim","sulaleni","sülaleni","dallama","dangalak","aptal","salak","gerızekalı","gerizekali","öküz","angut","dalyarak","sikiyim","sikeyim","götüne","götünü","siktirgit","siktirgit","siktirolgit","siktirolgit","siktir","hasiktir","hassiktir","hassiktir","dalyarak","dalyarrak","kancık","kancik","kaltak","orospu","oruspu","fahişe","fahise","pezevenk","pezo","kocagöt","ambiti","götünekoyim","götünekoyim","amınakoyim","aminakoyim","amınak","aminakoyayım","aminakoyayim","amınakoyarım","aminakoyarim","aminakoyarim","ananısikeyim","ananisikeyim","ananısikeyim","ananisikeyim","ananisikerim","ananısikerim","ananisikerim","ananısikerim","orospucocugu","oruspucocu","amk","amq","sikik","götveren","götveren","amınoğlu","aminoglu","amınoglu","gavat","kavat","anneni","annenin","ananın","ananin","dalyarak","sikik","amcık","siktir","piç","pic","sie","yarram","göt","meme","dildo","skcem","skerm","skerim","skecem","orrospu","annesiz","kahpe","kappe","yarak","yaram","dalaksız","yaraksız","amlı","s1kerim","s1kerm","s1krm","sikim","orospuçocukları", "oç"]
      if (msg.content.includes(" ")) {
      if (kufur.some(word => msg.content.toLowerCase().includes(" " + word))) {
          try {
            if (!msg.member.hasPermission("BAN_MEMBERS")) {
            msg.delete();  
const embed1 = new Discord.RichEmbed()
        .setColor("BLUE")
        .setDescription(`${msg.author} Bu Sunucu Eveylnn Botu İle Korunuyor Küfür Edemessin**!** ${client.emojis.get("726064061489348649")}`)
                  return msg.channel.send(embed1).then(msg => msg.delete(3000));           
            }              
          } catch(err) {
            console.log(err);
          }
        }
        } else {
         if (kufur.some(word => msg.content == word)) {
          try {
            if (!msg.member.hasPermission("BAN_MEMBERS")) {
                  msg.delete();  
const embed1 = new Discord.RichEmbed()
        .setColor("BLUE")
        .setDescription(`${msg.author} Bu Sunucu Eveylnn Botu İle Korunuyor Küfür Edemessin**!** ${client.emojis.get("726064061489348649")}`)
                  return msg.channel.send(embed1).then(msg => msg.delete(3000));           
            }              
          } catch(err) {
            console.log(err);
          }
        } 
        }
    }
    
    if (!i) return;
    });




client.login(process.env.token);