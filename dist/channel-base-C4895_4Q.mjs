import { Fn as object, Jn as string, Lt as boolean, Nt as array, Pn as number, Un as record } from "./schemas-BOYIvvln.mjs";
import { n as normalizeAccountId, t as DEFAULT_ACCOUNT_ID } from "./account-id-B1bfbA5J.mjs";
import { t as defineChannelSetupContract } from "./setup-contract-6y0bhIm8.mjs";
import { i as buildChannelConfigSchema } from "./config-schema-BJ55TtqJ.mjs";
import { x as patchTopLevelChannelConfigSection } from "./setup-wizard-helpers-DT-haSuo.mjs";
import "./setup-CQOexhh9.mjs";
import "./channel-setup-CW9TWpwx.mjs";
import "./channel-config-schema-DMmqacmO.mjs";
//#region extensions/a2a/src/accounts.ts
function listA2aChannelAccountIds(cfg) {
	return cfg.channels?.a2a ? [DEFAULT_ACCOUNT_ID] : [];
}
function resolveDefaultA2aChannelAccountId() {
	return DEFAULT_ACCOUNT_ID;
}
function resolveA2aChannelAccount(params) {
	const config = params.cfg.channels?.a2a ?? {};
	return {
		accountId: normalizeAccountId(params.accountId),
		enabled: config.enabled !== false,
		configured: Object.keys(config.peers ?? {}).length > 0,
		config
	};
}
//#endregion
//#region extensions/a2a/src/config-schema.ts
const a2aPeerNamePattern = /^[a-z0-9][a-z0-9._-]{0,63}$/;
const a2aHttpUrlSchema = string().url().and(string().regex(/^https?:\/\//, "A2A URLs must use HTTP or HTTPS"));
const a2aPeerConfigSchema = object({
	token: string().min(1),
	url: a2aHttpUrlSchema.optional(),
	outboundToken: string().min(1).optional()
}).strict();
const a2aChannelConfigSchema = object({
	enabled: boolean().optional(),
	configWrites: boolean().optional(),
	advertisedUrl: a2aHttpUrlSchema.optional(),
	replyTimeoutMs: number().int().min(5e3).max(6e5).optional(),
	rateLimitPerMinute: number().int().min(0).optional(),
	exposeAgents: array(string()).optional(),
	peers: record(string().regex(a2aPeerNamePattern), a2aPeerConfigSchema).optional()
}).strict();
const a2aPluginConfigSchema = buildChannelConfigSchema(a2aChannelConfigSchema, { uiHints: {
	advertisedUrl: {
		label: "Advertised Gateway URL",
		help: "Public Gateway origin included in the A2A agent card."
	},
	replyTimeoutMs: {
		label: "Blocking Reply Timeout (ms)",
		advanced: true
	},
	rateLimitPerMinute: {
		label: "Requests Per Peer Per Minute",
		advanced: true
	},
	exposeAgents: { label: "Exposed Agent IDs" },
	"peers.*.token": {
		label: "Inbound Bearer Token",
		sensitive: true
	},
	"peers.*.outboundToken": {
		label: "Outbound Bearer Token",
		sensitive: true
	}
} });
const a2aChannelRuntimeMeta = {
	id: "a2a",
	label: "A2A",
	selectionLabel: "A2A (Agent-to-Agent Protocol)",
	docsPath: "/channels/a2a",
	docsLabel: "a2a",
	blurb: "Connect external agents through the A2A v1.0 protocol.",
	order: 75
};
function createA2aChannelPluginBase() {
	return {
		id: "a2a",
		meta: a2aChannelRuntimeMeta,
		capabilities: { chatTypes: ["direct"] },
		reload: { configPrefixes: ["channels.a2a"] },
		configSchema: a2aPluginConfigSchema,
		setupContract: defineChannelSetupContract({
			fields: {
				advertisedUrl: {
					kind: "string",
					cli: {
						flags: "--advertised-url <url>",
						description: "Public Gateway origin published in the A2A agent card"
					}
				},
				peerName: {
					kind: "string",
					cli: {
						flags: "--peer-name <name>",
						description: "A2A peer identifier to authorize"
					}
				},
				peerToken: {
					kind: "string",
					sensitive: true,
					cli: {
						flags: "--peer-token <token>",
						description: "Bearer token for the A2A peer"
					}
				}
			},
			adapter: { applyAccountConfig: ({ cfg, input }) => {
				const setup = input;
				const current = resolveA2aChannelAccount({ cfg }).config;
				const peerName = setup.peerName?.trim();
				const peerToken = setup.peerToken?.trim();
				const advertisedUrl = setup.advertisedUrl?.trim();
				return patchTopLevelChannelConfigSection({
					cfg,
					channel: "a2a",
					enabled: true,
					patch: {
						...advertisedUrl ? { advertisedUrl } : {},
						...peerName && peerToken ? { peers: {
							...current.peers,
							[peerName]: { token: peerToken }
						} } : {}
					}
				});
			} }
		}),
		config: {
			listAccountIds: listA2aChannelAccountIds,
			resolveAccount: (cfg, accountId) => resolveA2aChannelAccount({
				cfg,
				accountId
			}),
			defaultAccountId: resolveDefaultA2aChannelAccountId,
			isConfigured: (account) => account.configured,
			isEnabled: (account) => account.enabled,
			resolveAllowFrom: ({ cfg, accountId }) => Object.keys(resolveA2aChannelAccount({
				cfg,
				accountId
			}).config.peers ?? {})
		}
	};
}
//#endregion
export { resolveDefaultA2aChannelAccountId as i, listA2aChannelAccountIds as n, resolveA2aChannelAccount as r, createA2aChannelPluginBase as t };
