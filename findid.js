const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class FindIdCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'findid',
      aliases: ['find', 'id'],
      usage: 'findid <user/role/channel mention>',
      description: '查找提到的用戶、頻道的 ID。',
      type: client.types.INFO,
      examples: ['findid @Hello Phone', 'findid #general']
    });
  }
  run(message, args) {
    const target = this.getMemberFromMention(message, args[0]) || 
      this.getRoleFromMention(message, args[0]) || 
      this.getChannelFromMention(message, args[0]);
    if (!target) 
      return this.sendErrorMessage(message, 0, '請提及一位成員、身份組或文字！');
    const id = target.id;
    const embed = new MessageEmbed()
      .setTitle('發現 ID')
      .addField('目標', target, true)
      .addField('ID', `\`${id}\``, true)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
  }
};
