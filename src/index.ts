import { Client, Intents } from 'discord.js';
import dotenv from 'dotenv';
dotenv.config();

import { createRequire } from "module";
import ProcessCommand from './commands/ProcessCommands.js';
import { runVoicePranks } from './commands/VoicePranks.js';
const require = createRequire(import.meta.url);
const GIFS = require("./content/gifs.json");

const token = process.env.DISCORD_TOKEN;

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] });

client.once('ready', () => {
	console.log(`Ready! Logged in as ${client.user?.tag}`);
	client.user?.setActivity("maut ka khel");

	console.log(`Active in ${client.guilds.cache.size} servers`);
	console.log(`Active in ${client.channels.cache.size} channels`);

	runVoicePranks(client);

	setInterval(()=>{
		runVoicePranks(client);
	},5000)
});

client.on('messageCreate', (message : any) => {
	if (!message.author.bot) {
		if (message.mentions.has(client.user?.id)) {
			message.reply(GIFS.aa_raha_hu);
		}else{
			const out = ProcessCommand(message.content.toLowerCase());
			if(out && out[1]){
				out[0] ? message.reply(out[1]) : message.channel.send(out[1]);
			}
		}
	};
});

// Assuming 'newMember' is the second parameter of the event.


// const voiceChannels = client.guilds.channels.filter((c : any) => c.type === 'voice');
// let count = 0;
// 
// for (const [id, voiceChannel] of voiceChannels) count += voiceChannel.members.size;
// 
// console.log(count);


client.login(token);
