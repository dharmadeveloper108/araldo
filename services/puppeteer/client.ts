import puppeteer, { Browser } from 'puppeteer'

export interface PuppeteerClient {
  fetchHtmlAsStringFromUrl(url: string): Promise<string | undefined>
}

export class LocalPuppeteerClient
  implements PuppeteerClient, LocalPuppeteerClient
{
  private browser!: Browser

  public async load() {
    this.browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })
  }

  public async unload() {
    await this.browser.close()
  }

  public async fetchHtmlAsStringFromUrl(url: string) {
    try {
      const page = await this.browser.newPage()

      const realisticUserAgent =
        'Mozilla/5.0 (Windows NT 10.0 Win64 x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
      await page.setUserAgent(realisticUserAgent)
      const response = await page.goto(url, {
        waitUntil: 'domcontentloaded',
        timeout: 15000,
      })

      if (!response || !response.ok()) {
        throw new Error(`Failed to load page ${url}: ${response?.status()}`)
      }

      const html = await page.content()

      return html
    } catch (err) {
      console.log(`Error fetching html: ${err}`)
      throw err
    }
  }
}
