import { type NextRequest } from 'next/server'

// #GET /api/img/get?jobId=uuid-1234-5678-91011-12131415161718
export function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('jobId')
  // query is "hello" for /api/search?query=hello

  return {status: "ready", openAiUrl: "https://oaidalleapiprodscus.blob.core.windows.net/private/org-QlV7bUj9CtoUf8UgTXPLL1JH/user-6prQk9LVzsOlvxHfrTfKpMQA/img-SbDNFMgGapPu3iBe80vRM3xj.png?st=2024-03-24T03%3A10%3A03Z&se=2024-03-24T05%3A10%3A03Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-03-23T21%3A32%3A19Z&ske=2024-03-24T21%3A32%3A19Z&sks=b&skv=2021-08-06&sig=62ZsP/z%2BcFBSP%2BvQ%2BQb6VhqMPoaI/ZgNvASfFIzavi0%3D", jobId: "uuid-1234-5678-91011-12131415161718"}
  //   return {status: "pending | ready | failed", openAiUrl: "https://aoristeno.com", jobId: "uuid-1234-5678-91011-12131415161718"}
}

