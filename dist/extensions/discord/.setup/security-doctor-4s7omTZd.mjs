import { buildMutableAllowEntryDetector } from "openclaw/plugin-sdk/channel-policy";
// extensions/discord/src/security-doctor.ts
const isDiscordMutableAllowEntry = buildMutableAllowEntryDetector({ stableIdPattern: /^(?:\d+|<@!?\d+>|(?:discord|user|pk):.+)$/ });
export { isDiscordMutableAllowEntry as t };
