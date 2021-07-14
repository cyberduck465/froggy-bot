const Command = require('../Command.js');
const ReactionMenu = require('../ReactionMenu.js');
const { MessageEmbed } = require('discord.js');

module.exports = class AdminsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'admins',
      usage: 'admins',
      description: '顯示所有當前管理員的名單',
      type: client.types.INFO,
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'ADD_REACTIONS']
    });
  }
  run(message) {
    
    // Get admin role
    const adminRoleId = message.client.db.settings.selectAdminRoleId.pluck().get(message.guild.id);
    const adminRole = message.guild.roles.cache.get(adminRoleId) || '`None`';

    const admins = message.guild.members.cache.filter(m => {
      if (m.roles.cache.find(r => r === adminRole)) return true;
    }).sort((a, b) => (a.joinedAt > b.joinedAt) ? 1 : -1).array();

    const embed = new MessageEmbed()
      .setTitle(`管理員名單 [${admins.length}]`)
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .addField('管理員身份組', adminRole)
      .addField('管理員人數', `**${admins.length}** 從 **${message.guild.members.cache.size}** 成員中`)
      .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    const interval = 25;
    if (admins.length === 0) message.channel.send(embed.setDescription('未找到管理員'));
    else if (admins.length <= interval) {
      const range = (admins.length == 1) ? '[1]' : `[1 - ${admins.length}]`;
      message.channel.send(embed
        .setTitle(`管理員名單 ${range}`)
        .setDescription(admins.join('\n'))
      );

    // Reaction Menu
    } else {

      embed
        .setTitle('管理員名單')
        .setThumbnail(message.guild.iconURL({ dynamic: true }))
        .setFooter(
          '兩分鐘後超時\n' + message.member.displayName,  
          message.author.displayAvatarURL({ dynamic: true })
        );

      new ReactionMenu(message.client, message.channel, message.member, embed, admins, interval);
    }
  }
};
