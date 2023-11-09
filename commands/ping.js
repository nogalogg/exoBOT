import {SlashCommandBuilder} from 'discord.js';

export const com = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Responde com Pong!"),
  async execute(interaction) {
    console.log(interaction);
    await interaction.reply("pong");
  },
};