import type { RuntimeEnv } from "../runtime.js";
/** Parse `--section` input and run the requested configure wizard sections. */
export declare function configureCommandFromSectionsArg(rawSections: unknown, runtime?: RuntimeEnv, options?: {
    interactive?: boolean;
}): Promise<void>;
