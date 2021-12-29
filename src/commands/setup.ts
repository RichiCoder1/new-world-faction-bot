import { GuildSettings } from "./../models/guildSettings";
import type {
  CommandInteraction,
  GuildMemberRoleManager,
  Role,
} from "discord.js";
import {
  ApplicationCommandRegistry,
  Command,
  RegisterBehavior,
} from "@sapphire/framework";
import { roleMention } from "@discordjs/builders";

export class SetupCommand extends Command {
  public constructor(context: Command.Context) {
    super(context, {
      requiredUserPermissions: ["ADMINISTRATOR"],
      requiredClientPermissions: ["MANAGE_ROLES"],
    });
  }

  public override registerApplicationCommands(
    registry: ApplicationCommandRegistry
  ) {
    registry.registerChatInputCommand(
      (builder) =>
        builder
          .setName("setup-verified-role")
          .setDescription("Setup Faction Verified Role")
          .setDefaultPermission(true)
          .addRoleOption((option) =>
            option
              .setName("role")
              .setDescription(
                "The role that users will be assigned upon verification"
              )
          ),
      {
        behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
      }
    );
  }

  public async chatInputRun(interaction: CommandInteraction) {
    await interaction.deferReply({ ephemeral: true });

    let settings = await GuildSettings.findById(interaction.guildId);
    if (settings == null) {
      settings = new GuildSettings();
      settings._id = interaction.guildId;
    }

    const targetRole = interaction.options.getRole("role", true);
    const highestRole = interaction.guild?.me?.roles.highest!;
    const botRole = interaction.guild!.me!.roles.botRole!;

    if (highestRole.comparePositionTo(targetRole as Role) < 1) {
      await interaction.editReply({
        content: `⚠️ My role ${roleMention(highestRole.id)}${
          highestRole.id !== botRole.id ? ` or ${roleMention(botRole.id)}` : ""
        } must be higher than the role ${roleMention(
          targetRole.id
        )} in order to manage it.`,
      });
      return;
    }

    settings.roleId = targetRole.id;
    await settings.save();

    return interaction.editReply({
      content: `Verified users will be assigned role ${roleMention(
        settings.roleId!
      )}.`,
    });
  }
}
