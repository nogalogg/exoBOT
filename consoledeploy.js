import 'dotenv/config';
import { fncDeploy } from './commands/deploy.js';

const {
    APPLICATION_ID: client_id,
    DISCORD_TOKEN: token
} = process.env;

fncDeploy(client_id, token);
