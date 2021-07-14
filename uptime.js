const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');

module.exports = class UptimeCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'uptime',
      aliases: ['up'],
      usage: 'uptime',
      description: '獲取 Froggy的當前正常運行時間。',
      type: client.types.INFO
    });
  }
  run(message) {
    const d = moment.duration(message.client.uptime);
    const days = (d.days() == 1) ? `${d.days()} 日` : `${d.days()} 日`;
    const hours = (d.hours() == 1) ? `${d.hours()} 小時` : `${d.hours()} 小時`;
    const minutes = (d.minutes() == 1) ? `${d.minutes()} 分鐘` : `${d.minutes()} 分鐘`;
    const seconds = (d.seconds() == 1) ? `${d.seconds()} 秒` : `${d.seconds()} 秒`;
    const date = moment().subtract(d, 'ms').format('dddd, MMMM Do YYYY');
    const embed = new MessageEmbed()
      .setTitle('Froggy 的正常運行時間')
      .setDescription(`\`\`\`prolog\n${days}, ${hours}, ${minutes}, 和 ${seconds}\`\`\``)
      .addField('推出日期', date) 
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
  }
};
