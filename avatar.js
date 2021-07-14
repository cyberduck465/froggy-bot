const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class AvatarCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'avatar',
      aliases: ['profilepic', 'pic', 'ava'],
      usage: 'avatar [提及用戶/ID]',
      description: '顯示用戶的頭像（或你自己的頭像，如果未提及用戶）。',
      type: client.types.INFO,
      examples: ['avatar @Hello Phone']
    });
  }
  run(message, args) {
    const member =  this.getMemberFromMention(message, args[0]) || 
      message.guild.members.cache.get(args[0]) || 
      message.member;
    const embed = new MessageEmbed()
      .setTitle(`${member.displayName}的頭像`)
      .setImage(member.user.displayAvatarURL({ dynamic: true, size: 512 }))
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(member.displayHexColor);
    message.channel.send(embed);
  }
};
