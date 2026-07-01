/** Top-level doctor command wrapper, including post-upgrade probe mode. */
import { type RuntimeEnv } from "../runtime.js";
import type { DoctorOptions } from "./doctor-prompter.js";
/** Runs doctor or the post-upgrade probe submode using the provided runtime. */
export declare function doctorCommand(runtime?: RuntimeEnv, options?: DoctorOptions): Promise<void>;
