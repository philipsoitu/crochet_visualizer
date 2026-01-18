import { connectDB } from "../../../db.ts";
import { json } from "@sveltejs/kit";

export async function GET() {
	await connectDB();
	return json({ ok: true });
}
