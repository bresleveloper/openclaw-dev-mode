import { uniqueStrings } from "openclaw/plugin-sdk/string-coerce-runtime";
import { hasConfiguredSecretInput, normalizeSecretInputString } from "openclaw/plugin-sdk/secret-input";
import { decode } from "nostr-tools/nip19";
import { DEFAULT_ACCOUNT_ID } from "openclaw/plugin-sdk/routing";
import { createSetupTranslator, createStandardChannelSetupStatus, patchTopLevelChannelConfigSection, splitSetupEntries } from "openclaw/plugin-sdk/setup";
import { defineChannelSetupContract } from "openclaw/plugin-sdk/channel-setup";
//#region extensions/nostr/src/default-relays.ts
const DEFAULT_RELAYS = ["wss://relay.damus.io", "wss://nos.lol"];
//#endregion
//#region extensions/nostr/src/private-key.ts
const NOSTR_PRIVATE_KEY_ENV_VAR = "NOSTR_PRIVATE_KEY";
const SECP256K1_ORDER = BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141");
/** Validate and normalize a private key (hex or NIP-19 nsec). */
function validatePrivateKey(key) {
	const trimmed = key.trim();
	let bytes;
	if (trimmed.startsWith("nsec1") || trimmed.startsWith("NSEC1")) {
		let decoded;
		try {
			decoded = decode(trimmed);
		} catch {
			throw new Error("Invalid nsec private key");
		}
		if (decoded.type !== "nsec") throw new Error("Invalid nsec key type");
		bytes = decoded.data;
	} else {
		if (!/^[0-9a-fA-F]{64}$/.test(trimmed)) throw new Error("Private key must be 64 hex characters or nsec bech32 format");
		bytes = Uint8Array.from({ length: 32 }, (_, index) => Number.parseInt(trimmed.slice(index * 2, index * 2 + 2), 16));
	}
	if (bytes.length !== 32) throw new Error("Private key must decode to 32 bytes");
	const scalar = Array.from(bytes).reduce((value, byte) => value << 8n | BigInt(byte), 0n);
	if (scalar === 0n || scalar >= SECP256K1_ORDER) throw new Error("Private key scalar is out of range");
	return bytes;
}
function hasConfiguredNostrPrivateKey(value) {
	return hasConfiguredSecretInput(value) || Boolean(process.env["NOSTR_PRIVATE_KEY"]?.trim());
}
function resolveNostrPrivateKey(value) {
	const configured = normalizeSecretInputString(value);
	if (configured || hasConfiguredSecretInput(value)) return configured ?? "";
	return process.env["NOSTR_PRIVATE_KEY"]?.trim() ?? "";
}
//#endregion
//#region extensions/nostr/src/setup-adapter.ts
const channel = "nostr";
function buildNostrSetupPatch(accountId, patch) {
	return {
		...accountId !== DEFAULT_ACCOUNT_ID ? { defaultAccount: accountId } : {},
		...patch
	};
}
function parseRelayUrls(raw) {
	const relays = [];
	for (const entry of splitSetupEntries(raw)) {
		try {
			const parsed = new URL(entry);
			if (parsed.protocol !== "ws:" && parsed.protocol !== "wss:") return {
				relays: [],
				error: `Relay must use ws:// or wss:// (${entry})`
			};
		} catch {
			return {
				relays: [],
				error: `Invalid relay URL: ${entry}`
			};
		}
		relays.push(entry);
	}
	return { relays: uniqueStrings(relays) };
}
function createNostrSetupAdapter(params) {
	return {
		resolveAccountId: ({ cfg, accountId }) => params.resolveAccountId(cfg, accountId),
		applyAccountName: ({ cfg, accountId, name }) => patchTopLevelChannelConfigSection({
			cfg,
			channel,
			patch: buildNostrSetupPatch(accountId, name?.trim() ? { name: name.trim() } : {})
		}),
		validateInput: ({ input }) => {
			if (!input.useEnv) {
				const privateKey = input.privateKey?.trim();
				if (!privateKey) return "Nostr requires --private-key or --use-env.";
				try {
					validatePrivateKey(privateKey);
				} catch {
					return "Nostr private key must be valid nsec or 64-character hex.";
				}
			}
			if (input.relayUrls?.trim()) return parseRelayUrls(input.relayUrls).error ?? null;
			return null;
		},
		applyAccountConfig: ({ cfg, accountId, input }) => {
			const relayResult = input.relayUrls?.trim() ? parseRelayUrls(input.relayUrls) : { relays: [] };
			return patchTopLevelChannelConfigSection({
				cfg,
				channel,
				enabled: true,
				clearFields: input.useEnv ? ["privateKey"] : void 0,
				patch: buildNostrSetupPatch(accountId, {
					...input.useEnv ? {} : { privateKey: input.privateKey?.trim() },
					...relayResult.relays.length > 0 ? { relays: relayResult.relays } : {}
				})
			});
		}
	};
}
function createNostrSetupContract(adapter) {
	return defineChannelSetupContract({
		fields: {
			privateKey: {
				kind: "string",
				sensitive: true,
				cli: {
					flags: "--private-key <key>",
					description: "Nostr private key"
				}
			},
			relayUrls: {
				kind: "string",
				cli: {
					flags: "--relay-urls <urls>",
					description: "Nostr relay URLs"
				}
			},
			useEnv: {
				kind: "boolean",
				cli: {
					flags: "--use-env",
					description: "Use NOSTR_PRIVATE_KEY"
				},
				envVars: [NOSTR_PRIVATE_KEY_ENV_VAR]
			}
		},
		adapter
	});
}
function createNostrSetupStatus(resolveAccount) {
	const t = createSetupTranslator();
	return createStandardChannelSetupStatus({
		channelLabel: "Nostr",
		configuredLabel: t("wizard.channels.statusConfigured"),
		unconfiguredLabel: t("wizard.channels.statusNeedsPrivateKey"),
		configuredHint: t("wizard.channels.statusConfigured"),
		unconfiguredHint: t("wizard.channels.statusNeedsPrivateKey"),
		configuredScore: 1,
		unconfiguredScore: 0,
		includeStatusLine: true,
		resolveConfigured: ({ cfg, accountId }) => resolveAccount({
			cfg,
			accountId
		}).configured,
		resolveExtraStatusLines: ({ cfg }) => {
			return [`Relays: ${resolveAccount({ cfg }).relays.length || DEFAULT_RELAYS.length}`];
		}
	});
}
//#endregion
export { parseRelayUrls as a, validatePrivateKey as c, createNostrSetupStatus as i, DEFAULT_RELAYS as l, createNostrSetupAdapter as n, hasConfiguredNostrPrivateKey as o, createNostrSetupContract as r, resolveNostrPrivateKey as s, buildNostrSetupPatch as t };
