import type { RuntimeEnv } from "../runtime.js";
import type { ConfigureWizardParams } from "./configure.shared.js";
/** Run the configure/update wizard, optionally limited to selected sections. */
export declare function runConfigureWizard(opts: ConfigureWizardParams, runtime?: RuntimeEnv): Promise<void>;
