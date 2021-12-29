import { model, Schema } from "mongoose";

interface Verification {
    guildId: string;
    targetUserId: string;
    verifierId: string;
    verifiedOn?: Date;
}

const schema = new Schema<Verification>({
    guildId: { type: String, required: true },
    targetUserId: { type: String, required: true },
    verifierId: { type: String, required: true },
    verifiedOn: Date
});
schema.index({ guildId: 1, targetUserId: 1 }, { unique: true });

export const Verification = model<Verification>('verification', schema, 'verifications');