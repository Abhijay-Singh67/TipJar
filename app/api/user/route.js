import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
const client = new MongoClient("mongodb://localhost:27017/")
client.connect();
export async function GET(request) {
    const id = (request.headers.get("referer")).split("/").reverse()[0]
    const db = client.db("TipJar");
    const collection = db.collection("userdata");
    let user = await collection.findOne({id:id})
    return NextResponse.json({success:true,profile:user.profile, first:user.first,last:user.last,about:user.about});
}
