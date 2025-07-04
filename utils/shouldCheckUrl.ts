import { UrlCheck } from '../types/UrlCheck'

export function shouldCheckUrl(record: UrlCheck) {
  const now = new Date()
  const nextCheckAt = new Date(record.lastCheckedAt)
  nextCheckAt.setDate(nextCheckAt.getDate() + record.cronPeriod)
  return now >= nextCheckAt
}
