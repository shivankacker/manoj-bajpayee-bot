import { CommandType } from "../types/CommandTypes";
import { createRequire } from "module";
import { probablity } from "../utils/Probablity.js";
const require = createRequire(import.meta.url);
const GIFS = require("../content/gifs.json");
const SLUR_GIFS = require("../content/slurGifs.json");
const SLURS= require("../content/slurs.json");
const CONFUSED_GIFS= require("../content/confusedGifs.json");

export const Commands : CommandType[] = [
    {
        type : "INCLUDES_CHAT",
        includes : [
            " min ",
            " mins "
        ],
        isReply : true,
        output : () => GIFS.every_second
    },
    {
        type : "PREFIX_CHAT",
        includes : [
            "sun"
        ],
        isReply : true,
        output : () => GIFS.kya_bolta_hai
    },
    {
        type : "PREFIX_CHAT",
        includes : SLURS,
        isReply : true,
        output : () => {
            let gif = "Kya bey lawde";
            try{
                gif = SLUR_GIFS[Math.floor(Math.random() * SLUR_GIFS.length)];
            }catch(error){
                console.log(error);
            }
            return gif;
        }
    },
    {
        type : "EXACT_CHAT",
        match : "manoj",
        isReply : true,
        output : () => {
            let gif = "Kya bey lawde";
            try{
                gif = CONFUSED_GIFS[Math.floor(Math.random() * CONFUSED_GIFS.length)];
            }catch(error){
                console.log(error);
            }
            return gif;
        }
    },


    //DO NOT ADD ANYTHING AFTER THIS
    {
        type : "INCLUDES_CHAT",
        includes : [" "],
        isReply : true,
        output : () => {
            //if time is between 12 to 5
            const currentHour = new Date().getHours()+5;
            if(probablity(0.1) && currentHour > 0 && currentHour < 5){
                return GIFS.so_jayie;
            }
        }
    }
]