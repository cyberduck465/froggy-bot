const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const rps = ['scissors','rock', 'paper'];
const res = ['Scissors :v:','Rock :fist:', 'Paper :raised_hand:'];

module.exports = class RockPaperScissorsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'rps',
      usage: 'rps <rock | paper | scissors>',
      description: '和Froggy玩石頭剪刀布遊戲！',
      type: client.types.FUN,
      examples: ['rps rock']
    });
  }
  run(message, args) {
    let userChoice;
    if (args.length) userChoice = args[0].toLowerCase();
    if (!rps.includes(userChoice)) 
      return this.sendErrorMessage(message, 0, '請輸入rock(石頭)、paper(布)或scissors(剪刀)');
    userChoice = rps.indexOf(userChoice);
    const botChoice = Math.floor(Math.random()*3);
    let result;
    if (userChoice === botChoice) result = '這是一個平局！';
    else if (botChoice > userChoice || botChoice === 0 && userChoice === 2) result = '**Froggy** 勝利!';
    else result = `**${message.member.displayName}** 勝利!`;
    const embed = new MessageEmbed()
      .setTitle(`${message.member.displayName} vs. Froggy`)
      .addField('你的選擇：', res[userChoice], true)
      .addField('Froggy的選擇：', res[botChoice], true)
      .addField('結果:', result, true)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
  }
};
