import { PuppeteerClient } from '../services/puppeteer/client'
import { getHashFromHtmlString } from '../utils/getHashFromHtmlString'
import { shouldCheckUrl } from '../utils/shouldCheckUrl'
import { ResendClient } from '../services/resend/client'
import { UrlCheckClient } from '../services/supabase/urlCheck/client'

type NotificationConfig = {
  recipientEmail: string
}

export const checkUrlsAndNotify = async (
  urlCheckClient: UrlCheckClient,
  resendClient: ResendClient,
  puppeteerClient: PuppeteerClient,
  config: NotificationConfig,
) => {
  const urlRecords = await urlCheckClient.fetchUrls()

  if (!urlRecords.data) {
    console.info('No urlCheck records found.')
    return
  }

  await Promise.all(
    urlRecords.data.map(async (urlRecord) => {
      if (!shouldCheckUrl(urlRecord)) {
        return
      }

      await puppeteerClient
        .fetchHtmlAsStringFromUrl(urlRecord.url)
        .then(async (newHtmlString) => {
          if (!newHtmlString) {
            throw new Error('Html fetching from url failed.')
          }

          const newHashFromHtml = getHashFromHtmlString(newHtmlString)
          const isWebPageUpdated = newHashFromHtml != urlRecord.hash

          if (isWebPageUpdated) {
            await urlCheckClient.updateUrl({
              id: urlRecord.id,
              hash: newHashFromHtml,
            })

            const emailRes = await resendClient.sendUrlChangeNotification({
              to: config.recipientEmail,
              emailProps: {
                url: urlRecord.url,
                newHashFromHtml,
                urlName: urlRecord.urlName,
              },
            })

            console.log(emailRes)
          }
        })
        .catch((err) => {
          console.error(`Error processing URL (${urlRecord.url}):`, err)
        })
    }),
  )
}
