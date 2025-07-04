import { createClient } from '@supabase/supabase-js'

export const createSupabaseClient = () => {
  return createClient(
    process.env.SUPABASE_DATABASE_URL!,
    process.env.SUPABASE_DATABASE_KEY!,
  )
}
