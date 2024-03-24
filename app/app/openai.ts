import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const genImg = async (base: string, pasta: string, topping1: string, topping2: string) => {
    const image = await openai.images.generate({ prompt: `A high resolution fun cartoon image of a bowl of pesto. The pesto is made of ${base} with ${pasta} noodles and ${topping1} and ${topping2} fixings that are both incorporated in the dish and in the laid beside the bowl.` });
  
    console.log(image.data);
    return image.data[0].url || "Failed to generate image."
}