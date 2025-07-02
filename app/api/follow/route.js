import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { cookies } from 'next/headers';
const client = new MongoClient(process.env.MONGO_URI)
client.connect();

export async function GET(request) {
    const cookieStore = cookies();
    const SID = (await cookieStore).get("SID")?.value
    const db = client.db("TipJar")
    const fol = db.collection("followers")
    const userdb = db.collection("userdata")
    let email = (await userdb.findOne({SID:SID})).email
    let follow = (await fol.findOne({email:email}))
    return NextResponse.json({success:true, followers:follow.followers, following:follow.following})
}

export async function POST(request) {
    let data = await request.json();
    const cookieStore = cookies();
    const SID = (await cookieStore).get("SID")?.value
    let db = client.db("TipJar")
    let collection  = db.collection("userdata")
    let follow = await collection.findOne({id:data.id});
    let email = (await collection.findOne({SID:SID})).email
    collection = db.collection("followers")
    let userfollowing = (await collection.findOne({email:email})).following;
    userfollowing.push({username:follow.username,email:follow.email,id:follow.id})
    await collection.updateOne({email:email},{$set:{following:userfollowing}})
    let fol = (await collection.findOne({email:follow.email})).followers
    await collection.updateOne({email:follow.email},{$set:{followers:fol+1}})
    return NextResponse.json({success:true});
}

export async function DELETE(request) {
    const id = (request.headers.get("referer")).split("/").reverse()[0]
    console.log(id)
    const cookieStore = cookies();
    const SID = (await cookieStore).get("SID")?.value
    let db = client.db("TipJar")
    let collection  = db.collection("userdata")
    let follow = await collection.findOne({id:id});
    let email = (await collection.findOne({SID:SID})).email;  
    collection = db.collection("followers")
    let userfollowing = (await collection.findOne({email:email})).following;
    userfollowing = userfollowing.filter((i)=>i.id!==id)
    await collection.updateOne({email:email},{$set:{following:userfollowing}})
    let fol = (await collection.findOne({email:follow.email})).followers
    await collection.updateOne({email:follow.email},{$set:{followers:fol-1}})
    return NextResponse.json({success:true});
}
