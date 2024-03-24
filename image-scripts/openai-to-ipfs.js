import axios from 'axios';
import FormData from 'form-data';


const downloadImageAndUploadToIPFS = async (imageUrl, pinataApiKey) => {
  try {
    // Step 1: Download the image from OpenAI URL
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const imageBuffer = Buffer.from(response.data, 'binary');

    // Step 2: Use Pinata to put it on IPFS
    const data = new FormData();
    data.append('file', imageBuffer, {
      filename: 'image.jpg',
      contentType: 'image/jpeg',
    });

    const pinataResponse = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', data, {
      headers: {
        'Authorization': `Bearer ${pinataApiKey}`,
        ...data.getHeaders(),
      },
    });

    console.log(`Image uploaded to IPFS with CID: ${pinataResponse.data.IpfsHash}`);
  } catch (error) {
    console.error('Error uploading image to IPFS:', error);
  }
};

// Example usage:
// At present, this is hard coded to a single image URL
// In practice, we'll receive the image URL from OpenAI endpoint
const imageUrl = 'https://oaidalleapiprodscus.blob.core.windows.net/private/org-QlV7bUj9CtoUf8UgTXPLL1JH/user-6prQk9LVzsOlvxHfrTfKpMQA/img-gtx44kbXpVocYpRp9H1sgcuK.png?st=2024-03-23T22%3A42%3A46Z&se=2024-03-24T00%3A42%3A46Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-03-23T21%3A22%3A43Z&ske=2024-03-24T21%3A22%3A43Z&sks=b&skv=2021-08-06&sig=b6uXYVN1yNpO3XHg2mmwRsmpxjosjAjT2N8OIQGz4Nc%3D';
const pinataApiKey = 'your-pinata-api-key-here';

downloadImageAndUploadToIPFS(imageUrl, pinataApiKey);