import { GuildSettings } from './../models/guildSettings';
import { Listener } from "@sapphire/framework";
import { Verification } from "../models/verification";

export interface VerifyUserEvent {
    guildId: string, targetUserId: string, verifierId: string
}

export const VERIFY_USER_EVENT = 'VERIFY_USER' as const;

export class NewMemberListener extends Listener {
    public constructor(context: Listener.Context, options: Listener.Options) {
      super(context, {
        ...options,
        event: VERIFY_USER_EVENT
      });
    }

    public async run({ guildId, targetUserId, verifierId }: VerifyUserEvent): Promise<void> {
        const verified = new Verification({
          guildId,
          targetUserId,
          verifierId,
          verifiedOn: new Date()
        });
    
        await verified.save();

        const guildSettings = await GuildSettings.findById(guildId);
        if (guildSettings?.roleId) {
            const guild = await this.container.client.guilds.fetch(guildId);
            const verifiedRole = await guild.roles.fetch(guildSettings.roleId);
            const target = await guild.members.fetch(targetUserId);

            await target.roles.add(verifiedRole!);
        }
    }
}