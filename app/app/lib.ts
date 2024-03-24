// export const SUPABASE_URL = 'https://wcjajyllcpporgkwgwqv.supabase.co'
export const SUPABASE_URL = 'https://wcjajyllcpporgkwgwqv.supabase.co'
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndjamFqeWxsY3Bwb3Jna3dnd3F2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTEyNTk1MTMsImV4cCI6MjAyNjgzNTUxM30.i_ZmEc3yCr7DbgWnCjXXpW4ETQHTRAe3RMDNgqRCPzc'

export const getBaseUrl = () => {
    let url =
      process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
      process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
      "http://localhost:3000/";
    // Make sure to include `https://` when not localhost.
    url = url.includes("http") ? url : `https://${url}`;
    // Make sure to including trailing `/`.
    url = url.charAt(url.length - 1) === "/" ? url : `${url}/`;
    return url;
  };