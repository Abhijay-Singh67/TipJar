import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { cookies } from 'next/headers';

export async function POST(request) {
    const client = await clientPromise;
    let data = await request.json();
    const db = client.db("TipJar")
    const collection = db.collection("userdata")
    const cookieStore = cookies();
    const SID = (await cookieStore).get("SID")?.value
    const email = (await collection.findOne({ SID: SID })).email;
    await collection.updateOne({email:email},{$set:{upi:data.upi,profile:data.profile,thumbnail:data.profileThumb,first:data.first,last:data.last,about:data.about}})
    return NextResponse.json({ success: true });
}
export async function GET(request) {
    const client = await clientPromise;
    const db = client.db("TipJar")
    const collection = db.collection("userdata")
    const cookieStore = cookies();
    const SID = (await cookieStore).get("SID")?.value
    const email = (await collection.findOne({ SID: SID })).email;
    let user = await collection.findOne({email:email})
    return NextResponse.json({ success: true, upi:user.upi, profile:user.profile, thumbnail:user.thumbnail, first:user.first,last:user.last,about:user.about, id:user.id});
}