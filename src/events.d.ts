import { VerifyUserEvent, VERIFY_USER_EVENT } from './listeners/verifyUser';

declare module 'discord.js' {
    interface ClientEvents {
        [VERIFY_USER_EVENT]: [VerifyUserEvent]
    }
}