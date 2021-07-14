const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class ServerIconCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'servericon',
      aliases: ['icon', 'i'],
      usage: 'servericon',
      description: '顯示服務器的圖標',
      type: client.types.INFO
    });
  }
  run(message) {
    const embed = new MessageEmbed()
      .setTitle(`${message.guild.name}的圖標`)
      .setImage(message.guild.iconURL({ dynamic: true, size: 512 }))
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
  }
};
