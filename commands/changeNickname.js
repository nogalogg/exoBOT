import {SlashCommandBuilder} from 'discord.js';

export const com = {
  data: new SlashCommandBuilder()
    .setName('botnickname')
    .setDescription('Change the bot\'s nickname')
    .addStringOption(
      option => option.setName('nickname').setDescription('The new nickname').setRequired(true)
        )
    .setDMPermission(false),
  async execute(interaction) {
    console.log(interaction);
    const nickname = interaction.options.getString('nickname');
    await interaction.reply(`Changing nickname to ${nickname}`);
    await interaction.guild.members.me.setNickname(nickname);
  },
};