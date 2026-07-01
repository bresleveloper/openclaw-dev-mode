/** Normalizes comma-delimited or loose array metadata fields into string lists. */
export declare function normalizeStringList(input: unknown): string[];
/** Reads a frontmatter field only when it is represented as a string value. */
export declare function getFrontmatterString(frontmatter: Record<string, unknown>, key: string): string | undefined;
/** Parses boolean frontmatter strings while preserving the caller's default for missing values. */
export declare function parseFrontmatterBool(value: string | undefined, fallback: boolean): boolean;
/** Parses the JSON5 OpenClaw manifest block embedded inside a string frontmatter field. */
export declare function resolveOpenClawManifestBlock(params: {
    frontmatter: Record<string, unknown>;
    key?: string;
}): Record<string, unknown> | undefined;
export type OpenClawManifestRequires = {
    /** All binaries that must be available. */
    bins: string[];
    /** Alternative binaries where any one match is enough. */
    anyBins: string[];
    /** Environment variables required by the entry. */
    env: string[];
    /** Config paths required by the entry. */
    config: string[];
};
/** Extracts normalized runtime requirement lists from an OpenClaw manifest block. */
export declare function resolveOpenClawManifestRequires(metadataObj: Record<string, unknown>): OpenClawManifestRequires | undefined;
/** Parses manifest install entries with a caller-owned parser and drops unsupported specs. */
export declare function resolveOpenClawManifestInstall<T>(metadataObj: Record<string, unknown>, parseInstallSpec: (input: unknown) => T | undefined): T[];
/** Extracts normalized OS allowlist entries from an OpenClaw manifest block. */
export declare function resolveOpenClawManifestOs(metadataObj: Record<string, unknown>): string[];
export type ParsedOpenClawManifestInstallBase = {
    /** Original install entry for caller-specific parsing. */
    raw: Record<string, unknown>;
    /** Normalized install kind accepted by the caller. */
    kind: string;
    /** Optional stable package/tool id from the manifest entry. */
    id?: string;
    /** Optional human-facing package/tool label. */
    label?: string;
    /** Optional binaries expected after installation. */
    bins?: string[];
};
/** Parses kind/type plus common install fields shared by package-manager install specs. */
export declare function parseOpenClawManifestInstallBase(input: unknown, allowedKinds: readonly string[]): ParsedOpenClawManifestInstallBase | undefined;
/** Copies optional common install fields onto a caller-specific install spec object. */
export declare function applyOpenClawManifestInstallCommonFields<T extends {
    id?: string;
    label?: string;
    bins?: string[];
}>(spec: T, parsed: Pick<ParsedOpenClawManifestInstallBase, "id" | "label" | "bins">): T;
