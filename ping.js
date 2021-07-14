const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { pong } = require('../../utils/emojis.json');

module.exports = class PingCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'ping',
      usage: 'ping',
      description: '獲取 Froggy的當前延遲和 API 延遲。',
      type: client.types.INFO
    });
  }
  async run(message) {
    const embed = new MessageEmbed()
      .setDescription('正在查詢...')
      .setColor(message.guild.me.displayHexColor);    
    const msg = await message.channel.send(embed);
    const timestamp = (message.editedTimestamp) ? message.editedTimestamp : message.createdTimestamp; // Check if edited
    const latency = `\`\`\`ini\n[ ${Math.floor(msg.createdTimestamp - timestamp)}ms ]\`\`\``;
    const apiLatency = `\`\`\`ini\n[ ${Math.round(message.client.ws.ping)}ms ]\`\`\``;
    embed.setTitle(`pong!`)
      .setDescription('')
      .addField('延遲', latency, true)
      .addField('API 延遲', apiLatency, true)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp();
    msg.edit(embed);
  }
};
