import express from 'express'
import env from 'dotenv'
import { LocalNodeCronClient } from './services/nodeCron/client'
import { LocalUrlCheckClient } from './services/supabase/urlCheck/client'
import { LocalResendClient } from './services/resend/client'
import { checkUrlsAndNotify } from './core/checkUrlsAndNotify'
import { LocalPuppeteerClient } from './services/puppeteer/client'

env.config()

const app = express()
const PORT = 3000

const EVERY_DAY_AT_9_AM = '0 0 9 * * *' // CET

const ONLY_USER_IN_THE_VILLAGE = process.env.DEV_EMAIL!

app.listen(PORT, async () => {
  console.log(`Server is running at http://localhost:${PORT}`)
})

async function main() {
  const urlCheckClient = new LocalUrlCheckClient()
  urlCheckClient.load()

  const resendClient = new LocalResendClient()
  resendClient.load()

  const nodeCronClient = new LocalNodeCronClient()
  nodeCronClient.load()

  const puppeteerClient = new LocalPuppeteerClient()
  await puppeteerClient.load()

  nodeCronClient.scheduleAction({
    action: async () => {
      try {
        await checkUrlsAndNotify(
          urlCheckClient,
          resendClient,
          puppeteerClient,
          { recipientEmail: ONLY_USER_IN_THE_VILLAGE },
        )
      } catch (err) {
        console.error('Error during scheduled action: ', err)
      } finally {
        await puppeteerClient.unload()
      }
    },
    cronPeriod: EVERY_DAY_AT_9_AM,
  })
}

main().catch((err) => {
  console.error('Fatal error in main()', err)
  process.exit(1)
})
