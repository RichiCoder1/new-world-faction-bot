import { userMention } from "@discordjs/builders";
import {
  InteractionHandler,
  InteractionHandlerTypes,
  PieceContext,
} from "@sapphire/framework";
import { ButtonInteraction, MessageMentions } from "discord.js";
import { VERIFY_USER_EVENT } from "../listeners/verifyUser";

export default class extends InteractionHandler {
  public constructor(context: PieceContext) {
    super(context, { interactionHandlerType: InteractionHandlerTypes.Button });
  }

  public async parse(interaction: ButtonInteraction) {
    if (interaction.customId !== "verify-user") return this.none();
    return this.some({
      targetUserId: (interaction.message.mentions! as MessageMentions).users.at(
        0
      )!.id,
    });
  }

  public async run(
    interaction: ButtonInteraction,
    { targetUserId }: { targetUserId: string }
  ) {
    interaction.client.emit(VERIFY_USER_EVENT, {
      guildId: interaction.guildId!,
      targetUserId: targetUserId,
      verifierId: interaction.user.id,
    });

    await interaction.update({
      content: `Verified ${userMention(targetUserId)}.`,
      components: [],
    });
  }
}
