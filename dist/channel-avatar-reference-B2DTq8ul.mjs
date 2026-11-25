import{createHash}from"node:crypto";
//!src/shared/channel-avatar-source.ts
function matchesChannelAvatarSenderSource(e,t){return Boolean(t.pluginId&&t.accountId&&t.id&&e?.chatType===`direct`&&e.provider===t.pluginId&&e.accountId===t.accountId&&(e.nativeDirectUserId?e.nativeDirectUserId===t.id:e.from===t.pluginId+`:`+t.id))}
//!src/gateway/channel-avatar-reference.ts
function channelAvatarRevision(e){return createHash(`sha256`).update(e).digest(`base64url`).slice(0,12)}function matchesChannelAvatarSender(e,t){if(!e.has(`sender`))return true;return Boolean(t?.avatar&&matchesChannelAvatarSenderSource(t,{id:e.get(`sender`),pluginId:e.get(`provider`),accountId:e.get(`account`)})&&e.get(`v`)===channelAvatarRevision(t.avatar))}export{matchesChannelAvatarSender as n,channelAvatarRevision as t};