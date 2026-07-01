import { type PluginSdkDocCategory, type PluginSdkDocEntrypoint } from "../../scripts/lib/plugin-sdk-doc-metadata.ts";
/** Declaration kind recorded for each public SDK export in the API baseline. */
export type PluginSdkApiExportKind = "class" | "const" | "enum" | "function" | "interface" | "namespace" | "type" | "unknown" | "variable";
/** Repo source location for a public SDK declaration or module. */
export type PluginSdkApiSourceLink = {
    /** One-based source line for docs and review links. */
    line: number;
    /** Repo-relative source file path. */
    path: string;
};
/** One named export captured from a public SDK entrypoint. */
export type PluginSdkApiExport = {
    /** Normalized TypeScript declaration text, or null when TypeScript cannot print it. */
    declaration: string | null;
    /** Exported symbol name as plugin authors import it. */
    exportName: string;
    /** Coarse declaration kind used by docs and drift reports. */
    kind: PluginSdkApiExportKind;
    /** Source location for the exported declaration when available. */
    source: PluginSdkApiSourceLink | null;
};
/** API baseline record for one public SDK module/subpath. */
export type PluginSdkApiModule = {
    /** Documentation category used to group SDK entrypoints. */
    category: PluginSdkDocCategory;
    /** Entry point metadata from the SDK docs registry. */
    entrypoint: PluginSdkDocEntrypoint;
    /** Public exports discovered from the TypeScript program. */
    exports: PluginSdkApiExport[];
    /** Package specifier shown to plugin authors. */
    importSpecifier: string;
    /** Repo source for the SDK entrypoint file. */
    source: PluginSdkApiSourceLink;
};
/** Full generated SDK API baseline payload. */
export type PluginSdkApiBaseline = {
    /** Generator identifier used to reject hand-authored baseline files. */
    generatedBy: "scripts/generate-plugin-sdk-api-baseline.ts";
    /** Public SDK modules included in the baseline. */
    modules: PluginSdkApiModule[];
};
/** Rendered baseline variants written to JSON and statefile outputs. */
export type PluginSdkApiBaselineRender = {
    /** Structured baseline data before serialization. */
    baseline: PluginSdkApiBaseline;
    /** Pretty JSON artifact for humans and docs tooling. */
    json: string;
    /** Line-delimited export records used by lightweight contract checks. */
    jsonl: string;
};
/** Result returned when writing SDK API baseline artifacts. */
export type PluginSdkApiBaselineWriteResult = {
    /** True when any generated artifact content differs from disk. */
    changed: boolean;
    /** True when changed artifacts were actually written. */
    wrote: boolean;
    /** JSON baseline artifact path. */
    jsonPath: string;
    /** JSONL statefile artifact path. */
    statefilePath: string;
    /** SHA-256 hash artifact path. */
    hashPath: string;
};
/** Normalize compiler source paths into stable repo-relative or node_modules-relative paths. */
export declare function normalizePluginSdkApiSourcePath(repoRoot: string, filePath: string): string;
/** Strip machine-local absolute paths from declaration text before hashing baseline output. */
export declare function normalizePluginSdkApiDeclarationText(repoRoot: string, value: string): string;
/** Render the current public SDK API baseline without writing generated artifacts. */
export declare function renderPluginSdkApiBaseline(params?: {
    repoRoot?: string;
}): Promise<PluginSdkApiBaselineRender>;
/** Build the sha256 hash file content for plugin SDK API baseline artifacts. */
export declare function computePluginSdkApiBaselineHashFileContent(rendered: PluginSdkApiBaselineRender): string;
/** Write or check SDK API baseline artifacts used by docs and contract tests. */
export declare function writePluginSdkApiBaselineStatefile(params?: {
    repoRoot?: string;
    check?: boolean;
    jsonPath?: string;
    statefilePath?: string;
    hashPath?: string;
}): Promise<PluginSdkApiBaselineWriteResult>;
