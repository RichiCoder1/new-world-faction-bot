import { ApplicationCommandRegistries, Listener } from "@sapphire/framework";
import { ApplicationCommand, Permissions } from "discord.js";

export class ReadyListener extends Listener {
    public constructor(context: Listener.Context, options: Listener.Options) {
      super(context, {
        ...options,
        once: true,
        event: 'ready'
      });
    }

    public async run(): Promise<void> {
      const { FLAGS } = Permissions;
      const permissions = new Permissions(FLAGS.MANAGE_ROLES | FLAGS.CREATE_PUBLIC_THREADS | FLAGS.MANAGE_EMOJIS_AND_STICKERS
          | FLAGS.START_EMBEDDED_ACTIVITIES | FLAGS.MANAGE_MESSAGES);
      
      this.container.logger.info(`Install Link: https://discord.com/api/oauth2/authorize?client_id=${this.container.client!.application!.id}&permissions=${permissions.toJSON()}&scope=applications.commands%20bot`);

      const commands = await this.container.client.application?.commands.fetch()!;
      const queueDeletion: [ApplicationCommand, string][] = [];

      for (const [_, liveCommand] of commands) {
        let found = false;
        for (const [_, registeredCommand] of ApplicationCommandRegistries.registries) {
          const { chatInputCommands, contextMenuCommands } = registeredCommand;
          
          if (chatInputCommands.has(liveCommand.name)) {
            found = true;
            break;
          }

          if (contextMenuCommands.has(liveCommand.name)) {
            found = true;
            break;
          }
        }
        if (!found) {
          queueDeletion.push([liveCommand, liveCommand.name]);
        }
      }

      for (const [command, name] of queueDeletion) {
        this.container.logger.warn(`Removing command: ${name}`);
        await this.container.client.application!.commands.delete(command);
      }
    }
}