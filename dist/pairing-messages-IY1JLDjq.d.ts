import { n as ChannelRouteRef } from "./delivery-context.types-DgfLEW3H.js";
import { dt as MsgContext, w as GroupKeyResolution } from "./reply-payload-DazZPys5.js";
import { t as PairingChannel } from "./pairing-store.types-D3p0FhGO.js";
//#region src/channels/session.types.d.ts
type InboundLastRouteUpdate = {
  sessionKey: string;
  channel: string;
  to: string;
  accountId?: string;
  threadId?: string | number;
  route?: ChannelRouteRef;
  mainDmOwnerPin?: {
    ownerRecipient: string;
    senderRecipient: string;
    onSkip?: (params: {
      ownerRecipient: string;
      senderRecipient: string;
    }) => void;
  };
};
/** Function contract for recording inbound channel session state. */
type RecordInboundSession = (params: {
  storePath: string;
  sessionKey: string;
  ctx: MsgContext;
  groupResolution?: GroupKeyResolution | null;
  createIfMissing?: boolean;
  updateLastRoute?: InboundLastRouteUpdate;
  onRecordError: (err: unknown) => void | Promise<void>;
  trackSessionMetaTask?: (task: Promise<unknown>) => void;
}) => Promise<void>;
//#endregion
//#region src/pairing/pairing-messages.d.ts
declare function buildPairingReply(params: {
  channel: PairingChannel;
  idLine: string;
  code: string;
}): string;
//#endregion
export { InboundLastRouteUpdate as n, RecordInboundSession as r, buildPairingReply as t };