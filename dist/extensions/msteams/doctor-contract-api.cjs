Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require_rolldown_runtime = require("./.setup/rolldown-runtime-VH7oDXx4.cjs");
const require_delegated_state = require("./.setup/delegated-state-u-ywZyZT.cjs");
const require_polls = require("./.setup/polls-BJ4-4uZm.cjs");
const require_sso_token_store = require("./.setup/sso-token-store-YYLHXgFH.cjs");
let openclaw_plugin_sdk_string_coerce_runtime = require("openclaw/plugin-sdk/string-coerce-runtime");
let node_crypto = require("node:crypto");
node_crypto = require_rolldown_runtime.__toESM(node_crypto, 1);
let node_fs_promises = require("node:fs/promises");
node_fs_promises = require_rolldown_runtime.__toESM(node_fs_promises, 1);
let node_path = require("node:path");
node_path = require_rolldown_runtime.__toESM(node_path, 1);
let openclaw_plugin_sdk_runtime_doctor_migrations = require("openclaw/plugin-sdk/runtime-doctor-migrations");
let openclaw_plugin_sdk_session_store_paths = require("openclaw/plugin-sdk/session-store-paths");
//#region extensions/msteams/config-doctor-api.ts
const streamingAliasMigration = (0, openclaw_plugin_sdk_runtime_doctor_migrations.defineChannelAliasMigration)({
	channelId: "msteams",
	streaming: { defaultMode: "partial" }
});
const legacyConfigRules = streamingAliasMigration.legacyConfigRules;
function normalizeCompatibilityConfig({ cfg }) {
	return streamingAliasMigration.normalizeChannelConfig({ cfg });
}
//#endregion
//#region extensions/msteams/doctor-contract-api.ts
const LEARNINGS_NAMESPACE = "feedback-learnings";
const MAX_LEARNING_ENTRIES = 1e4;
const MSTEAMS_PLUGIN_ID = "Microsoft Teams";
function encodeSessionKey(sessionKey) {
	return Buffer.from(sessionKey, "utf8").toString("base64url");
}
function learningStoreKey(storePath, sessionKey) {
	return node_crypto.default.createHash("sha256").update(`${storePath}\0${sessionKey}`, "utf8").digest("hex");
}
function decodeSessionKey(fileStem) {
	try {
		const decoded = Buffer.from(fileStem, "base64url").toString("utf8");
		return encodeSessionKey(decoded) === fileStem && decoded.trim() ? decoded : null;
	} catch {
		return null;
	}
}
function resolveLearningSessionKey(fileStem) {
	return decodeSessionKey(fileStem);
}
function legacySanitizeSessionKey(sessionKey) {
	return sessionKey.replace(/[^a-zA-Z0-9_-]/g, "_");
}
async function listKnownSessionKeys(storePath) {
	const candidates = [storePath, node_path.default.join(storePath, "sessions.json")];
	for (const candidate of candidates) try {
		const parsed = JSON.parse(await node_fs_promises.default.readFile(candidate, "utf8"));
		if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) continue;
		const sessions = parsed.sessions && typeof parsed.sessions === "object" && !Array.isArray(parsed.sessions) ? parsed.sessions : parsed;
		return Object.keys(sessions).filter((key) => key.trim());
	} catch {}
	return [];
}
function resolveLegacySanitizedSessionKey(fileStem, knownSessionKeys) {
	const matches = knownSessionKeys.filter((sessionKey) => legacySanitizeSessionKey(sessionKey) === fileStem);
	const [match] = matches;
	return matches.length === 1 && match ? match : null;
}
function listAgentIds(config) {
	const ids = /* @__PURE__ */ new Set(["main"]);
	if ((0, openclaw_plugin_sdk_string_coerce_runtime.isRecord)(config.agents?.entries)) {
		for (const agentId of Object.keys(config.agents.entries)) if (agentId.trim()) ids.add(agentId.trim());
	}
	for (const agent of config.agents?.list ?? []) if (typeof agent.id === "string" && agent.id.trim()) ids.add(agent.id.trim());
	return [...ids];
}
function listCandidateStorePaths(params) {
	const paths = /* @__PURE__ */ new Set();
	for (const agentId of listAgentIds(params.config)) paths.add((0, openclaw_plugin_sdk_session_store_paths.resolveStorePath)(params.config.session?.store, {
		agentId,
		env: params.env
	}));
	return [...paths];
}
function resolveStateFilePath(stateDir, filename) {
	return node_path.default.join(stateDir, filename);
}
async function readLegacyJsonFile(filePath, parse) {
	try {
		return parse(JSON.parse(await node_fs_promises.default.readFile(filePath, "utf8")));
	} catch {
		return null;
	}
}
function isStringArray(value) {
	return Array.isArray(value) && value.every((entry) => typeof entry === "string");
}
function parseLegacyConversationStore(value) {
	if (!(0, openclaw_plugin_sdk_string_coerce_runtime.isRecord)(value) || value.version !== 1 || !(0, openclaw_plugin_sdk_string_coerce_runtime.isRecord)(value.conversations)) return null;
	return require_polls.normalizeMSTeamsLegacyConversationStore({
		version: 1,
		conversations: value.conversations
	});
}
function parseLegacyPoll(value) {
	if (!(0, openclaw_plugin_sdk_string_coerce_runtime.isRecord)(value)) return null;
	const votes = (0, openclaw_plugin_sdk_string_coerce_runtime.isRecord)(value.votes) ? value.votes : null;
	if (typeof value.id !== "string" || !value.id || typeof value.question !== "string" || !value.question || !isStringArray(value.options) || typeof value.maxSelections !== "number" || !Number.isFinite(value.maxSelections) || typeof value.createdAt !== "string" || !votes) return null;
	const normalizedVotes = {};
	for (const [voterId, selections] of Object.entries(votes)) if (typeof voterId === "string" && isStringArray(selections)) normalizedVotes[voterId] = selections;
	return {
		id: value.id,
		question: value.question,
		options: value.options,
		maxSelections: value.maxSelections,
		createdAt: value.createdAt,
		...typeof value.updatedAt === "string" ? { updatedAt: value.updatedAt } : {},
		...typeof value.conversationId === "string" ? { conversationId: value.conversationId } : {},
		...typeof value.messageId === "string" ? { messageId: value.messageId } : {},
		votes: normalizedVotes
	};
}
function parseLegacyPollStore(value) {
	if (!(0, openclaw_plugin_sdk_string_coerce_runtime.isRecord)(value) || value.version !== 1 || !(0, openclaw_plugin_sdk_string_coerce_runtime.isRecord)(value.polls)) return null;
	const polls = {};
	for (const [pollId, poll] of Object.entries(value.polls)) {
		const parsed = parseLegacyPoll(poll);
		if (parsed) polls[pollId] = parsed;
	}
	return {
		version: 1,
		polls
	};
}
async function listLegacyLearningFiles(storePath) {
	let entries;
	try {
		entries = await node_fs_promises.default.readdir(storePath, { withFileTypes: true });
	} catch {
		return [];
	}
	const suffix = ".learnings.json";
	const knownSessionKeys = await listKnownSessionKeys(storePath);
	const files = [];
	for (const entry of entries) {
		if (!entry.isFile() || !entry.name.endsWith(suffix)) continue;
		const fileStem = entry.name.slice(0, -15);
		const sessionKey = resolveLearningSessionKey(fileStem) ?? resolveLegacySanitizedSessionKey(fileStem, knownSessionKeys);
		const filePath = node_path.default.join(storePath, entry.name);
		try {
			const parsed = JSON.parse(await node_fs_promises.default.readFile(filePath, "utf8"));
			if (Array.isArray(parsed)) {
				const learnings = parsed.filter((item) => typeof item === "string");
				if (learnings.length > 0) files.push({
					storePath,
					sessionKey,
					filePath,
					learnings: learnings.slice(-10)
				});
			}
		} catch {}
	}
	return files;
}
function mergeLearnings(legacy, existing) {
	const seen = /* @__PURE__ */ new Set();
	const merged = [];
	for (const learning of [...legacy, ...existing?.learnings ?? []]) {
		if (seen.has(learning)) continue;
		seen.add(learning);
		merged.push(learning);
	}
	return merged.slice(-10);
}
async function completeLegacyKeyedImport(params) {
	const { filePath, label, imported, warnings } = params;
	const changes = [];
	let missing = 0;
	for (const { store, requiredKeys } of params.stores) {
		const retainedKeys = new Set((await store.entries()).map((entry) => entry.key));
		missing += [...requiredKeys].filter((key) => !retainedKeys.has(key)).length;
	}
	if (missing > 0) {
		warnings.push(`Incomplete ${label} migration: plugin state failed to retain every required entry (${missing} missing); left legacy source in place`);
		return {
			changes,
			warnings
		};
	}
	changes.push(`Migrated ${imported} ${label} ${imported === 1 ? "entry" : "entries"} -> plugin state`);
	await (0, openclaw_plugin_sdk_runtime_doctor_migrations.archiveLegacyStateSource)({
		filePath,
		label: params.archiveLabel ?? label,
		changes,
		warnings
	});
	return {
		changes,
		warnings
	};
}
const stateMigrations = [
	{
		id: "msteams-conversations-json-to-plugin-state",
		label: "Microsoft Teams conversations",
		async detectLegacyState(params) {
			const state = await readLegacyJsonFile(resolveStateFilePath(params.stateDir, require_polls.MSTEAMS_CONVERSATIONS_LEGACY_FILENAME), parseLegacyConversationStore);
			if (!state || Object.keys(state.conversations).length === 0) return null;
			return { preview: [`- ${MSTEAMS_PLUGIN_ID} conversations: ${Object.keys(state.conversations).length} entries -> plugin state (${require_polls.MSTEAMS_CONVERSATIONS_NAMESPACE})`] };
		},
		async migrateLegacyState(params) {
			const filePath = resolveStateFilePath(params.stateDir, require_polls.MSTEAMS_CONVERSATIONS_LEGACY_FILENAME);
			const state = await readLegacyJsonFile(filePath, parseLegacyConversationStore);
			if (!state) return {
				changes: [],
				warnings: []
			};
			const store = params.context.openPluginStateKeyedStore({
				namespace: require_polls.MSTEAMS_CONVERSATIONS_NAMESPACE,
				maxEntries: require_polls.MSTEAMS_SQLITE_MAX_CONVERSATION_ROWS
			});
			const requiredKeys = new Set((await store.entries()).map((entry) => entry.key));
			let imported = 0;
			for (const [rawConversationId, reference] of require_polls.selectRetainedMSTeamsConversations(state.conversations)) {
				const conversationId = require_polls.normalizeStoredConversationId(rawConversationId);
				if (!conversationId) continue;
				const key = require_polls.buildMSTeamsConversationStateKey(conversationId);
				requiredKeys.add(key);
				const storedReference = require_polls.prepareMSTeamsConversationReferenceForStorage(conversationId, reference);
				if (await store.registerIfAbsent(key, storedReference)) imported++;
			}
			return completeLegacyKeyedImport({
				filePath,
				label: `${MSTEAMS_PLUGIN_ID} conversation`,
				imported,
				warnings: [],
				stores: [{
					store,
					requiredKeys
				}]
			});
		}
	},
	{
		id: "msteams-polls-json-to-plugin-state",
		label: "Microsoft Teams polls",
		async detectLegacyState(params) {
			const state = await readLegacyJsonFile(resolveStateFilePath(params.stateDir, require_polls.MSTEAMS_POLLS_LEGACY_FILENAME), parseLegacyPollStore);
			if (!state || Object.keys(state.polls).length === 0) return null;
			return { preview: [`- ${MSTEAMS_PLUGIN_ID} polls: ${Object.keys(state.polls).length} entries -> plugin state (${require_polls.MSTEAMS_POLLS_NAMESPACE})`] };
		},
		async migrateLegacyState(params) {
			return await require_polls.withMSTeamsSqliteMutationLock({ stateDir: params.stateDir }, require_polls.MSTEAMS_POLLS_NAMESPACE, async () => {
				const filePath = resolveStateFilePath(params.stateDir, require_polls.MSTEAMS_POLLS_LEGACY_FILENAME);
				const state = await readLegacyJsonFile(filePath, parseLegacyPollStore);
				if (!state) return {
					changes: [],
					warnings: []
				};
				const pollStore = params.context.openPluginStateKeyedStore({
					namespace: require_polls.MSTEAMS_POLLS_NAMESPACE,
					maxEntries: require_polls.MSTEAMS_SQLITE_MAX_POLL_ROWS
				});
				const voteBucketStore = params.context.openPluginStateKeyedStore({
					namespace: require_polls.MSTEAMS_POLL_VOTE_BUCKETS_NAMESPACE,
					maxEntries: require_polls.MSTEAMS_MAX_POLL_VOTE_BUCKET_ROWS
				});
				const requiredPollKeys = new Set((await pollStore.entries()).map((entry) => entry.key));
				const requiredVoteKeys = new Set((await voteBucketStore.entries()).map((entry) => entry.key));
				let imported = 0;
				for (const [pollId, poll] of require_polls.selectRetainedMSTeamsPolls(state.polls)) {
					const { metadata, votes } = require_polls.splitMSTeamsPoll(poll);
					const pollKey = require_polls.buildMSTeamsPollStateKey(pollId);
					requiredPollKeys.add(pollKey);
					const didImportPoll = await pollStore.registerIfAbsent(pollKey, metadata);
					const buckets = /* @__PURE__ */ new Map();
					for (const [voterId, selections] of Object.entries(votes)) {
						const bucket = require_polls.selectMSTeamsPollVoteBucket(pollId, voterId);
						const bucketVotes = buckets.get(bucket) ?? {};
						bucketVotes[voterId] = selections;
						buckets.set(bucket, bucketVotes);
					}
					let importedVoteBucket = false;
					for (const [bucket, bucketVotes] of buckets) {
						const key = require_polls.buildMSTeamsPollVoteBucketKey(pollId, bucket);
						requiredVoteKeys.add(key);
						const existing = await voteBucketStore.lookup(key);
						await voteBucketStore.register(key, {
							pollId,
							bucket,
							votes: {
								...bucketVotes,
								...existing?.votes
							},
							updatedAt: poll.updatedAt ?? poll.createdAt
						});
						importedVoteBucket = true;
					}
					if (didImportPoll || importedVoteBucket) imported++;
				}
				return completeLegacyKeyedImport({
					filePath,
					label: `${MSTEAMS_PLUGIN_ID} poll`,
					imported,
					warnings: [],
					stores: [{
						store: pollStore,
						requiredKeys: requiredPollKeys
					}, {
						store: voteBucketStore,
						requiredKeys: requiredVoteKeys
					}]
				});
			});
		}
	},
	{
		id: "msteams-sso-tokens-json-to-plugin-state",
		label: "Microsoft Teams SSO tokens",
		async detectLegacyState(params) {
			const state = await readLegacyJsonFile(resolveStateFilePath(params.stateDir, require_sso_token_store.MSTEAMS_SSO_TOKENS_LEGACY_FILENAME), (value) => require_sso_token_store.isMSTeamsSsoStoreData(value) ? value : null);
			if (!state || Object.keys(state.tokens).length === 0) return null;
			return { preview: [`- ${MSTEAMS_PLUGIN_ID} SSO tokens: ${Object.keys(state.tokens).length} entries -> plugin state (${require_sso_token_store.MSTEAMS_SSO_TOKENS_NAMESPACE})`] };
		},
		async migrateLegacyState(params) {
			const warnings = [];
			const filePath = resolveStateFilePath(params.stateDir, require_sso_token_store.MSTEAMS_SSO_TOKENS_LEGACY_FILENAME);
			const state = await readLegacyJsonFile(filePath, (value) => require_sso_token_store.isMSTeamsSsoStoreData(value) ? value : null);
			if (!state) return {
				changes: [],
				warnings
			};
			const store = params.context.openPluginStateKeyedStore({
				namespace: require_sso_token_store.MSTEAMS_SSO_TOKENS_NAMESPACE,
				maxEntries: require_sso_token_store.MSTEAMS_MAX_SSO_TOKENS
			});
			const requiredKeys = new Set((await store.entries()).map((entry) => entry.key));
			let imported = 0;
			let skipped = 0;
			for (const token of Object.values(state.tokens)) {
				const normalized = require_sso_token_store.normalizeMSTeamsSsoStoredToken(token);
				if (!normalized) {
					skipped++;
					continue;
				}
				const key = require_sso_token_store.makeMSTeamsSsoTokenStoreKey(normalized.connectionName, normalized.userId);
				requiredKeys.add(key);
				if (await store.registerIfAbsent(key, normalized)) imported++;
			}
			if (skipped > 0) warnings.push(`Skipped ${skipped} malformed ${MSTEAMS_PLUGIN_ID} SSO token ${skipped === 1 ? "entry" : "entries"} during migration`);
			return completeLegacyKeyedImport({
				filePath,
				label: `${MSTEAMS_PLUGIN_ID} SSO token`,
				archiveLabel: `${MSTEAMS_PLUGIN_ID} SSO-token`,
				imported,
				warnings,
				stores: [{
					store,
					requiredKeys
				}]
			});
		}
	},
	{
		id: "msteams-delegated-token-json-to-plugin-state",
		label: "Microsoft Teams delegated OAuth token",
		async detectLegacyState(params) {
			const filePath = resolveStateFilePath(params.stateDir, require_delegated_state.MSTEAMS_DELEGATED_TOKEN_LEGACY_FILENAME);
			try {
				return (await node_fs_promises.default.stat(filePath)).isFile() ? { preview: [`- ${MSTEAMS_PLUGIN_ID} delegated OAuth token -> plugin state (${require_delegated_state.MSTEAMS_DELEGATED_TOKEN_NAMESPACE})`] } : null;
			} catch {
				return null;
			}
		},
		async migrateLegacyState(params) {
			const changes = [];
			const warnings = [];
			const filePath = resolveStateFilePath(params.stateDir, require_delegated_state.MSTEAMS_DELEGATED_TOKEN_LEGACY_FILENAME);
			let token;
			try {
				token = require_delegated_state.normalizeMSTeamsDelegatedTokens(JSON.parse(await node_fs_promises.default.readFile(filePath, "utf8")));
			} catch (error) {
				if (error.code === "ENOENT") return {
					changes,
					warnings
				};
				warnings.push(`Failed reading ${MSTEAMS_PLUGIN_ID} delegated OAuth token legacy source; left it in place`);
				return {
					changes,
					warnings
				};
			}
			if (!token) {
				warnings.push(`Invalid ${MSTEAMS_PLUGIN_ID} delegated OAuth token legacy source; left it in place`);
				return {
					changes,
					warnings
				};
			}
			const store = params.context.openPluginStateKeyedStore({
				namespace: require_delegated_state.MSTEAMS_DELEGATED_TOKEN_NAMESPACE,
				maxEntries: 1,
				overflowPolicy: "reject-new"
			});
			const existing = await store.lookup(require_delegated_state.MSTEAMS_DELEGATED_TOKEN_KEY);
			if (existing && JSON.stringify(existing) !== JSON.stringify(token)) {
				warnings.push(`Kept existing ${MSTEAMS_PLUGIN_ID} delegated OAuth token in plugin state; left differing legacy source in place`);
				return {
					changes,
					warnings
				};
			}
			if (!existing) try {
				await store.registerIfAbsent(require_delegated_state.MSTEAMS_DELEGATED_TOKEN_KEY, token);
			} catch (error) {
				warnings.push(`Failed importing ${MSTEAMS_PLUGIN_ID} delegated OAuth token: ${String(error)}; left legacy source in place`);
				return {
					changes,
					warnings
				};
			}
			const persisted = require_delegated_state.normalizeMSTeamsDelegatedTokens(await store.lookup(require_delegated_state.MSTEAMS_DELEGATED_TOKEN_KEY));
			if (!persisted || JSON.stringify(persisted) !== JSON.stringify(token)) {
				warnings.push(`Failed verifying ${MSTEAMS_PLUGIN_ID} delegated OAuth token in plugin state; left legacy source in place`);
				return {
					changes,
					warnings
				};
			}
			changes.push(`Migrated ${MSTEAMS_PLUGIN_ID} delegated OAuth token -> plugin state`);
			await (0, openclaw_plugin_sdk_runtime_doctor_migrations.archiveLegacyStateSource)({
				filePath,
				label: `${MSTEAMS_PLUGIN_ID} delegated OAuth token`,
				changes,
				warnings
			});
			return {
				changes,
				warnings
			};
		}
	},
	{
		id: "msteams-feedback-learnings-json-to-plugin-state",
		label: "Microsoft Teams feedback learnings",
		async detectLegacyState(params) {
			const files = (await Promise.all(listCandidateStorePaths(params).map((storePath) => listLegacyLearningFiles(storePath)))).flat();
			if (files.length === 0) return null;
			return { preview: [`- Microsoft Teams feedback learnings: ${files.length} ${files.length === 1 ? "file" : "files"} -> plugin state (${LEARNINGS_NAMESPACE})`] };
		},
		async migrateLegacyState(params) {
			const changes = [];
			const warnings = [];
			const files = (await Promise.all(listCandidateStorePaths(params).map((storePath) => listLegacyLearningFiles(storePath)))).flat();
			const store = params.context.openPluginStateKeyedStore({
				namespace: LEARNINGS_NAMESPACE,
				maxEntries: MAX_LEARNING_ENTRIES
			});
			const existingEntries = await store.entries();
			const existingKeys = new Set(existingEntries.map((entry) => entry.key));
			const importableFiles = files.filter((file) => file.sessionKey);
			const missingKeys = new Set(importableFiles.map((file) => learningStoreKey(file.storePath, file.sessionKey ?? "")).filter((key) => !existingKeys.has(key)));
			if (missingKeys.size > MAX_LEARNING_ENTRIES - existingKeys.size) {
				warnings.push(`Skipped Microsoft Teams feedback-learning migration because plugin state has room for ${MAX_LEARNING_ENTRIES - existingKeys.size} of ${missingKeys.size} missing entries; left legacy sources in place`);
				return {
					changes,
					warnings
				};
			}
			let imported = 0;
			for (const file of files) {
				if (!file.sessionKey) {
					warnings.push(`Left Microsoft Teams feedback-learning source in place because its legacy filename cannot be mapped to a session key: ${file.filePath}`);
					continue;
				}
				const key = learningStoreKey(file.storePath, file.sessionKey);
				const existing = await store.lookup(key);
				await store.register(key, {
					sessionKey: existing?.sessionKey ?? file.sessionKey,
					learnings: mergeLearnings(file.learnings, existing),
					updatedAt: Date.now()
				});
				imported++;
				await (0, openclaw_plugin_sdk_runtime_doctor_migrations.archiveLegacyStateSource)({
					filePath: file.filePath,
					label: "Microsoft Teams feedback-learning",
					changes,
					warnings
				});
			}
			if (imported > 0) changes.unshift(`Migrated ${imported} Microsoft Teams feedback-learning ${imported === 1 ? "entry" : "entries"} -> plugin state`);
			return {
				changes,
				warnings
			};
		}
	}
];
//#endregion
exports.legacyConfigRules = legacyConfigRules;
exports.normalizeCompatibilityConfig = normalizeCompatibilityConfig;
exports.stateMigrations = stateMigrations;
