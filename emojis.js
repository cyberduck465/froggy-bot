const Command = require('../Command.js');
const ReactionMenu = require('../ReactionMenu.js');
const { MessageEmbed } = require('discord.js');

module.exports = class EmojisCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'emojis',
      aliases: ['e'],
      usage: 'emojis',
      description: '顯示所有當前表情符號的列表。',
      type: client.types.INFO
    });
  }
  run(message) {

    const emojis = [];
    message.guild.emojis.cache.forEach(e => emojis.push(`${e} **-** \`:${e.name}:\``));

    const embed = new MessageEmbed()
      .setTitle(`Emoji List [${message.guild.emojis.cache.size}]`)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    const interval = 25;
    if (emojis.length === 0) message.channel.send(embed.setDescription('😢沒有任何表情符號'));
    else if (emojis.length <= interval) {
      const range = (emojis.length == 1) ? '[1]' : `[1 - ${emojis.length}]`;
      message.channel.send(embed
        .setTitle(`表情符號列單 ${range}`)
        .setDescription(emojis.join('\n'))
        .setThumbnail(message.guild.iconURL({ dynamic: true }))
      );
    
    // Reaction Menu
    } else {

      embed
        .setTitle('表情符號列單')
        .setThumbnail(message.guild.iconURL({ dynamic: true }))
        .setFooter(
          '兩分鐘後超時\n' + message.member.displayName,  
          message.author.displayAvatarURL({ dynamic: true })
        );

      new ReactionMenu(message.client, message.channel, message.member, embed, emojis, interval);
    }
  }
};
