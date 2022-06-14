export type CommandType = 
    | ChatIncludesCommandType
    | ChatExactCommandType
    | ChatPrefixCommandType

export type ChatIncludesCommandType = {
    type : "INCLUDES_CHAT",
    includes : string[],
    isReply? : true,
    output : () => string
}

export type ChatExactCommandType = {
    type : "EXACT_CHAT",
    match : string,
    isReply? : true,
    output : () => string
}

export type ChatPrefixCommandType = {
    type : "PREFIX_CHAT",
    includes : string[],
    isReply? : true,
    output : () => string
}