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
  // const filePath = await tts.toFile("./example_audio.webm", message);
  // const audio = fs.readFileSync(filePath);
  const readable = tts.toStream(message);
  let audio: Buffer[] = [];
  readable.on("data", (data: Buffer) => {
    audio.push(data);
    console.log("DATA RECEIVED", readable.readable);
    // raw audio file data
  });
  let audio_buffer: any = null;
  await new Promise((res) =>
    readable.on("end", () => {
      audio_buffer = Buffer.concat(audio);
      res(null);
    })
  );
  return Response.json({ data: audio_buffer.toString("binary") });
}
