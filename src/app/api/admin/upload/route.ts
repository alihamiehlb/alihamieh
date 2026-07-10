import { NextResponse } from "next/server";
import { isAdminSession } from "@/lib/admin-auth";
import { uploadImage } from "@/lib/storage";
import { uploadImageToMongo } from "@/lib/mongodb-storage";

export async function POST(req: Request) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Images only" }, { status: 400 });
  }

  if (file.size > 6 * 1024 * 1024) {
    return NextResponse.json({ error: "Max 6MB" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  
  // Use MongoDB storage function (which falls back to Blob/local for images)
  const result = await uploadImageToMongo(buffer, file.name, file.type);
  return NextResponse.json(result);
}
