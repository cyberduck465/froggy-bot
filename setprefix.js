const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { success } = require('../../utils/emojis.json');

module.exports = class SetPrefixCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setprefix',
      aliases: ['setp', 'sp'],
      usage: 'setprefix <前綴>',
      description:'為你的服務器設置指令前綴(prefix)。“前綴”長度為 3 個字。',
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['setprefix awa']
    });
  }
  run(message, args) {
    const oldPrefix = message.client.db.settings.selectPrefix.pluck().get(message.guild.id);
    const prefix = args[0];
    if (!prefix) return this.sendErrorMessage(message, 0, '請提一個新的前綴');
    else if (prefix.length > 3) 
      return this.sendErrorMessage(message, 0, '請確保前綴不超過 3 個字');
    message.client.db.settings.updatePrefix.run(prefix, message.guild.id);
    const embed = new MessageEmbed()
      .setTitle('')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription(` ${success}`)
      .addField('更換前綴', `\`${oldPrefix}\` ➔ \`${prefix}\``)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
  }
};
