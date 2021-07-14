const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class ServerStaffCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'serverstaff',
      aliases: ['staff'],
      usage: 'serverstaff',
      description: '顯示所有當前服務器版主和管理員的列表。',
      type: client.types.INFO
    });
  }
  run(message) {
    
    // Get mod role
    const modRoleId = message.client.db.settings.selectModRoleId.pluck().get(message.guild.id);
    let modRole, mods;
    if (modRoleId) modRole = message.guild.roles.cache.get(modRoleId);
    
    // Get admin role
    const adminRoleId = message.client.db.settings.selectAdminRoleId.pluck().get(message.guild.id);
    let adminRole, admins;
    if (adminRoleId) adminRole = message.guild.roles.cache.get(adminRoleId);
  
    let modList = [], adminList = [];

    // Get mod list
    if (modRole) modList = message.guild.members.cache.filter(m => {
      if (m.roles.cache.find(r => r === modRole)) return true;
    }).sort((a, b) => (a.joinedAt > b.joinedAt) ? 1 : -1).array();

    if (modList.length > 0) mods = message.client.utils.trimStringFromArray(modList, 1024);
    else mods = '未找到版主';

    
    // Get admin list
    if (adminRole) adminList = message.guild.members.cache.filter(m => {
      if (m.roles.cache.find(r => r === adminRole)) return true;
    }).sort((a, b) => (a.joinedAt > b.joinedAt) ? 1 : -1).array();

    if (adminList.length > 0) admins = message.client.utils.trimStringFromArray(adminList, 1024);
    else admins = '未找到管理員。';
    

    const embed = new MessageEmbed()
      .setTitle('伺服器管理者名單 [${modList.length + adminList.length}]')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .addField(`管理員 [${adminList.length}]`, admins, true)
      .addField(`版主 [${modList.length}]`, mods, true)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
  }
};
