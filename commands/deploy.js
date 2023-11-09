import 'dotenv/config';
import {SlashCommandBuilder} from 'discord.js';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';
import fs from 'fs';

const {
    APPLICATION_ID: client_id,
    DISCORD_TOKEN: token
} = process.env;

export const com = {
    data: new SlashCommandBuilder()
        .setName("deploy")
        .setDescription("Publica os comandos"),
    async execute(interaction) {
        if ((interaction.user.id !== clientId) || (interaction.user.id !== '910309839136251935')) {
            await interaction.reply("Você não tem permissão para usar este comando");
            return;
        }
        await fncDeploy(client_id, token);
    },
};

export async function fncDeploy(clientId, token) {
    if (!token) {
        console.error('Token não definido');
        return;
    }

    const commands = [];
    const commandFiles = fs
        .readdirSync('./commands')
        .filter((file) => file.endsWith('.js'));
                                                                                                                  
    for (const file of commandFiles) {
        const command = await import(`./${file}`);
        commands.push(command.com.data.toJSON());
    };

    const rest = await new REST({ version: "10" }).setToken(token);
    
    (async () => {
        try {
            console.log(
                `Started refreshing ${commands.length} application (/) commands.`
            );
     
            // The put method is used to fully refresh all commands in the guild with the current set
            const data = await rest.put(
                Routes.applicationCommands(clientId),
                { body: commands }
            );

           /*  NOTA IMPORTANTE
            * Routes.applicationCommands(clientId) se refere aos comandos globais do seu bot.
            * Routes.applicationGuildCommands(clientId, guildId) se refere aos comandos do seu bot em um servidor.
            */

            console.log(
                `Successfully reloaded ${data.length} application (/) commands.`
            );
        } catch (error) {
            // And of course, make sure you catch and log any errors!
            console.error(error);
        }
    })();
};