import { SUPABASE_ANON_KEY, SUPABASE_URL } from '@/app/lib'
import { createClient } from '@supabase/supabase-js'

// curl -X POST http://localhost:3000/api/image/create-job -d '{"base": "tomato", "pasta": "spaghetti", "topping1": "cheese", "topping2": "pepperoni"}'
export async function POST(request: Request) {
    const res = await request.json()
    const { base, pasta, topping1, topping2 } = res

    const query = `A high resolution fun cartoon image of a bowl of pesto. The pesto is made of ${base} with ${pasta} noodles and ${topping1} and ${topping2} fixings that are both incorporated in the dish and in the laid beside the bowl.`
    console.log("create client " + process.env.SUPABASE_URL)
    
    // Create a single supabase client for interacting with your database
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

    // create a task in pending state
    // return task ID
    // cron job to run task
    const { data } = await supabase
        .from('image-jobs')
        .insert({ query })
        .select('id')
        .maybeSingle()
    
    if (!!data)
      return Response.json({jobId: data.id})

    throw new Error("Failed to create job.")
}