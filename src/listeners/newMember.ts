import { Listener } from "@sapphire/framework";

export class NewMemberListener extends Listener {
    public constructor(context: Listener.Context, options: Listener.Options) {
      super(context, {
        ...options,
        emitter: 'ws',
        event: 'GUILD_MEMBER_ADD'
      });
    }

    public async run(...args: unknown[]): Promise<void> {
        console.log('New Member', ...args);
    }
}