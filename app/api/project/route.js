import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { cookies } from 'next/headers';
import { v4 as uuidv4 } from "uuid";
const client = new MongoClient(process.env.MONGO_URI)
client.connect();

export async function GET(request) {
    const cookieStore = cookies();
    const SID = (await cookieStore).get("SID")?.value
    const d = client.db("TipJar");
    const coll = d.collection("userdata");
    const email = (await coll.findOne({ SID: SID })).email;
    const db = client.db("TipJar")
    const collection = db.collection("projects")
    let projects = await collection.findOne({email:email})
    return NextResponse.json({success:true, projects:projects})
}
export async function POST(request) {
    try {
        const cookieStore = cookies();
        const SID = (await cookieStore).get("SID")?.value
        const d = client.db("TipJar");
        const coll = d.collection("userdata");
        const email = (await coll.findOne({ SID: SID })).email;
        let data = await request.json();
        const db = client.db("TipJar")
        const collection = db.collection("projects")
        let find = await collection.find({ email: email }).toArray()
        if (find.length > 0) {
            let projects = find[0].projects
            projects.push({data:data,pid:uuidv4()})
            await collection.updateOne({ email: email }, { $set: { projects: projects } })
        } else {
            await collection.insertOne({ email: email, projects: [{data:data,pid:uuidv4()}] })
        }
        return NextResponse.json({ success: true })
    } catch {
        return NextResponse.json({ success: false })
    }
}

export async function DELETE(request){
    const {searchParams} = new URL(request.url);
    const pid = searchParams.get('pid');
    const cookieStore = cookies();
    const SID = (await cookieStore).get("SID")?.value
    const d = client.db("TipJar");
    const coll = d.collection("userdata");
    const email = (await coll.findOne({ SID: SID })).email;
    const db = client.db("TipJar")
    const collection = db.collection("projects")
    let find = (await collection.findOne({email:email})).projects;
    let projects = find.filter((i)=>i.pid!==pid)
    let url = (find.filter((i)=>i.pid===pid)[0]).data.url
    await collection.updateOne({email:email},{$set:{projects:projects}})
    return NextResponse.json({success:true ,url:url});
}