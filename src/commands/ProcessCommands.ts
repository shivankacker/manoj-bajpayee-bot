import { Commands } from "./commands.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const GIFS = require("../content/gifs.json");

export default function ProcessCommand(input : string){


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
        return [thisCommand.isReply, typeof thisCommand.output() === "string" ? thisCommand.output() : false];
    }

    return false;
}