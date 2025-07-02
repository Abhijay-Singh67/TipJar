import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(request) {
    const client = await clientPromise;
    const id = (request.headers.get("referer")).split("/").reverse()[0]
    const db = client.db("TipJar");
    const collection = db.collection("userdata");
    let user = await collection.findOne({id:id})
    return NextResponse.json({success:true,profile:user.profile, first:user.first,last:user.last,about:user.about});
}
