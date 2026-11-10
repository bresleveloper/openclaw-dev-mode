import { c as resolveDefaultDiscordAccountId } from "./accounts-ljrzXBJi.mjs";
import { t as inspectDiscordAccount } from "./account-inspect-8cCu6uPG.mjs";
import { r as DISCORD_LEGACY_CONFIG_RULES } from "./shared-CY5vJM48.mjs";
import { t as runtime_doctor_migrations_exports } from "./runtime-doctor-migrations-BPV-R4G9.mjs";
import { n as normalizeCompatibilityConfig } from "./doctor-contract-Bwv8EuQ_.mjs";
import { t as isDiscordMutableAllowEntry } from "./security-doctor-nGgPm65L.mjs";
import { n as discordVoiceTranscriptsSourceProvider } from "./transcripts-source-8RDQrSVb.mjs";
import { normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { expectDefined } from "openclaw/plugin-sdk/expect-runtime";
//#region extensions/discord/src/doctor.ts
function sanitizeForLog(value) {
	return value.replace(/\p{Cc}+/gu, " ").trim();
}
function collectDiscordIdLists(prefix, account, userAllowlistsOnly = false) {
	const refs = [];
	const addLists = (holder, path, keys) => {
		for (const key of keys) refs.push({
			pathLabel: `${path}.${key}`,
			holder,
			key
		});
	};
	addLists(account, prefix, ["allowFrom"]);
	const dm = (0, runtime_doctor_migrations_exports.asObjectRecord)(account.dm);
	if (dm) addLists(dm, `${prefix}.dm`, userAllowlistsOnly ? ["allowFrom"] : ["allowFrom", "groupChannels"]);
	const execApprovals = (0, runtime_doctor_migrations_exports.asObjectRecord)(account.execApprovals);
	if (execApprovals && !userAllowlistsOnly) addLists(execApprovals, `${prefix}.execApprovals`, ["approvers"]);
	const memberKeys = userAllowlistsOnly ? ["users"] : ["users", "roles"];
	for (const [guildId, guildValue] of Object.entries((0, runtime_doctor_migrations_exports.asObjectRecord)(account.guilds) ?? {})) {
		const guild = (0, runtime_doctor_migrations_exports.asObjectRecord)(guildValue);
		if (!guild) continue;
		const guildPath = `${prefix}.guilds.${guildId}`;
		addLists(guild, guildPath, memberKeys);
		for (const [channelId, channelValue] of Object.entries((0, runtime_doctor_migrations_exports.asObjectRecord)(guild.channels) ?? {})) {
			const channel = (0, runtime_doctor_migrations_exports.asObjectRecord)(channelValue);
			if (channel) addLists(channel, `${guildPath}.channels.${channelId}`, memberKeys);
		}
	}
	return refs;
}
function scanDiscordNumericIdEntries(cfg) {
	const hits = [];
	for (const scope of (0, runtime_doctor_migrations_exports.collectChannelAccountScopes)({
		cfg,
		channelId: "discord"
	})) for (const ref of collectDiscordIdLists(scope.prefix, scope.account)) {
		const list = ref.holder[ref.key];
		if (!Array.isArray(list)) continue;
		for (const [index, entry] of list.entries()) if (typeof entry === "number") hits.push({
			path: `${ref.pathLabel}[${index}]`,
			entry,
			safe: Number.isSafeInteger(entry) && entry >= 0
		});
	}
	return hits;
}
function collectDiscordNumericIdWarnings(params) {
	if (params.hits.length === 0) return [];
	const listPath = (hit) => hit.path.replace(/\[\d+\]$/, "");
	const blockedPaths = new Set(params.hits.filter((hit) => !hit.safe).map(listPath));
	const repairableHits = params.hits.filter((hit) => !blockedPaths.has(listPath(hit)));
	const blockedHits = params.hits.filter((hit) => blockedPaths.has(listPath(hit)));
	const lines = [];
	if (repairableHits.length > 0) {
		const sample = expectDefined(repairableHits.at(0), "non-empty repairable Discord ID hits");
		lines.push(`- Discord allowlists contain ${repairableHits.length} numeric ${repairableHits.length === 1 ? "entry" : "entries"} (e.g. ${sanitizeForLog(sample.path)}=${sanitizeForLog(String(sample.entry))}).`, `- Discord IDs must be strings; run "${params.doctorFixCommand}" to convert numeric IDs to quoted strings.`);
	}
	if (blockedHits.length > 0) {
		const sample = expectDefined(blockedHits.at(0), "non-empty blocked Discord ID hits");
		lines.push(`- Discord allowlists contain ${blockedHits.length} numeric ${blockedHits.length === 1 ? "entry" : "entries"} in lists that cannot be auto-repaired (e.g. ${sanitizeForLog(sample.path)}).`, `- These lists include invalid or precision-losing numeric IDs; manually quote the original values in your config file, then rerun "${params.doctorFixCommand}".`);
	}
	return lines;
}
function maybeRepairDiscordNumericIds(cfg, doctorFixCommand) {
	const hits = scanDiscordNumericIdEntries(cfg);
	if (hits.length === 0) return {
		config: cfg,
		changes: []
	};
	const next = structuredClone(cfg);
	const changes = [];
	for (const scope of (0, runtime_doctor_migrations_exports.collectChannelAccountScopes)({
		cfg: next,
		channelId: "discord"
	})) for (const { pathLabel, holder, key } of collectDiscordIdLists(scope.prefix, scope.account)) {
		const raw = holder[key];
		if (!Array.isArray(raw) || raw.some((entry) => typeof entry === "number" && (!Number.isSafeInteger(entry) || entry < 0))) continue;
		let converted = 0;
		holder[key] = raw.map((entry) => {
			if (typeof entry === "number") {
				converted += 1;
				return String(entry);
			}
			return entry;
		});
		if (converted > 0) changes.push(`- ${sanitizeForLog(pathLabel)}: converted ${converted} numeric ${converted === 1 ? "ID" : "IDs"} to strings`);
	}
	const repaired = changes.length > 0;
	return {
		config: repaired ? next : cfg,
		changes,
		warnings: collectDiscordNumericIdWarnings({
			hits: repaired ? hits.filter((hit) => !hit.safe) : hits,
			doctorFixCommand
		})
	};
}
function collectDiscordMissingEnvTokenWarnings(params) {
	if (resolveDefaultDiscordAccountId(params.cfg) !== "default") return [];
	const account = inspectDiscordAccount({
		cfg: params.cfg,
		accountId: "default",
		envToken: params.env?.DISCORD_BOT_TOKEN ?? ""
	});
	if (!account.enabled || account.tokenStatus !== "missing" || account.tokenSource !== "none") return [];
	return ["- channels.discord: default account has no available bot token, and DISCORD_BOT_TOKEN is absent in this doctor environment. After migration, verify DISCORD_BOT_TOKEN is present in the state-dir .env or configure channels.discord.token / channels.discord.accounts.default.token as a SecretRef."];
}
function collectDiscordTranscriptsAutoStartWarnings(cfg) {
	if (cfg.transcripts?.enabled === false || !Array.isArray(cfg.transcripts?.autoStart)) return [];
	const ownership = discordVoiceTranscriptsSourceProvider.accessControl;
	if (!ownership) return [];
	return cfg.transcripts.autoStart.flatMap((entry, index) => {
		const providerId = normalizeOptionalString(entry.providerId)?.toLowerCase();
		if (providerId !== discordVoiceTranscriptsSourceProvider.id && !discordVoiceTranscriptsSourceProvider.aliases?.includes(providerId ?? "") || normalizeOptionalString(entry.accountId)) return [];
		const resolution = ownership.resolveAccountId({
			cfg,
			source: {
				providerId: entry.providerId,
				accountId: entry.accountId
			}
		});
		if (resolution.ok) return [];
		const path = `transcripts.autoStart[${index}]`;
		return [`- ${path} cannot select a Discord voice account: ${resolution.error} Set ${path}.accountId to the intended enabled voice account, or set channels.discord.defaultAccount when one account should be the global default.`];
	});
}
function collectDiscordMutableAllowlistWarnings(cfg) {
	const hits = [];
	for (const scope of (0, runtime_doctor_migrations_exports.collectProviderDangerousNameMatchingScopes)(cfg, "discord")) {
		if (scope.dangerousNameMatchingEnabled) continue;
		for (const ref of collectDiscordIdLists(scope.prefix, scope.account, true)) {
			const pathLabel = ref.pathLabel;
			const list = ref.holder[ref.key];
			if (!Array.isArray(list)) continue;
			for (const entry of list) {
				const text = normalizeOptionalString(String(entry)) ?? "";
				if (!text || text === "*" || !isDiscordMutableAllowEntry(text)) continue;
				hits.push({
					path: pathLabel,
					entry: text
				});
			}
		}
	}
	if (hits.length === 0) return [];
	const exampleLines = hits.slice(0, 8).map((hit) => `- ${sanitizeForLog(hit.path)}: ${sanitizeForLog(hit.entry)}`);
	const remaining = hits.length > 8 ? `- +${hits.length - 8} more mutable allowlist entries.` : null;
	return [
		`- Found ${hits.length} mutable allowlist ${hits.length === 1 ? "entry" : "entries"} across discord while name matching is disabled by default.`,
		...exampleLines,
		...remaining ? [remaining] : [],
		`- Option A (break-glass): enable channels.discord.dangerouslyAllowNameMatching=true for the affected scope.`,
		`- Option B (recommended): resolve names to stable Discord IDs and rewrite the allowlist entries.`
	];
}
const discordDoctor = {
	dmAllowFromMode: "topOnly",
	groupModel: "route",
	groupAllowFromFallbackToAllowFrom: false,
	warnOnEmptyGroupSenderAllowlist: false,
	legacyConfigRules: DISCORD_LEGACY_CONFIG_RULES,
	normalizeCompatibilityConfig,
	collectPreviewWarnings: ({ cfg, doctorFixCommand, env }) => [
		...collectDiscordMissingEnvTokenWarnings({
			cfg,
			env
		}),
		...collectDiscordNumericIdWarnings({
			hits: scanDiscordNumericIdEntries(cfg),
			doctorFixCommand
		}),
		...collectDiscordTranscriptsAutoStartWarnings(cfg)
	],
	collectMutableAllowlistWarnings: ({ cfg }) => collectDiscordMutableAllowlistWarnings(cfg),
	repairConfig: ({ cfg, doctorFixCommand }) => maybeRepairDiscordNumericIds(cfg, doctorFixCommand)
};
//#endregion
export { collectDiscordMissingEnvTokenWarnings, collectDiscordNumericIdWarnings, discordDoctor, maybeRepairDiscordNumericIds, scanDiscordNumericIdEntries };
