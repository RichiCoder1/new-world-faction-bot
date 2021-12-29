import { userMention } from '@discordjs/builders';
import { Verification } from './../models/verification';
import type { ContextMenuInteraction } from "discord.js";
import {
  ApplicationCommandRegistry,
  Command,
} from "@sapphire/framework";
import { GuildSettings } from '../models/guildSettings';

export class VerifyCommand extends Command {
  public override registerApplicationCommands(
    registry: ApplicationCommandRegistry
  ) {
    registry.registerContextMenuCommand({
      type: "USER",
      name: "FC: Unverify",
      defaultPermission: true,
    });
  }

  public async contextMenuRun(interaction: ContextMenuInteraction) {
    await interaction.deferReply({ ephemeral: true });

    const { guildId, targetId } = interaction;

    const verification = await Verification.findOne({ guildId: guildId, targetUserId: targetId });
    if (verification) {
      await verification.delete();

      const guildSettings = await GuildSettings.findById(guildId);
      if (guildSettings?.roleId) {
          const guild = await this.container.client.guilds.fetch(guildId!);
          const verifiedRole = await guild.roles.fetch(guildSettings.roleId);
          const target = await guild.members.fetch(targetId);

          await target.roles.remove(verifiedRole!);
      }
  
      await interaction.editReply({ content: `${userMention(interaction.targetId)} has been unverified.`})
    } else {
      await interaction.editReply({ content: `${userMention(interaction.targetId)} is not verified.`});
    }

  }
}
