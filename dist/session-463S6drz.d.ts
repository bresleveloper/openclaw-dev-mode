import { i as MsgContext } from "./templating-Bl_fNKHX.js";
import { r as GroupKeyResolution } from "./types-r7E6AIEo.js";
import { t as InboundLastRouteUpdate } from "./session.types-1YAdKTBx.js";

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