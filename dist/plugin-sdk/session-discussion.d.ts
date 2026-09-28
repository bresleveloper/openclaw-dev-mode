import { Mu as SessionDiscussionProvider, Nu as SessionDiscussionState, ju as SessionDiscussionInfo } from "../agent-harness-runtime-CWL0fcg5.js";
//#region packages/session-url-contract/src/index.d.ts
type ControlUiSessionNamespace = "chat" | "dashboard";
type BuildControlUiSessionPathParams = {
  namespace: ControlUiSessionNamespace;
  sessionKey: string;
  fallbackAgentId?: string;
  basePath?: string;
  displayName?: string;
  exactKey?: boolean;
  mainKey?: string;
  shortIdLength?: number;
};
export declare function buildControlUiSessionPath(params: BuildControlUiSessionPathParams): string | null;
//#endregion
//#region src/plugins/session-discussion-registry.d.ts
export declare function registerSessionDiscussionProvider(provider: SessionDiscussionProvider): void;
//#endregion
export type { SessionDiscussionInfo, SessionDiscussionProvider, SessionDiscussionState };