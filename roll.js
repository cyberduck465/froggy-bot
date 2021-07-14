const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class RollCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'roll',
      aliases: ['dice', 'r'],
      usage: 'roll <dice sides>',
      description: '擲指定面數的骰子。 如果沒有給出數字，將默認為第 6 面。',
      type: client.types.FUN,
      examples: ['roll 20']
    });
  }
  run(message, args) {
    let limit = args[0];
    if (!limit) limit = 6;
    const n = Math.floor(Math.random() * limit + 1);
    if (!n || limit <= 0)
      return this.sendErrorMessage(message, 0, '請提供有效的骰子數');
    const embed = new MessageEmbed()
      .setTitle('🎲擲骰子')
      .setDescription(`${message.member}, 你擲出了 **${n}**！`)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
  }
};
