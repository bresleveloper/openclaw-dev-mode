import type { OpenClawConfig, GatewayAuthConfig } from "../config/config.js";
import { type SecretInput } from "../config/types.secrets.js";
import type { RuntimeEnv } from "../runtime.js";
import type { WizardPrompter } from "../wizard/prompts.js";
type GatewayAuthChoice = "token" | "password" | "trusted-proxy";
/** Build gateway auth config, preserving Tailscale allowance and generating missing tokens. */
export declare function buildGatewayAuthConfig(params: {
    existing?: GatewayAuthConfig;
    mode: GatewayAuthChoice;
    token?: SecretInput;
    password?: string;
    trustedProxy?: {
        userHeader: string;
        requiredHeaders?: string[];
        allowUsers?: string[];
    };
}): GatewayAuthConfig | undefined;
/** Prompt for model provider credentials and default model allowlist settings. */
export declare function promptAuthConfig(cfg: OpenClawConfig, runtime: RuntimeEnv, prompter: WizardPrompter): Promise<OpenClawConfig>;
export {};
