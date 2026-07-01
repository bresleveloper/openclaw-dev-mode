import { U as ChannelLegacyStateMigrationPlan } from "../../types.core-DDKBE3_n.js";
//#region extensions/whatsapp/src/state-migrations.d.ts
declare function detectWhatsAppLegacyStateMigrations(params: {
  oauthDir: string;
}): ChannelLegacyStateMigrationPlan[];
//#endregion
export { detectWhatsAppLegacyStateMigrations };