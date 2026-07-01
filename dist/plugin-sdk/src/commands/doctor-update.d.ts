import type { RuntimeEnv } from "../runtime.js";
import type { DoctorOptions } from "./doctor-prompter.js";
/** Offers to update OpenClaw before doctor when running interactively from an updatable install. */
export declare function maybeOfferUpdateBeforeDoctor(params: {
    runtime: RuntimeEnv;
    options: DoctorOptions;
    root: string | null;
    confirm: (p: {
        message: string;
        initialValue: boolean;
    }) => Promise<boolean>;
    outro: (message: string) => void;
}): Promise<{
    updated: boolean;
    handled?: undefined;
} | {
    updated: boolean;
    handled: boolean;
}>;
