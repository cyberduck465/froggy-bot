const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const permissions = require('../../utils/permissions.json');

module.exports = class RoleInfoCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'roleinfo',
      aliases: ['role', 'ri'],
      usage: 'roleinfo <role mention/ID>',
      description: '獲取有關所提供身份組的信息',
      type: client.types.INFO,
      examples: ['roleinfo @Member']
    });
  }
  run(message, args) {

    const role = this.getRoleFromMention(message, args[0]) || message.guild.roles.cache.get(args[0]);
    if (!role)
      return this.sendErrorMessage(message, 0, '請提及身份組或提供有效的身份組 ID');

    // Get role permissions
    const rolePermissions = role.permissions.toArray();
    const finalPermissions = [];
    for (const permission in permissions) {
      if (rolePermissions.includes(permission)) finalPermissions.push(`+ ${permissions[permission]}`);
      else finalPermissions.push(`- ${permissions[permission]}`);
    }

    // Reverse role position
    const position = `\`${message.guild.roles.cache.size - role.position}\`/\`${message.guild.roles.cache.size}\``;

    const embed = new MessageEmbed()
      .setTitle('Role Information')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .addField('身份組', role, true)
      .addField('身份組ID', `\`${role.id}\``, true)
      .addField('位置', position, true)
      .addField('提及', `\`${role.mentionable}\``, true)
      .addField('機器人身份組', `\`${role.managed}\``, true)
      .addField('顏色', `\`${role.hexColor.toUpperCase()}\``, true)
      .addField('擁有成員', `\`${role.members.size}\``, true)
      .addField('.', `\`${role.hoist}\``, true)
      .addField('創建於', `\`${moment(role.createdAt).format('MMM DD YYYY')}\``, true)
      .addField('權限', `\`\`\`diff\n${finalPermissions.join('\n')}\`\`\``)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(role.hexColor);
    message.channel.send(embed);
  }
};
