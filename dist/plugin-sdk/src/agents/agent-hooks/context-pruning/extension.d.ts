/** Session extension that prunes stale context blocks before model calls. */
import type { ExtensionAPI } from "../../sessions/index.js";
/** Registers the context-pruning hook for sessions with active pruning runtime settings. */
export default function contextPruningExtension(api: ExtensionAPI): void;
