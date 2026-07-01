import type { OpenClawConfig } from "../config/types.openclaw.js";
/** List enabled core config flags that intentionally weaken security posture. */
export declare function collectCoreInsecureOrDangerousFlags(cfg: OpenClawConfig): string[];
