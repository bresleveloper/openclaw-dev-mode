import { i as OpenClawConfig } from "../../types.openclaw-B5gtuEn_.js";
import { U as ChannelLegacyStateMigrationPlan } from "../../types.core-TwXPgPau.js";
//#region extensions/telegram/src/state-migrations.d.ts
declare function detectTelegramLegacyStateMigrations(params: {
  cfg: OpenClawConfig;
  env: NodeJS.ProcessEnv;
  stateDir?: string;
}): Promise<ChannelLegacyStateMigrationPlan[]>;
//#endregion
export { detectTelegramLegacyStateMigrations };