import cron from 'node-cron'

export interface NodeCronClient {
  scheduleAction({
    action,
    cronPeriod,
  }: {
    action: () => void
    cronPeriod: string
  }): void
}

export class LocalNodeCronClient
  implements NodeCronClient, LocalNodeCronClient
{
  public load() {
    // do nothing, here for consistency
  }

  scheduleAction = ({
    action,
    cronPeriod,
  }: {
    action: () => void
    cronPeriod: string
  }) => {
    cron.schedule(cronPeriod, async () => {
      action()
    })
  }
}
