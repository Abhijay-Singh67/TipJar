import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt"

export async function POST(request) {
    const client = await clientPromise;
    let data = await request.json();
    const db = client.db("TipJar")
    const collection = db.collection("userdata")
    const find = await collection.find({ email: data.email }).toArray();
    if (find.length === 0) {
        let pass = data.password
        let hash = await bcrypt.hash(pass,10);
        let SID = uuidv4();
        await collection.insertOne({id:uuidv4(), username: data.username, email: data.email, password: hash, SID:"", upi:"",profile:"",thumbnail:"",first:"",last:"",about:""});
        await collection.updateOne({email:data.email},{$set:{SID:SID}})
        const response =  NextResponse.json({ success: true})
            response.cookies.set({
                name: "SID",
                value: SID,
                httpOnly: true,
                secure: false,
                sameSite: 'strict',
                path: "/",
                maxAge: 60*60*24
            });
            return response;
    }
    return NextResponse.json({ success: false })
}