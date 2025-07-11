import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { cookies } from 'next/headers';

export async function GET(request) {
    const client = await clientPromise;
    const cookieStore = cookies();
    const SID = (await cookieStore).get("SID")?.value
    const db = client.db("TipJar")
    const transactions = db.collection("transactions")
    const userdb = db.collection("userdata")
    let email = (await userdb.findOne({SID:SID})).email
    let transaction = (await transactions.findOne({email:email})).transactions
    return NextResponse.json({success:true, transaction:transaction})
}

export async function POST(request) {
    const client = await clientPromise;
    let data = await request.json();
    const db = client.db("TipJar")
    const collection = db.collection("transactions")
    const user = await collection.findOne({email:data.email})
    let transactions = user.transactions
    transactions.push({timestamp:String(data.timestamp),amount:Number(data.amount)})
    await collection.updateOne({email:data.email},{$set:{transactions:transactions}})
    return NextResponse.json({success:true})
}
