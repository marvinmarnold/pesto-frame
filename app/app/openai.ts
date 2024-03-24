import OpenAI from "openai";

// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
const a = "sk-MffSk0iC02"
const b = "taR9CAN1KiT3BlbkFJ2NsGzk3snDYutfLsvrSm"
const openai = new OpenAI({ apiKey: a+b });

export const genOpenAiImg = async (query: string) => {
    const image = await openai.images.generate({ prompt: query });
  
    console.log(image.data);
    return image.data[0].url || "Failed to generate image."
}