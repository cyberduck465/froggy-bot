const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { stripIndent } = require('common-tags');

module.exports = class ServerCountCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'servercount',
      aliases: ['usercount', 'sc', 'uc'],
      usage: 'servercount',
      description: '獲取 Froggy的當前服務器和用戶數。',
      type: client.types.INFO
    });
  }
  run(message) {
    const counts = stripIndent`
      伺服器 :: ${message.client.guilds.cache.size}
      使用者 :: ${message.client.users.cache.size}
    `;
    const embed = new MessageEmbed()
      .setTitle('有我在的伺服器')
      .setDescription(stripIndent`\`\`\`asciidoc\n${counts}\`\`\``)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
  }
};
