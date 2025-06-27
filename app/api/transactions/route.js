import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { cookies } from 'next/headers';
const client = new MongoClient("mongodb://localhost:27017/")
client.connect();

export async function GET(request) {
    const cookieStore = cookies();
    const SID = (await cookieStore).get("SID")?.value
    const db = client.db("TipJar")
    const transactions = db.collection("transactions")
    const userdb = db.collection("userdata")
    let email = (await userdb.findOne({SID:SID})).email
    let transaction = (await transactions.findOne({email:email})).transactions
    return NextResponse.json({success:true, transaction:transaction})
}
