export declare function getToolPath(tool: "fd" | "rg"): string | null;
export declare function ensureTool(tool: "fd" | "rg", silent?: boolean): Promise<string | undefined>;
