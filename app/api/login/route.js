import { NextResponse } from "next/server";
import {MongoClient} from "mongodb";
import { v4 as uuidv4 } from "uuid";
const client = new MongoClient("mongodb://localhost:27017/")
client.connect();

export async function POST(request) {
    let data = await request.json();
    const db = client.db("TipJar")
    const collection = db.collection("userdata")
    const find = await collection.find(data).toArray();
    if(find.length===0){
        return NextResponse.json({success: false})
    }
    return NextResponse.json({success: true, SID:uuidv4()});
}
