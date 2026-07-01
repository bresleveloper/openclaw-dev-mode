import type { DoctorOptions } from "../commands/doctor-prompter.js";
import type { RuntimeEnv } from "../runtime.js";
/** Runs the full interactive doctor flow against the provided or default runtime. */
export declare function doctorCommand(runtime?: RuntimeEnv, options?: DoctorOptions): Promise<void>;
