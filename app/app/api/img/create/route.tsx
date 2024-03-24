export async function POST(request: Request) {
  const res = await request.json()
  const { base, pasta, topping1, topping2 } = res

  // create a task in pending state
  // return task ID
  // cron job to run task

   
    const data = {jobId: "uuid-1234-5678-91011-12131415161718" }
    return Response.json(data)
  }