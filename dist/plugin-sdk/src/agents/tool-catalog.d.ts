/** Built-in tool profile ids exposed in config and UI. */
export type ToolProfileId = "minimal" | "coding" | "messaging" | "full";
/** Allow/deny policy generated from a built-in tool profile. */
type ToolProfilePolicy = {
    allow?: string[];
    deny?: string[];
};
type CoreToolSection = {
    id: string;
    label: string;
    tools: Array<{
        id: string;
        label: string;
        description: string;
    }>;
};
/** Built-in core tool groups keyed by group id. */
export declare const CORE_TOOL_GROUPS: {
    "group:openclaw": string[];
};
/** Profile options shown in model/tool configuration UIs. */
export declare const PROFILE_OPTIONS: readonly [{
    readonly id: "minimal";
    readonly label: "Minimal";
}, {
    readonly id: "coding";
    readonly label: "Coding";
}, {
    readonly id: "messaging";
    readonly label: "Messaging";
}, {
    readonly id: "full";
    readonly label: "Full";
}];
/** Resolves the allow/deny policy for a built-in tool profile. */
export declare function resolveCoreToolProfilePolicy(profile?: string): ToolProfilePolicy | undefined;
/** Lists core tools grouped into UI sections. */
export declare function listCoreToolSections(): CoreToolSection[];
/** Lists built-in profile ids that include a core tool. */
export declare function resolveCoreToolProfiles(toolId: string): ToolProfileId[];
/** Returns true when a tool id is a known core tool. */
export declare function isKnownCoreToolId(toolId: string): boolean;
export {};
