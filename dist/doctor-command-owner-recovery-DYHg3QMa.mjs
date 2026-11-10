import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { i as normalizeChatChannelId } from "./ids-DhLNdNuz.mjs";
import { n as containsAuthoredInclude, r as readDoctorConfigBackup } from "./include-migration-ownership-KfGWiqXu.mjs";
import "./backup-rotation-BJBdiSUE.mjs";
import { t as createCommandOwnerChannelResolver } from "./doctor-command-owner-DAqinR9q.mjs";
import { o as resolveHeartbeatIntervalMs, r as resolveHeartbeatAgents } from "./heartbeat-config-CNn1aX1c.mjs";
import JSON5 from "json5";
//#region src/commands/doctor-command-owner-recovery.ts
function withoutLegacyOwnerKind(entry) {
	const legacy = typeof entry === "string" ? /^([^:]+):user:([^:\s*]+)$/i.exec(entry.trim()) : null;
	const channel = legacy && normalizeChatChannelId(legacy[1]);
	return channel && legacy ? `${channel}:${legacy[2]}` : entry;
}
/** Recover only a recorded direct-user kind for an owner whose identity still matches. */
function recoverCommandOwnerTargetKinds(params) {
	const { config, snapshot } = params;
	const result = {
		config,
		changes: [],
		warnings: []
	};
	const owners = config.commands?.ownerAllowFrom;
	if (!owners?.length || !resolveHeartbeatAgents(config).some(({ heartbeat }) => (heartbeat?.target === void 0 || heartbeat.target === "owner") && resolveHeartbeatIntervalMs(config, void 0, heartbeat))) return result;
	const repairs = /* @__PURE__ */ new Map();
	const resolveChannel = createCommandOwnerChannelResolver(config);
	for (const [index, entry] of owners.entries()) {
		const bare = typeof entry === "string" ? /^([^:]+):([^:\s*]+)$/.exec(entry.trim()) : null;
		const channel = bare && normalizeChatChannelId(bare[1]);
		const id = bare?.[2];
		if (!channel || !id) continue;
		const messaging = resolveChannel(channel)?.messaging;
		if (messaging?.directTargetStyle === "user-prefixed" && messaging.inferTargetChatType?.({ to: id }) !== "direct" && messaging.inferTargetChatType?.({ to: `user:${id}` }) === "direct") repairs.set(index, `${channel}:user:${id}`);
	}
	if (repairs.size === 0) return result;
	const ownerAllowFrom = [...owners];
	if (!containsAuthoredInclude(snapshot.parsed)) for (let index = 0; index < 5; index++) {
		const backupPath = `${snapshot.path}.bak${index === 0 ? "" : `.${index}`}`;
		let backup;
		try {
			const raw = readDoctorConfigBackup(backupPath);
			if (raw === void 0) continue;
			backup = JSON5.parse(raw);
		} catch {
			result.warnings.push(`Could not inspect ${backupPath} for command-owner target recovery.`);
			break;
		}
		const historical = isRecord(backup) && isRecord(backup.commands) ? backup.commands.ownerAllowFrom : void 0;
		if (containsAuthoredInclude(backup) || !Array.isArray(historical) || historical.length !== owners.length || historical.some((entry, position) => entry !== owners[position] && withoutLegacyOwnerKind(entry) !== owners[position])) break;
		for (const [position, typed] of repairs) if (historical[position] !== owners[position]) {
			ownerAllowFrom[position] = typed;
			repairs.delete(position);
			result.changes.push(`Restored commands.ownerAllowFrom[${position}] target kind from ${backupPath}.`);
		}
		if (result.changes.length) {
			result.config = {
				...config,
				commands: {
					...config.commands,
					ownerAllowFrom
				}
			};
			if (repairs.size === 0) break;
		}
	}
	for (const [index, typed] of repairs) result.warnings.push(`commands.ownerAllowFrom[${index}]=${JSON.stringify(owners[index])} cannot resolve a direct heartbeat owner route; heartbeats can skip with reason="no-route". No matching config backup proves the user target kind. After confirming this is your user ID, set commands.ownerAllowFrom[${index}] to ${JSON.stringify(typed)}. Doctor left this owner unchanged.`);
	return result;
}
//#endregion
export { recoverCommandOwnerTargetKinds };
