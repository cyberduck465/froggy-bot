const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const { voice } = require('../../utils/emojis.json');
const { oneLine, stripIndent } = require('common-tags');
const channelTypes = {
  dm: 'DM',
  text: 'Text',
  voice: 'Voice',
  category: 'Category',
  news: 'News',
  store: 'Store'
};

module.exports = class ChannelInfoCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'channelinfo',
      aliases: ['channel', 'ci'],
      usage: 'channelinfo [channel mention/ID]',
      description: oneLine`
       獲取有關所提供頻道的信息。
         如果沒有給出頻道，將使用當前頻道 
      `,
      type: client.types.INFO,
      examples: ['channelinfo #general']
    });
  }
  run(message, args) {
    let channel = this.getChannelFromMention(message, args[0]) || message.guild.channels.cache.get(args[0]);
    if (channel) {
      args.shift();
    } else channel = message.channel;
    const embed = new MessageEmbed()
      .setTitle('頻道資料')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .addField('Channel', channel, true)
      .addField('ID', `\`${channel.id}\``, true)
      .addField('Type', `\`${channelTypes[channel.type]}\``, true)
      .addField('成員', `\`${channel.members.size}\``, true)
      .addField('機器人', `\`${channel.members.array().filter(b => b.user.bot).length}\``, true)
      .addField('建立於', `\`${moment(channel.createdAt).format('MMM DD YYYY')}\``, true)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    if (channel.type === 'text') {
      embed // Text embed
        .spliceFields(3, 0, { name: '速率限制', value: `\`${channel.rateLimitPerUser}\``, inline: true })
        .spliceFields(6, 0, { name: '18+', value: `\`${channel.nsfw}\``, inline: true });
    } else if (channel.type === 'news') {
      embed // News embed
        .spliceFields(6, 0, { name: '18+', value: `\`${channel.nsfw}\``, inline: true });
    } else if (channel.type === '語音') {
      embed // Voice embed
        .spliceFields(0, 1, { name: '頻道', value: `${voice} ${channel.name}`, inline: true })
        .spliceFields(5, 0, { name: '用戶限制', value: `\`${channel.userLimit}\``, inline: true })
        .spliceFields(6, 0, { name: '', value: `\`${channel.full}\``, inline: true });
      const members = channel.members.array();
      if (members.length > 0) 
        embed.addField('會員加入', message.client.utils.trimArray(channel.members.array()).join(' '));
    } else return this.sendErrorMessage(message, 0, stripIndent`
      請輸入有效文本或公告頻道` +
       ' 或提供有效的文字、公告或語音通道 ID'
    );
    if (channel.topic) embed.addField('Topic', channel.topic);
    message.channel.send(embed);
  }
};
