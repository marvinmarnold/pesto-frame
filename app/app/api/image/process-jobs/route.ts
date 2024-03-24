import { type NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { SUPABASE_ANON_KEY, SUPABASE_URL } from '@/app/lib'
import { genOpenAiImg } from '@/app/openai'

export const dynamic = 'force-dynamic'; // no caching

// curl -X GET http://localhost:3000/api/image/process-jobs
export async function GET(request: NextRequest) {

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

  // get all jobs in pending state
    const { data: pendingJobs, error } = await supabase
        .from('image-jobs')
        .select('*')
        .eq('status', 'pending')
        // .limit(1)
        // .maybeSingle()

    console.log("Pending jobs: " + JSON.stringify(pendingJobs))

    if (!!pendingJobs) {
        const jobPromises = pendingJobs.map((job) => {
            return genOpenAiImg(job.query).then((openAiUrl) => {
                // console.log("Got image URL " + job.id + ": " + openAiUrl)
                return supabase
                    .from('image-jobs')
                    .update({status: 'ready', openAiUrl})
                    .eq('id', job.id)
            })
        })

        const jobResults = await Promise.all(jobPromises)
        return Response.json({processed: jobResults.length})
    }
    // if (!!pendingJobs) {
    //         const openAiUrl = await genOpenAiImg(pendingJobs.query)
            
    //         console.log("Got image URL " + pendingJobs.id + ": " + openAiUrl)
    //         await supabase
    //             .from('image-jobs')
    //             .update({status: 'ready', openAiUrl})
    //             .eq('id', pendingJobs.id)

    //     return Response.json({processed: 1})
    // }

    return Response.json({processed: -1})
}