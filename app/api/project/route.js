import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { cookies } from 'next/headers';
const client = new MongoClient("mongodb://localhost:27017/")
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
            projects.push(data)
            await collection.updateOne({ email: email }, { $set: { projects: projects } })
        } else {
            await collection.insertOne({ email: email, projects: [data] })
        }
        return NextResponse.json({ success: true })
    } catch {
        return NextResponse.json({ success: false })
    }
}
