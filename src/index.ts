import { Client, Intents } from 'discord.js';
import dotenv from 'dotenv';
import { Db, MongoClient, ServerApiVersion } from 'mongodb';
dotenv.config();

import { createRequire } from "module";
import { helpMessage } from './commands/commands.js';
import ProcessCommand from './commands/ProcessCommands.js';
import { runVoicePranks } from './commands/VoicePranks.js';
import { convertToParagraph } from './utils/StringUtils.js';
import { checkServers, createServerEntry, listDatabases, testCRUD } from './commands/database.js';
const require = createRequire(import.meta.url);
const GIFS = require("./content/gifs.json");

const uri = process.env.MONGO_URL || "";
const mongoOptions = { 
	useNewUrlParser: true, 
	useUnifiedTopology: true, 
	serverApi: ServerApiVersion.v1 
}
const mongoClient = new MongoClient(uri, mongoOptions);

const token = process.env.DISCORD_TOKEN;

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] });

let db : Db;

client.once('ready', async () => {
	console.log(`Ready! Logged in as ${client.user?.tag}`);
	client.user?.setActivity('"manoj"', { type: 'LISTENING' });

	try {
		await mongoClient.connect();
		db = mongoClient.db("mbbot");
		//await listDatabases(mongoClient);
		await checkServers(db, client);
	} catch (error) {
		console.error(error);
	} finally {
		//await mongoClient.close();
	}

	console.log(`Active in ${client.guilds.cache.size} servers`);
	console.log(`Active in ${client.channels.cache.size} channels`);

	runVoicePranks(client, db);

	setInterval(()=>{
		runVoicePranks(client, db);
	},5000)
});

client.on('messageCreate', (message : any) => {
	if (!message.author.bot) {
		if (message.mentions.has(client.user?.id)) {
			message.reply(GIFS.aa_raha_hu);
		}else{
			const out = ProcessCommand(message, db);
			if(out && out[1]){
				out[0] ? message.reply(out[1]) : message.channel.send(out[1]);
			}
		}
	};
});

client.on('guildCreate', guild => {

	createServerEntry(guild.id, db.collection("servers"));

	const channel : any = guild.channels.cache.find(channel => channel.type === 'GUILD_TEXT'); //&& channel.permissionsFor(client.user?.id).has('SEND_MESSAGES'))
    channel.send(convertToParagraph(`
		मुझे यहाँ बुलाने के लिए धन्यवाद!
		${helpMessage}\nमज़े करे!\n${GIFS.hello}
	`));
})

client.login(token);