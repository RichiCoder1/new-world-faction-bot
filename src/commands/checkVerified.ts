import { TEST_GUILDS } from './../constants';
import { Verification } from './../models/verification';
import { ContextMenuInteraction, MessageActionRow, MessageButton } from "discord.js";
import {
  ApplicationCommandRegistry,
  Command,
} from "@sapphire/framework";
import { time, userMention } from '@discordjs/builders';

export class VerifyCommand extends Command {
  public override registerApplicationCommands(
    registry: ApplicationCommandRegistry
  ) {
    registry.registerContextMenuCommand({
      type: "USER",
      name: "FC: Check Verification",
      defaultPermission: false
    }, { guildIds: TEST_GUILDS });
  }

  public async contextMenuRun(interaction: ContextMenuInteraction) {
    if (interaction.isButton()) {
      console.log("uwu")
      return;
    }

    const verificationRecord = await Verification.findOne({ targetUserId: interaction.targetId, guildId: interaction.guildId });
    
    const targetUser = await interaction.client.users.fetch(interaction.targetId);
    if (verificationRecord == null) {
      const verify = new MessageActionRow()
        .addComponents(
          new MessageButton()
            .setCustomId('verify-user')
            .setLabel('Verify Member')
            .setStyle('SECONDARY')
        );
      
      await interaction.reply({ ephemeral: true, content: `The user ${userMention(targetUser.id)} is not verified.`, components: [verify] });
    } else {
      const verifier = await interaction.client.users.fetch(verificationRecord.verifierId);
      await interaction.reply({ ephemeral: true, content: `The user ${userMention(targetUser.id)} is verified. They were verified on ${time(verificationRecord.verifiedOn!)} by ${userMention(verifier.id)}.`});
    }
  }
}
