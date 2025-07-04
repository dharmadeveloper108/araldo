import { CreateEmailResponse, Resend } from 'resend'

type EmailProps = {
  url: string
  newHashFromHtml: string
  urlName?: string
}

export interface ResendClient {
  sendUrlChangeNotification({
    to,
    emailProps,
  }: {
    to: string
    emailProps: EmailProps
  }): Promise<CreateEmailResponse>
}

export class LocalResendClient implements ResendClient, LocalResendClient {
  private resend!: Resend

  public load() {
    this.resend = new Resend(process.env.RESEND_API_KEY!)
  }

  public async sendUrlChangeNotification({
    to,
    emailProps,
  }: {
    to: string
    emailProps: EmailProps
  }) {
    const res = await this.resend.emails.send(
      {
        from: 'Araldo <onboarding@resend.dev>',
        to,
        subject: `The web page ${emailProps.urlName ?? ''} you saved has been updated!`,
        html: `<p>Go check out what changed <a href="${emailProps.url}">here</a>! 👀</p>`,
      },
      {
        idempotencyKey: emailProps.newHashFromHtml,
      },
    )

    if (res.error) {
      throw new Error(res.error.message)
    }

    return res
  }
}
