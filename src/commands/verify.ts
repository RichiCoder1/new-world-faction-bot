import { VERIFY_USER_EVENT } from "./../listeners/verifyUser";
import { userMention } from "@discordjs/builders";
import type { ContextMenuInteraction } from "discord.js";
import { ApplicationCommandRegistry, Command } from "@sapphire/framework";

export class VerifyCommand extends Command {
  public constructor(context: Command.Context) {
    super(context, {
      requiredUserPermissions: ["ADMINISTRATOR"],
      requiredClientPermissions: ["MANAGE_ROLES"],
    });
  }

  public override registerApplicationCommands(
    registry: ApplicationCommandRegistry
  ) {
    registry.registerContextMenuCommand({
      type: "USER",
      name: "FC: Verify",
      defaultPermission: true,
    });
  }

  public async contextMenuRun(interaction: ContextMenuInteraction) {
    interaction.client.emit(VERIFY_USER_EVENT, {
      guildId: interaction.guildId!,
      targetUserId: interaction.targetId,
      verifierId: interaction.user.id,
    });
    await interaction.reply({
      ephemeral: true,
      content: `Verified user ${userMention(interaction.targetId)}.`,
    });
  }
}
