import { buildMutableAllowEntryDetector } from "openclaw/plugin-sdk/channel-policy";
//#region extensions/discord/src/security-doctor.ts
const isDiscordMutableAllowEntry = buildMutableAllowEntryDetector({ stableIdPattern: /^(?:\d+|<@!?\d+>|(?:discord|user|pk):.+)$/ });
//#endregion
export { isDiscordMutableAllowEntry as t };
