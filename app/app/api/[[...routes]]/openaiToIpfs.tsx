
import axios from 'axios';
import FormData from 'form-data';

export const imgToIPFS = async (imageUrl: string, pinataApiKey: string) => {
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