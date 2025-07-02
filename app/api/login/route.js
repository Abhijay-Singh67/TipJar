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
        return NextResponse.json({ success: false })
    } else {
        let temp = data.password
        let pass = find[0].password
        let result = await bcrypt.compare(temp,pass)
        if(result===true){
            let SID = uuidv4()
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
        }else{
            return NextResponse.json({ success: false })
        }
    }
}
