import { AllowFromListSchema, DmPolicySchema, MarkdownConfigSchema } from "openclaw/plugin-sdk/channel-config-schema";
import { buildSecretInputSchema } from "openclaw/plugin-sdk/secret-input";
import { z } from "zod";
//#region extensions/nostr/src/config-schema.ts
const safeUrlSchema = z.string().url().refine((url) => {
	try {
		return new URL(url).protocol === "https:";
	} catch {
		return false;
	}
}, { message: "URL must use https:// protocol" });
/**
* NIP-01 profile metadata schema
* https://github.com/nostr-protocol/nips/blob/master/01.md
*/
const NostrProfileSchema = z.object({
	name: z.string().max(256).optional(),
	/** NIP-01 display_name. */
	displayName: z.string().max(256).optional(),
	about: z.string().max(2e3).optional(),
	picture: safeUrlSchema.optional(),
	banner: safeUrlSchema.optional(),
	website: safeUrlSchema.optional(),
	/** NIP-05 identifier (e.g., "user@example.com") */
	nip05: z.string().optional(),
	/** Lightning address (LUD-16) */
	lud16: z.string().optional()
});
const NostrConfigSchema = z.object({
	name: z.string().optional(),
	/** Optional default account id for routing/account selection. */
	defaultAccount: z.string().optional(),
	enabled: z.boolean().optional(),
	configWrites: z.boolean().optional(),
	/** Markdown formatting overrides (tables). */
	markdown: MarkdownConfigSchema,
	/** Private key in hex or nsec bech32 format */
	privateKey: buildSecretInputSchema().optional(),
	/** WebSocket relay URLs to connect to */
	relays: z.array(z.string()).optional(),
	dmPolicy: DmPolicySchema.optional(),
	/** Allowed sender pubkeys (npub or hex format) */
	allowFrom: AllowFromListSchema,
	/** Profile metadata (NIP-01 kind:0 content) */
	profile: NostrProfileSchema.optional()
});
//#endregion
export { NostrProfileSchema as n, NostrConfigSchema as t };
