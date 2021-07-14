const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const permissions = require('../../utils/permissions.json');
const { oneLine } = require('common-tags');

module.exports = class PermissionsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'permissions',
      aliases: ['perms'],
      usage: 'permissions [user mention/ID]',
      description: oneLine`
      顯示指定用戶的所有當前權限。
         如果未指定用戶，則會顯示你自己的權限。
      `,
      type: client.types.INFO,
      examples: ['permissions @he']
    });
  }
  run(message, args) {
    const member =  this.getMemberFromMention(message, args[0]) || 
      message.guild.members.cache.get(args[0]) || 
      message.member;

    // Get member permissions
    const memberPermissions = member.permissions.toArray();
    const finalPermissions = [];
    for (const permission in permissions) {
      if (memberPermissions.includes(permission)) finalPermissions.push(`+ ${permissions[permission]}`);
      else finalPermissions.push(`- ${permissions[permission]}`);
    }

    const embed = new MessageEmbed()
      .setTitle(`${member.displayName}的權限`)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setDescription(`\`\`\`diff\n${finalPermissions.join('\n')}\`\`\``)
      .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(member.displayHexColor);
    message.channel.send(embed);
  }
};
