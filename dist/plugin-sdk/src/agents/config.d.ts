/**
 * Detect if we're running as a Bun compiled binary.
 * Bun binaries have import.meta.url containing "$bunfs", "~BUN", or "%7EBUN" (Bun's virtual filesystem path)
 */
export declare const isBunBinary: boolean;
/**
 * Get path to built-in themes directory (shipped with package)
 * - For Bun binary: theme/ next to executable
 * - For Node.js (dist/): dist/agents/modes/interactive/theme/
 * - For tsx (src/): src/agents/modes/interactive/theme/
 */
export declare function getThemesDir(): string;
/** Get path to README.md */
export declare function getReadmePath(): string;
/** Get path to docs directory */
export declare function getDocsPath(): string;
/** Get path to examples directory */
export declare function getExamplesPath(): string;
export declare const APP_NAME: string;
export declare const CONFIG_DIR_NAME: string;
export declare const VERSION: string;
/** Get the agent config directory (e.g., ~/.openclaw/agent/) */
export declare function getAgentDir(): string;
/** Get path to user's custom themes directory */
export declare function getCustomThemesDir(): string;
/** Get path to managed binaries directory (fd, rg) */
export declare function getBinDir(): string;
/** Get path to sessions directory */
export declare function getSessionsDir(): string;
