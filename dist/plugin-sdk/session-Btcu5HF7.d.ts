import { i as MsgContext } from "./templating-KsALmYhy.js";
import { n as GroupKeyResolution } from "./types-CmP2mjUp.js";
import { t as InboundLastRouteUpdate } from "./session.types-Bu2N2V3L.js";

//#region src/channels/session.d.ts
declare function recordInboundSession(params: {
  storePath: string;
  sessionKey: string;
  ctx: MsgContext;
  groupResolution?: GroupKeyResolution | null;
  createIfMissing?: boolean;
  updateLastRoute?: InboundLastRouteUpdate;
  onRecordError: (err: unknown) => void;
  trackSessionMetaTask?: (task: Promise<unknown>) => void;
}): Promise<void>;
//#endregion
export { recordInboundSession as t };