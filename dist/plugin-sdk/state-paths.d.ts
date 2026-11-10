import { D as resolveConfigPath, E as STATE_DIR, k as resolveOAuthDir } from "../types-D7I_F5Ux.js";
import { r as resolveStateDir, t as resolveRequiredHomeDir } from "../home-dir-DCmyMZJT.js";
//#region src/plugin-sdk/state-paths.d.ts
/** Keep shared plugin resources on their operator root when runtime state is redirected. */
export declare function resolveManagedResourceStateDir(): string;
//#endregion
export { STATE_DIR, resolveConfigPath, resolveOAuthDir, resolveRequiredHomeDir, resolveStateDir };