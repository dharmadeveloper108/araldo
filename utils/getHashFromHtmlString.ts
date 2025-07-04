import { createHash } from 'crypto'

export const getHashFromHtmlString = (htmlString: string) => {
  return createHash('sha256', { encoding: 'hex' })
    .update(htmlString)
    .digest('hex')
}
