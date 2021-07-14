const Command = require('../Command.js');
const { oneLine, stripIndent } = require('common-tags');

module.exports = class SayCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'say',
      usage: 'say [channel mention/ID] <message>',
      description: oneLine`
        向指定頻道發送消息。
         如果沒有給出頻道，則消息將發送到當前頻道。
      `,
      type: client.types.FUN,
      examples: ['say #一般 awa']
    });
  }
  run(message, args) {
    let channel = this.getChannelFromMention(message, args[0]) || message.guild.channels.cache.get(args[0]);
    if (channel) {
      args.shift();
    } else channel = message.channel;

    // Check type and viewable
    if (channel.type != 'text' || !channel.viewable) return this.sendErrorMessage(message, 0, stripIndent`
     請提及我可訪問的文字頻道或提供有效的文字頻道 ID
    `);

    // Get mod channels
    let modChannelIds = message.client.db.settings.selectModChannelIds.pluck().get(message.guild.id) || [];
    if (typeof(modChannelIds) === 'string') modChannelIds = modChannelIds.split(' ');
    if (modChannelIds.includes(channel.id)) return this.sendErrorMessage(message, 0, stripIndent`
      請提及我可訪問的文字頻道或提供有效的文字頻道 ID
    `);

    if (!args[0]) return this.sendErrorMessage(message, 0, '請提供一個信息讓我說');

    // Check channel permissions
    if (!channel.permissionsFor(message.guild.me).has(['SEND_MESSAGES']))
      return this.sendErrorMessage(message, 0, '我沒有權限在提供的頻道中發送信息');

    if (!channel.permissionsFor(message.member).has(['SEND_MESSAGES']))
      return this.sendErrorMessage(message, 0, '你沒有權限在提供的頻道中發送信息');

    const msg = message.content.slice(message.content.indexOf(args[0]), message.content.length);
    channel.send(msg, { disableMentions: 'everyone' });
  } 
};
