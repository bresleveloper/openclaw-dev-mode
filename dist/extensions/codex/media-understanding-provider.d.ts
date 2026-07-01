import { f as MediaUnderstandingProvider } from "../../types-D-xgL_hR.js";
import { n as CodexAppServerClient, r as CodexAppServerStartOptions, t as resolveCodexAppServerAuthProfileIdForAgent } from "../../auth-bridge-CMdTZ1UV.js";

//#region extensions/codex/src/app-server/client-factory.d.ts
type AuthProfileOrderConfig = Parameters<typeof resolveCodexAppServerAuthProfileIdForAgent>[0]["config"];
/** Factory signature used by Codex attempt startup to acquire a client. */
type CodexAppServerClientFactory = (startOptions?: CodexAppServerStartOptions, authProfileId?: string, agentDir?: string, config?: AuthProfileOrderConfig, options?: {
  onStartedClient?: (client: CodexAppServerClient) => void;
  abandonSignal?: AbortSignal;
  timeoutMs?: number;
}) => Promise<CodexAppServerClient>;
//#endregion
//#region extensions/codex/src/app-server/bounded-turn.d.ts
type CodexBoundedTurnOptions = {
  pluginConfig?: unknown;
  clientFactory?: CodexAppServerClientFactory;
};
//#endregion
//#region extensions/codex/media-understanding-provider.d.ts
type CodexMediaUnderstandingProviderOptions = CodexBoundedTurnOptions;
/**
 * Builds the media-understanding provider that delegates image tasks to an
 * isolated Codex app-server session.
 */
declare function buildCodexMediaUnderstandingProvider(options?: CodexMediaUnderstandingProviderOptions): MediaUnderstandingProvider;
//#endregion
export { CodexMediaUnderstandingProviderOptions, buildCodexMediaUnderstandingProvider };