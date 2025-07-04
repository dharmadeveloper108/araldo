import { PostgrestError, SupabaseClient } from '@supabase/supabase-js'
import { UrlCheck } from '../../../types/UrlCheck'
import { createSupabaseClient } from '../client'

const table = 'UrlCheck'

export interface UrlCheckClient {
  fetchUrls(): Promise<{
    data: UrlCheck[] | null
    error: PostgrestError | null
  }>
  updateUrl({ id, hash }: Pick<UrlCheck, 'id' | 'hash'>): Promise<{
    data: UrlCheck[] | null
    error: PostgrestError | null
  }>
}

export class LocalUrlCheckClient
  implements UrlCheckClient, LocalUrlCheckClient
{
  private supabaseClient!: SupabaseClient

  public load() {
    this.supabaseClient = createSupabaseClient()
  }

  public fetchUrls = async () => {
    return await this.supabaseClient.from(table).select()
  }

  public updateUrl = async ({ id, hash }: Pick<UrlCheck, 'id' | 'hash'>) => {
    return await this.supabaseClient
      .from(table)
      .update({ hash, lastCheckedAt: new Date() })
      .eq('id', id)
      .select()
  }
}
