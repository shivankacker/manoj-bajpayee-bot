import { Client, Intents } from 'discord.js';
import dotenv from 'dotenv';
dotenv.config();

import { createRequire } from "module";
import { helpMessage } from './commands/commands.js';
import ProcessCommand from './commands/ProcessCommands.js';
import { runVoicePranks } from './commands/VoicePranks.js';
import { convertToParagraph } from './utils/StringUtils.js';
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

client.on('guildCreate', guild => {
	const channel : any = guild.channels.cache.find(channel => channel.type === 'GUILD_TEXT'); //&& channel.permissionsFor(client.user?.id).has('SEND_MESSAGES'))
    channel.send(convertToParagraph(`
		मुझे यहाँ बुलाने के लिए धन्यवाद!
		${helpMessage}\nमज़े करे!\n${GIFS.hello}
	`));
})

client.login(token);
