import { confirm as clackConfirm, password as clackPassword, select as clackSelect, text as clackText } from "@clack/prompts";
export declare const CONFIGURE_WIZARD_SECTIONS: readonly ["workspace", "model", "web", "gateway", "daemon", "channels", "plugins", "skills", "health"];
export type WizardSection = (typeof CONFIGURE_WIZARD_SECTIONS)[number];
/** Parse repeated `--section` values into known configure wizard sections and invalid entries. */
export declare function parseConfigureWizardSections(raw: unknown): {
    sections: WizardSection[];
    invalid: string[];
};
export type ChannelsWizardMode = "configure" | "remove";
export type ConfigureWizardParams = {
    command: "configure" | "update";
    sections?: WizardSection[];
};
export declare const CONFIGURE_SECTION_OPTIONS: Array<{
    value: WizardSection;
    label: string;
    hint: string;
}>;
/** Styled configure wizard intro wrapper. */
export declare const intro: (message: string) => void;
/** Styled configure wizard outro wrapper. */
export declare const outro: (message: string) => void;
/** Styled text prompt wrapper. */
export declare const text: (params: Parameters<typeof clackText>[0]) => Promise<string | symbol>;
/** Styled password prompt wrapper. Echoes bullets so secrets never appear in cleartext. */
export declare const password: (params: Parameters<typeof clackPassword>[0]) => Promise<string | symbol>;
/** Styled confirm prompt wrapper. */
export declare const confirm: (params: Parameters<typeof clackConfirm>[0]) => Promise<symbol | boolean>;
/** Styled select prompt wrapper that also normalizes option hints. */
export declare const select: <T>(params: Parameters<typeof clackSelect<T>>[0]) => Promise<symbol | T>;
