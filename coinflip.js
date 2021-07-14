const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class CoinFlipCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'coinflip',
      aliases: ['cointoss', 'coin', 'flip'],
      usage: 'coinflip',
      description: '拋硬幣 :coin:',
      type: client.types.FUN
    });
  }
  run(message) {
    const n = Math.floor(Math.random() * 2);
    let result;
    if (n === 1) result = 'heads';
    else result = 'tails';
    const embed = new MessageEmbed()
      .setTitle(':coin: Coinflip')
      .setDescription(`我替你翻轉了一個硬幣, ${message.member}.它是**${result}**!`)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
  }
};
