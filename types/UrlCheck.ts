export type UrlCheck = {
  id: string
  url: string
  /**
   * CRON expression in the format:
   * ┌───────────── (optional) seconds (0 - 59)
   * │ ┌───────────── minutes (0 - 59)
   * │ │ ┌───────────── hours (0 - 23)
   * │ │ │ ┌───────────── day of month (1 - 31)
   * │ │ │ │ ┌───────────── month (1 - 12)
   * │ │ │ │ │ ┌───────────── day of week (0 - 6) (Sunday to Saturday)
   * │ │ │ │ │ │
   * │ │ │ │ │ │
   * * * * * * *
   *
   * Example: '0 30 10 * * 1' = Every Monday at 10:30:00
   */
  cronPeriod: number
  hash: string
  urlName?: string
  lastCheckedAt: Date
}
