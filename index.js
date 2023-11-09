import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import keepAlive from './server.js';

//  Require the necessary discord.js classes
import { Client, GatewayIntentBits, Collection } from 'discord.js';

const { DISCORD_TOKEN: token } = process.env;

//  Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent
  ]});

//  load the events files on startup
const eventsPath = path.join(new URL('events', import.meta.url).pathname);
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith('.js'));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  import(filePath)
    .then((event) => {
      if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
      } else {
        client.on(event.name, (...args) => event.execute(...args));
      }
    })
    .catch((error) => {
      console.error(`Failed to import event file ${filePath}:`, error);
    });
};

//  load the commands files on startup
client.commands = new Collection();
const commandsPath = path.join(new URL('commands', import.meta.url).pathname);
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  import(filePath)
    .then((command) => {
      if ('data' in command.com && 'execute' in command.com) {
        client.commands.set(command.com.data.name, command);
      } else {
        console.log(
          `[WARNING] The command at ${filePath} is missing a required data or execute property.`
        );
      };
    })
    .catch((error) => {
      console.error(`Failed to import command file ${filePath}:`, error);
    });
};

client.login(token);
keepAlive();
