import { i as OpenClawConfig } from "../../types.openclaw-DlpCUWMr.js";
import { U as ChannelLegacyStateMigrationPlan } from "../../types.core-DDKBE3_n.js";
//#region extensions/telegram/src/state-migrations.d.ts
declare function detectTelegramLegacyStateMigrations(params: {
  cfg: OpenClawConfig;
  env: NodeJS.ProcessEnv;
  stateDir?: string;
}): Promise<ChannelLegacyStateMigrationPlan[]>;
//#endregion
export { detectTelegramLegacyStateMigrations };