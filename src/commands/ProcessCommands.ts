import { Commands } from "./commands.js";
import { createRequire } from "module";
import { Message } from "discord.js";
import { Db } from "mongodb";
const require = createRequire(import.meta.url);
const GIFS = require("../content/gifs.json");

export default function ProcessCommand(message : Message, db : Db){

    const input = message.content.toLowerCase();

    const getcommand = Commands.filter(c=>{
        switch (c.type) {
            case "EXACT_CHAT":
                return c.match === input
            
            case "INCLUDES_CHAT":
                return c.includes.filter(i=>input.includes(i)).length > 0
            
            case "PREFIX_CHAT":
                if(input.startsWith("manoj ")){
                    const comm = input.split(" ")[1];
                    if(c.includes.includes(comm)){
                        return true;
                    }else{
                        return false;
                    };
                }else{
                    return false;
                }

            default:
                return false;
        }
        
    });

    if(getcommand.length > 0){
        const thisCommand = getcommand[0];
        return [thisCommand.isReply, typeof thisCommand.output(message, db) === "string" ? thisCommand.output(message, db) : false];
    }

    return false;
}