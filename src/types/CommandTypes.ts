import { Message } from "discord.js"
import { Db } from "mongodb"

export type CommandType = 
    | ChatIncludesCommandType
    | ChatExactCommandType
    | ChatPrefixCommandType

export type ChatIncludesCommandType = {
    type : "INCLUDES_CHAT",
    includes : string[],
    isReply? : true,
    output : (message : Message, db : Db) => string
}

export type ChatExactCommandType = {
    type : "EXACT_CHAT",
    match : string,
    isReply? : true,
    output : (message : Message, db : Db) => string
}

export type ChatPrefixCommandType = {
    type : "PREFIX_CHAT",
    includes : string[],
    isReply? : true,
    output : (message : Message, db : Db) => string
}