import { f as MediaUnderstandingProvider } from "../../types-Cc9pD8mj.js";
import { n as CodexAppServerClient, r as CodexAppServerStartOptions, t as resolveCodexAppServerAuthProfileIdForAgent } from "../../auth-bridge-Bts4HTvA.js";

//#region extensions/codex/src/app-server/shared-client.d.ts
type CodexAppServerClientOptions = {
  startOptions?: CodexAppServerStartOptions;
  timeoutMs?: number;
  authProfileId?: string | null;
  agentDir?: string;
  config?: Parameters<typeof resolveCodexAppServerAuthProfileIdForAgent>[0]["config"];
  onStartedClient?: (client: CodexAppServerClient) => void;
  abandonSignal?: AbortSignal;
};
/** Factory used by attempt startup and side turns to acquire a leased client. */
type CodexAppServerClientFactory = (options?: CodexAppServerClientOptions) => Promise<CodexAppServerClient>;
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