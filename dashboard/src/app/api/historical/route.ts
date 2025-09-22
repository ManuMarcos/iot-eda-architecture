import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/backend/lib/mongodb";

export async function GET(req: NextRequest) {
  try {
    const db = await getDb();
    const collection = db.collection("processed");

    const data = await collection.find({}).toArray();

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
