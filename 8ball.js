const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const answers = [
 '可以肯定的是。',
    '確實如此。',
    '毫無疑問。',
    '當然是。',
    '你可以依賴它。',
    '在我看來，是的。',
    '最有可能的。',
    '前景良好。',
    '是的。',
    '跡象表明是的。',
    '回复朦朧，再試一次。',
    '稍後再問。',
    '現在最好不要告訴你。',
    '現在無法預測。',
    '專心再問。',
    '不要指望它。',
    '我的回答是否定的。',
    '我的消息來源說不。',
    '前景不太好。',
    '非常可疑。',
    '我想不是。',
    '我想是的。'
];

module.exports = class EightBallCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'ask',
      aliases: ['fortune'],
      usage: 'ask <問題>',
      description: 'Ask',
      type: client.types.FUN,
      examples: ['f!ask 我現在可以睡覺嗎']
    });
  }
  run(message, args) {
    const question = args.join(' ');
    if (!question) return this.sendErrorMessage(message, 0, '請提供一個問題！');
    const embed = new MessageEmbed()
      .setTitle('📬Q&A')
      .addField('問題', question)
      .addField('回答', `${answers[Math.floor(Math.random() * answers.length)]}`)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
  }
};
