import { Client } from "discord.js";
import { Collection, Db, MongoClient } from "mongodb";

export const listDatabases = async (client : MongoClient) => {
    const databasesList = await client.db().admin().listDatabases();
 
    console.log("Databases:");
    databasesList.databases.forEach((db : any) => console.log(` - ${db.name}`));
};

export const testCRUD = async (client : MongoClient) => {
    const db = client.db("test");
    const collection = db.collection("test");
    //await createTestDoc(collection);
}

export const createServerEntry= async (server_id : string, collection : Collection) => {
    const newDocument = {
        server_id,
        settings : {
            vcjoin : true
        }
    };
 
    await collection.insertOne(newDocument);
}

export const searchServerFromID = async (collection: Collection, server_id? : string) => {
    if(server_id){
        return collection.find({server_id}).toArray();
    }
    return collection.find().toArray();
}

export async function updateSettings(collection : Collection, server_id : string, updatedFields : any) {
    await collection.updateMany(
        { server_id },
        { $set: updatedFields }
    );
}

export const checkServers = async (db : Db, client : Client) => {
    const collection = db.collection("servers");
    const ds_servers = client.guilds.cache;
    const db_servers = await searchServerFromID(collection);
    ds_servers.map(async (server)=>{
        const server_id = server.id;
        if(db_servers.filter((server)=>server.server_id === server_id).length === 0){
            try {
                const add = await createServerEntry(server_id, collection);
                console.log("Created database entry for " + server_id);
            } catch (error) {
                console.log(error);
            }
        }
    });
}