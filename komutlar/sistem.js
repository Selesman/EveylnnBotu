const Discord = require("discord.js")
const db = require("quick.db")
const ayarlar = require("../ayarlar.json")
let prefix = ayarlar.prefix 

exports.run = (client, message, args) => {

let embed = new Discord.RichEmbed()
if (message.author.id !== message.guild.owner.id && message.author.id !== ayarlar.sahip) return message.channel.send(embed.setColor("006DFF").setDescription(`Bu Komutu Kullanabilmek için **Sunucu Sahibi** Olman Gerek`))


let sistemler = args[0]
let x;
if (sistemler === "aç") x = "."
if (sistemler === "kapat") x = "."
 
if (!x) return message.channel.send(embed.setColor("FF0000").setDescription(`Lütfen Bir Seçenek Belirt: **${prefix}sistem aç** - **${prefix}sistem kapat**`))

if (sistemler === "aç") {
message.channel.send(embed.setColor("00FF05").setDescription(`Sistemler Başarıyla **Açıldı**`))
db.set(`küfürengel_${message.guild.id}`, "açık")
db.set(`kanalengel_${message.guild.id}`, "açık")
db.set(`reklamengel_${message.guild.id}`, "açık")
db.set(`spamengel_${message.guild.id}`, "açık")
db.set(`capsengel_${message.guild.id}`, "açık")
}
if (sistemler === "kapat") {
message.channel.send(embed.setColor("00FF05").setDescription(`Sistemler Başarıyla **Kapatıldı**`))
db.delete(`küfürengel_${message.guild.id}`, "açık")
db.delete(`kanalengel_${message.guild.id}`, "açık")
db.delete(`reklamengel_${message.guild.id}`, "açık")
db.delete(`spamengel_${message.guild.id}`, "açık")
db.delete(`capsengel_${message.guild.id}`, "açık")   

}}
exports.conf = {
enabled: true,
guildOnly: false,
aliases: ["sistemler"],
permLevel: 0
}
exports.help = {
name: "sistem"
}