import { a as parseFeishuDirectConversationId, i as parseFeishuConversationId, n as buildFeishuConversationId, o as parseFeishuTargetId } from "../../conversation-id-CBFuWL3u.js";
import { t as collectFeishuSecurityAuditFindings } from "../../security-audit-shared-DhUDIxzk.js";

//#region extensions/feishu/src/message-action-contract.d.ts
declare const messageActionTargetAliases: {
  read: {
    aliases: string[];
  };
  pin: {
    aliases: string[];
  };
  unpin: {
    aliases: string[];
  };
  "list-pins": {
    aliases: string[];
  };
  "channel-info": {
    aliases: string[];
  };
};
//#endregion
export { buildFeishuConversationId, collectFeishuSecurityAuditFindings, messageActionTargetAliases, parseFeishuConversationId, parseFeishuDirectConversationId, parseFeishuTargetId };