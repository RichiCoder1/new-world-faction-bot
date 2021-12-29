import { model, Schema } from "mongoose";

interface PendingVerification {
    guildId: string;
    targetUserId: string;
}

const schema = new Schema<PendingVerification>({
    guildId: { type: String, required: true },
    targetUserId: { type: String, required: true },
});
schema.index({ guildId: 1, targetUserId: 1 }, { unique: true });

export const PendingVerification = model<PendingVerification>('pendingVerification', schema, 'pendingVerifications');