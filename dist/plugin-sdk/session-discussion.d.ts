import { C as SessionDiscussionProvider } from "../registry-contribution-types-2o1L1H_Q.js";
import { n as SessionDiscussionState, t as SessionDiscussionInfo } from "../session-discussion-CE9W2c7K.js";
type ControlUiSessionNamespace = "chat" | "dashboard";
export declare function buildControlUiSessionPath(params: {
  namespace: ControlUiSessionNamespace;
  sessionKey: string;
  fallbackAgentId?: string;
  basePath?: string;
  displayName?: string;
  exactKey?: boolean;
  mainKey?: string;
  shortIdLength?: number;
}): string | null;
export declare function registerSessionDiscussionProvider(provider: SessionDiscussionProvider): void;
export type { SessionDiscussionInfo, SessionDiscussionProvider, SessionDiscussionState };