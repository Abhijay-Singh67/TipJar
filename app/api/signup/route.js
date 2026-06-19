import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt"

export async function POST(request) {
    const client = await clientPromise;
    let data = await request.json();
    const db = client.db("TipJar")
    const userCollection = db.collection("userdata");
    const projectsCollection = db.collection("projects");
    const transactionsCollection = db.collection("transactions");
    const followersCollection = db.collection("followers");
    const find = await userCollection.find({ email: data.email }).toArray();
    if (find.length === 0) {
        let pass = data.password
        let hash = await bcrypt.hash(pass,10);
        let SID = uuidv4();
        await userCollection.insertOne({id:uuidv4(), username: data.username, email: data.email, password: hash, SID:"", upi:"",profile:"",thumbnail:"",first:"",last:"",about:""});
        await userCollection.updateOne({email:data.email},{$set:{SID:SID}})
        await projectsCollection.insertOne({email:data.email, projects:[]});
        await transactionsCollection.insertOne({email:data.email, transactions:[]});
        await followersCollection.insertOne({email:data.email, followers: 0, following:[]});
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