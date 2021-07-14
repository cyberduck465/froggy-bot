const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const emojis = require('../../utils/emojis.json');
const statuses = {
  online: `${emojis.online} \`線上\``,
  idle: `${emojis.idle} \`AFK\``,
  offline: `${emojis.offline} \`線下\``,
  dnd: `${emojis.dnd} \`請物打擾\``
};
const flags = {
  DISCORD_EMPLOYEE: `${emojis.discord_employee} \`Discord Employee\``,
  DISCORD_PARTNER: `${emojis.discord_partner} \`Partnered Server Owner\``,
  BUGHUNTER_LEVEL_1: `${emojis.bughunter_level_1} \`Bug Hunter (Level 1)\``,
  BUGHUNTER_LEVEL_2: `${emojis.bughunter_level_2} \`Bug Hunter (Level 2)\``,
  HYPESQUAD_EVENTS: `${emojis.hypesquad_events} \`HypeSquad Events\``,
  HOUSE_BRAVERY: `${emojis.house_bravery} \`House of Bravery\``,
  HOUSE_BRILLIANCE: `${emojis.house_brilliance} \`House of Brilliance\``,
  HOUSE_BALANCE: `${emojis.house_balance} \`House of Balance\``,
  EARLY_SUPPORTER: `${emojis.early_supporter} \`Early Supporter\``,
  TEAM_USER: 'Team User',
  SYSTEM: 'System',
  VERIFIED_BOT: `${emojis.verified_bot} \`Verified Bot\``,
  VERIFIED_DEVELOPER: `${emojis.verified_developer} \`Early Verified Bot Developer\``
};

module.exports = class UserInfoCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'userinfo',
      aliases: ['whois', 'user', 'ui'],
      usage: 'userinfo [user mention/ID]',
      description: '獲取用戶的信息。 如果沒有給出用戶，將顯示你自己的信息。',
      type: client.types.INFO,
      examples: ['userinfo @Nettles']
    });
  }
  async run(message, args) {
    const member =  this.getMemberFromMention(message, args[0]) || 
      message.guild.members.cache.get(args[0]) || 
      message.member;
    const userFlags = (await member.user.fetchFlags()).toArray();
    const activities = [];
    let customStatus;
    for (const activity of member.presence.activities.values()) {
      switch (activity.type) {
        case 'PLAYING':
          activities.push(`正在玩 **${activity.name}**`);
          break;
        case 'LISTENING':
          if (member.user.bot) activities.push(`正在聽 **${activity.name}**`);
          else activities.push(`正在聽 **${activity.details}** by **${activity.state}**`);
          break;
        case 'WATCHING':
          activities.push(`正在看 **${activity.name}**`);
          break;
        case 'STREAMING':
          activities.push(`正在直播 **${activity.name}**`);
          break;
        case 'CUSTOM_STATUS':
          customStatus = activity.state;
          break;
      }
    }
    
    // Trim roles
    let roles = message.client.utils.trimArray(member.roles.cache.array().filter(r => !r.name.startsWith('#')));
    roles = message.client.utils.removeElement(roles, message.guild.roles.everyone)
      .sort((a, b) => b.position - a.position).join(' ');
    
    const embed = new MessageEmbed()
      .setTitle(`${member.displayName}的用户資料`)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .addField('用戶', member, true)
      .addField('鑑別器(#)', `\`#${member.user.discriminator}\``, true)
      .addField('ID', `\`${member.id}\``, true)
      .addField('狀態', statuses[member.presence.status], true)
      .addField('機器人', `\`${member.user.bot}\``, true)
      .addField('顏色身份組', member.roles.color || '`None`', true)
      .addField('最高身份組', member.roles.highest, true)
      .addField('加入此伺服器於', `\`${moment(member.joinedAt).format('MMM DD YYYY')}\``, true)
      .addField('創建帳號於', `\`${moment(member.user.createdAt).format('MMM DD YYYY')}\``, true)
      .addField('Roles|身份組', roles || '`None`')
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(member.displayHexColor);
    if (activities.length > 0) embed.setDescription(activities.join('\n'));
    if (customStatus) embed.spliceFields(0, 0, { name: 'Custom Status', value: customStatus});
    if (userFlags.length > 0) embed.addField('Badges', userFlags.map(flag => flags[flag]).join('\n'));
    message.channel.send(embed);
  }
};
