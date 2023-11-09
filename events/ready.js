import { Events } from 'discord.js';

export const Ready = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    console.log(`BOT is ready! Logged in as ${client.user.tag}`);
  },
};