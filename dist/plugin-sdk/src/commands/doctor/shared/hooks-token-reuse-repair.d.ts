import type { OpenClawConfig } from "../../../config/types.openclaw.js";
import type { DoctorConfigMutationResult } from "./config-mutation-state.js";
/** Rotate hooks.token when it matches the active Gateway token/password shared secret. */
export declare function repairHooksTokenReuseGatewayAuth(cfg: OpenClawConfig, env?: NodeJS.ProcessEnv, createToken?: () => string): Promise<DoctorConfigMutationResult>;
