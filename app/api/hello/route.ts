import { MsEdgeTTS } from "msedge-tts";

import fs from "fs";
import { NextRequest, NextResponse } from "next/server";
const tts = new MsEdgeTTS();

type ResponseData = {
  message: string;
};

export async function POST(req: NextRequest, res: NextResponse<ResponseData>) {
  await tts.setMetadata(
    "en-US-SteffanNeural",
    MsEdgeTTS.OUTPUT_FORMATS.WEBM_24KHZ_16BIT_MONO_OPUS
  );
  const message = (await req.json()).message;
  console.log(message);
  const filePath = await tts.toFile("./example_audio.webm", message);
  const audio = fs.readFileSync(filePath);

  return Response.json({ data: audio.toString("binary") });
}
