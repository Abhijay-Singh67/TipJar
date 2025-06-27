import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { cookies } from 'next/headers';
const client = new MongoClient("mongodb://localhost:27017/")
client.connect();

export async function GET(request) {
    const cookieStore = cookies();
    const SID = (await cookieStore).get("SID")?.value
    const db = client.db("TipJar")
    const fol = db.collection("followers")
    const userdb = db.collection("userdata")
    let email = (await userdb.findOne({SID:SID})).email
    let followers = (await fol.findOne({email:email})).followers
    return NextResponse.json({success:true, followers:followers})
}
