import { model, Schema } from "mongoose";

interface GuildSettings {
  _id: string;
  roleId?: string;
}

const schema = new Schema<GuildSettings>({
  _id: String,
  roleId: String,
});

export const GuildSettings = model<GuildSettings>(
  "guildSetting",
  schema,
  "guildSettings"
);
