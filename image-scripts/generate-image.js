import OpenAI from "openai";
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.API_KEY });


async function main() {
    const image = await openai.images.generate({ prompt: "A cute baby sea otter" });
  
    console.log(image.data);
  }

main();