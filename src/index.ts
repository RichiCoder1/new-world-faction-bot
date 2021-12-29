import { container, SapphireClient } from "@sapphire/framework";
import "@sapphire/plugin-logger/register";
import env from "env-var";
import { mongoose } from "./db";
import { readdir, lstat } from "node:fs/promises";
import { join } from "node:path/posix";

const token = env.get("DISCORD_TOKEN").asString();
const databaseUrl = env.get('DATABASE_URL').required().asUrlString();
const databaseUser = env.get('DATABASE_USER').required().asString();
const databasePassword = env.get('DATABASE_PASSWORD').required().asString();

const client = new SapphireClient({ 
    intents: ["GUILDS", "GUILD_MESSAGES"],
    presence: {
        activities: [
            {
                name: 'Commands',
                type: 'LISTENING',
            }
        ]
    }
});

(async () => {
    const dirs: string[] = [];
    for (const dir of dirs) {
        container.stores.registerPath(join(__dirname, dir));
    }

    await mongoose.connect(databaseUrl, {
        user: databaseUser,
        pass: databasePassword,
        autoCreate: true,
        autoIndex: true,
    });
    await client.login(token);
})().catch(e => {
    console.error(e);
    process.exit(1);
});