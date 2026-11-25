import { t as discord_exports } from "./discord-cXPUdHQi.mjs";
import { createSubsystemLogger } from "openclaw/plugin-sdk/runtime-env";
import { formatErrorMessage } from "openclaw/plugin-sdk/ssrf-runtime";
// extensions/discord/src/voice/listeners.ts
const logger = createSubsystemLogger("discord/voice");
function startAutoJoin(operation, context = "") {
	operation().catch((err) => logger.warn(`discord voice: autoJoin${context} failed: ${formatErrorMessage(err)}`));
}
var DiscordVoiceReadyListener = class {
	constructor(manager) {
		this.manager = manager;
		this.type = discord_exports.GatewayDispatchEvents.Ready;
	}
	async handle(_data, _client) {
		startAutoJoin(() => this.manager.autoJoin());
	}
};
var DiscordVoiceResumedListener = class extends DiscordVoiceReadyListener {
	constructor(..._args) {
		super(..._args);
		this.type = discord_exports.GatewayDispatchEvents.Resumed;
	}
};
var DiscordVoiceGuildCreateListener = class {
	constructor(manager) {
		this.manager = manager;
		this.type = discord_exports.GatewayDispatchEvents.GuildCreate;
	}
	async handle(data, _client) {
		if (!data.unavailable) {
			this.manager.refreshGuildRoster(data.id);
			startAutoJoin(() => this.manager.reconcileAutoJoinGuild(data.id), ` occupancy reconciliation guild=${data.id}`);
		}
	}
};
var DiscordVoiceStateUpdateListener = class {
	constructor(manager) {
		this.manager = manager;
		this.type = discord_exports.GatewayDispatchEvents.VoiceStateUpdate;
	}
	async handle(data, client) {
		const transition = client.getPlugin("gateway")?.takeVoiceStateTransition(data);
		await this.manager.handleVoiceStateUpdate(data, transition ? transition.previous ?? null : void 0);
	}
};
export { DiscordVoiceGuildCreateListener, DiscordVoiceReadyListener, DiscordVoiceResumedListener, DiscordVoiceStateUpdateListener };
