const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const { owner, voice } = require('../../utils/emojis.json');
const { stripIndent } = require('common-tags');
const region = {
  'us-central': ':flag_us:  `US Central`',
  'us-east': ':flag_us:  `US East`',
  'us-south': ':flag_us:  `US South`',
  'us-west': ':flag_us:  `US West`',
  'europe': ':flag_eu:  `Europe`',
  'singapore': ':flag_sg:  `Singapore`',
  'japan': ':flag_jp:  `Japan`',
  'russia': ':flag_ru:  `Russia`',
  'hongkong': ':flag_hk:  `Hong Kong`',
  'brazil': ':flag_br:  `Brazil`',
  'sydney': ':flag_au:  `Sydney`',
  'southafrica': '`South Africa` :flag_za:'
};
const verificationLevels = {
  NONE: '`None`',
  LOW: '`Low`',
  MEDIUM: '`Medium`',
  HIGH: '`High`',
  VERY_HIGH: '`Highest`'
};
const notifications = {
  ALL: '`All`',
  MENTIONS: '`Mentions`'
};

module.exports = class ServerInfoCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'serverinfo',
      aliases: ['server', 'si'],
      usage: 'serverinfo',
      description: '獲取有關服務器的信息和統計信息。',
      type: client.types.INFO
    });
  }
  run(message) {

    // Get roles count
    const roleCount = message.guild.roles.cache.size - 1; // Don't count @everyone
    
    // Get member stats
    const members = message.guild.members.cache.array();
    const memberCount = members.length;
    const online = members.filter((m) => m.presence.status === 'online').length;
    const offline =  members.filter((m) => m.presence.status === 'offline').length;
    const dnd =  members.filter((m) => m.presence.status === 'dnd').length;
    const afk =  members.filter((m) => m.presence.status === 'idle').length;
    const bots = members.filter(b => b.user.bot).length;
    
    // Get channel stats
    const channels = message.guild.channels.cache.array();
    const channelCount = channels.length;
    const textChannels = 
      channels.filter(c => c.type === 'text' && c.viewable).sort((a, b) => a.rawPosition - b.rawPosition);
    const voiceChannels = channels.filter(c => c.type === 'voice').length;
    const newsChannels = channels.filter(c => c.type === 'news').length;
    const categoryChannels = channels.filter(c => c.type === 'category').length;
    
    const serverStats = stripIndent`
      Members  :: [ ${memberCount} ]
               :: ${online} 線上
               :: ${dnd} 忙碌
               :: ${afk} 掛機
               :: ${offline} 線下
               :: ${bots} 機器人
      Channels :: [ ${channelCount} ]
               :: ${textChannels.length} 文字頻道
               :: ${voiceChannels} 語音頻道
               :: ${newsChannels} 公告頻道
               :: ${categoryChannels} 類別
      Roles    :: [ ${roleCount} ]
    `;

    const embed = new MessageEmbed()
      .setTitle(`${message.guild.name}'s Information`)
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .addField('ID', `\`${message.guild.id}\``, true)
      .addField('地區', region[message.guild.region], true)
      .addField(`擁有者 ${owner}`, message.guild.owner, true)
      .addField('驗證等般', verificationLevels[message.guild.verificationLevel], true)
      .addField('規則頻道', 
        (message.guild.rulesChannel) ? `${message.guild.rulesChannel}` : '`None`', true
      )
      .addField('系統頻道', 
        (message.guild.systemChannel) ? `${message.guild.systemChannel}` : '`None`', true
      )
      .addField('AFK頻道', 
        (message.guild.afkChannel) ? `${voice} ${message.guild.afkChannel.name}` : '`None`', true
      )
      .addField('AFK超時', 
        (message.guild.afkChannel) ? 
          `\`${moment.duration(message.guild.afkTimeout * 1000).asMinutes()} minutes\`` : '`None`', 
        true
      )
      .addField('默認通知', notifications[message.guild.defaultMessageNotifications], true)
      .addField('合作', `\`${message.guild.partnered}\``, true)
      .addField('已驗證', `\`${message.guild.verified}\``, true)
      .addField('創建於', `\`${moment(message.guild.createdAt).format('MMM DD YYYY')}\``, true)
      .addField('服務器統計', `\`\`\`asciidoc\n${serverStats}\`\`\``)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    if (message.guild.description) embed.setDescription(message.guild.description);
    if (message.guild.bannerURL) embed.setImage(message.guild.bannerURL({ dynamic: true }));
    message.channel.send(embed);
  }
};
