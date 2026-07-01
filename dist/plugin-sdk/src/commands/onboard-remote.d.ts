/**
 * Interactive remote gateway onboarding.
 *
 * It can discover gateways, validate remote WebSocket security, and store
 * remote token/password auth as plaintext or secret references.
 */
import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { WizardPrompter } from "../wizard/prompts.js";
import type { SecretInputMode } from "./onboard-types.js";
/** Prompts for remote gateway connection and auth settings. */
export declare function promptRemoteGatewayConfig(cfg: OpenClawConfig, prompter: WizardPrompter, options?: {
    secretInputMode?: SecretInputMode;
}): Promise<OpenClawConfig>;
