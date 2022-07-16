import { AudioPlayerStatus, createAudioPlayer, createAudioResource, joinVoiceChannel } from "@discordjs/voice";
import { Client } from "discord.js";
import * as fs from 'fs';
import { Db } from "mongodb";
import * as path from 'path';
import { probablity } from "../utils/Probablity.js";
import { searchServerFromID } from "./database.js";

export const runVoicePranks = async (client : Client, db: Db) => {

    const db_servers = await searchServerFromID(db.collection("servers"));

	client.channels.cache.filter(c=>c.type === "GUILD_VOICE").forEach((c : any)=>{

        const thisServerDB = db_servers.filter((server)=>server.server_id === c.guild.id)[0];
        
		if(thisServerDB.settings.vcjoin && probablity(0.01) && c.members.size > 0 && !c.members.has(client.user?.id)){
            
			console.log("Joining "+c.name)
            
            const connection = joinVoiceChannel({
                channelId : c.id,
                guildId : c.guild.id,
                adapterCreator : c.guild.voiceAdapterCreator
            })
            const player = createAudioPlayer();

            const files = fs.readdirSync(path.join("src", 'content', "audio"));
            const randomFile = files[Math.floor(Math.random() * files.length)];
            const resource = createAudioResource(fs.createReadStream(path.join("src", 'content', "audio" ,randomFile)));
            connection.subscribe(player);
            player.play(resource);

            let interval = setInterval(async ()=>{
                const channel : any = await client.channels.fetch(c.id);
                
                if(channel.members.size === 1 && c.members.has(client.user?.id)){
                    try{
                        connection.destroy();
                    }catch(error){
                        console.log("error");
                    }
                    
                    clearInterval(interval);
                }
            },1000);

            player.on(AudioPlayerStatus.Idle, () => {
                connection.destroy();
                clearInterval(interval);
            });
		}
	});
}