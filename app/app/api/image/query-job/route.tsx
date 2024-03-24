import { type NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { SUPABASE_ANON_KEY, SUPABASE_URL } from '@/app/lib'

// #GET /api/img/get?jobId=uuid-1234-5678-91011-12131415161718
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const jobId = searchParams.get('jobId')
  // query is "hello" for /api/search?query=hello

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    const { data, error } = await supabase
        .from('image-jobs')
        .select('status, openAiUrl')
        .eq('id', jobId)
        .maybeSingle()

    if (!!data) {
        return Response.json({status: data.status, openAiUrl: data.openAiUrl, jobId})
    }

  return Response.json({status: "pending", openAiUrl: "", jobId})
}