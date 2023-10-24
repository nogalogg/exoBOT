import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import keepAlive from `./server`;

const DISCORD_TOKEN = process.env;

// Require the necessary discord.js classes
import { Client, GatewayIntentBits, EmbedBuilder, Collection } from 'discord.js';
// old:IntentsBitField

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
  ],});

//load the events files on startup
const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith(".js"));

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
}

//load the commands files on startup
client.commands = new Collection();
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  if ("data" in command && "execute" in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.log(
      `[WARNING] The command at ${filePath} is missing a required data or execute property.`
    );
  };
};

client.login( DISCORD_TOKEN );
keepAlive();