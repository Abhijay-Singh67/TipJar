import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { cookies } from 'next/headers';
export async function GET(request) {
    const client = await clientPromise;
    const cookieStore = cookies();
    const SID = (await cookieStore).get("SID")?.value
    const db = client.db("TipJar");
    const collection = db.collection("userdata");
    const find = await collection.find({SID:SID}).toArray();
    if(find.length===0){
        return NextResponse.json({logged: false})
    }else{
        return NextResponse.json({logged:true})
    }
}

export async function POST(request) {
    const client = await clientPromise;
    let data = await request.json();
    const db = client.db("TipJar");
    const collection = db.collection("userdata");
    const user = await collection.findOne({email:data.email})
    return NextResponse.json({success:true, upi:user.upi});
}

export async function DELETE(request){
    const response = NextResponse.json({success: true});
    response.cookies.set({
        name: "SID",
        value: '',
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        path: "/",
        expires: new Date(0)
    });
    return response;
}