import { C as parseStrictNonNegativeInteger, w as parseStrictPositiveInteger } from "./number-coercion-CuVhdCBs.mjs";
import { r as defaultRuntime } from "./runtime-DlO3PTAd.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { n as requestExitAfterOneShotOutput } from "./one-shot-exit-Bd4757D_.mjs";
import { r as setVerbose } from "./global-state-BAD7XgmL.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import { n as awaitWithinDeadline, t as ABSOLUTE_DEADLINE_EXPIRED } from "./absolute-deadline-DoGHpXtD.mjs";
import { u as withPluginRuntimeRegistryScope } from "./gateway-request-scope-BSmCVVpP.mjs";
import { d as resolveDiscoverableScopedChannelPluginIds, l as resolveConfiguredChannelPluginIds } from "./channel-presence-policy-BruI3Lbo.mjs";
import { r as getRuntimeConfig } from "./io.runtime-BSum32pK.mjs";
import "./config-9720xhC5.mjs";
import { t as formatDocsLink } from "./links-4Bgsoz0M.mjs";
import { t as danger } from "./globals-BXbZ1A_g.mjs";
import "./channel-plugin-ids-DY8VBQ0g.mjs";
import { n as withActivatedPluginIds } from "./activation-context-cBjvZv-U.mjs";
import { t as getChannelPlugin } from "./registry-DOE8N7Jo.mjs";
import "./plugins-Z9_SzFi0.mjs";
import { t as CHANNEL_MESSAGE_ACTION_NAMES } from "./message-action-names-BPz1joQd.mjs";
import { n as CHANNEL_TARGET_DESCRIPTION, t as CHANNEL_TARGETS_DESCRIPTION } from "./channel-target-g69jtBF3.mjs";
import { t as resolveMessageSecretScope } from "./message-secret-scope-CfC2gSvy.mjs";
import { r as resolveMessageActionOutcome } from "./message-action-contracts-CvElm8Dz.mjs";
import { t as measureCliCommandStartup } from "./command-startup-timing-BQ92nv1I.mjs";
import { n as runCommandWithRuntime } from "./cli-utils-ClVfZRCr.mjs";
import { n as formatHelpExamples } from "./help-format-xds_bDSp.mjs";
import { t as collectOption } from "./helpers-Bbrcmhji.mjs";
import { t as parseAccountSelector } from "./account-selector-DE7PugtW.mjs";
import { t as parseChannelSelector } from "./channel-selector-CTI6xK_s.mjs";
import { t as applyParentDefaultHelpAction } from "./parent-default-help-udre-2i5.mjs";
import { Option } from "commander";
//#region src/cli/program/message/helpers.ts
const GATEWAY_STOP_TIMEOUT_MS = 2500;
const CHANNEL_MESSAGE_ACTION_NAME_SET = new Set(CHANNEL_MESSAGE_ACTION_NAMES);
const STRICT_POSITIVE_INTEGER_OPTIONS = /* @__PURE__ */ new Map([
	["pollDurationHours", "--poll-duration-hours"],
	["pollDurationSeconds", "--poll-duration-seconds"],
	["limit", "--limit"],
	["autoArchiveMin", "--auto-archive-min"]
]);
const STRICT_NON_NEGATIVE_INTEGER_OPTIONS = /* @__PURE__ */ new Map([["durationMin", "--duration-min"], ["deleteDays", "--delete-days"]]);
function normalizeMessageOptions(opts) {
	const { account, ...rest } = opts;
	return {
		...rest,
		accountId: typeof account === "string" ? account : rest.accountId
	};
}
function validateMessageNumericOptions(opts) {
	for (const [key, flag] of STRICT_POSITIVE_INTEGER_OPTIONS) {
		if (opts[key] === void 0) continue;
		if (parseStrictPositiveInteger(opts[key]) === void 0) throw new Error(`${flag} must be a positive integer.`);
	}
	for (const [key, flag] of STRICT_NON_NEGATIVE_INTEGER_OPTIONS) {
		if (opts[key] === void 0) continue;
		if (parseStrictNonNegativeInteger(opts[key]) === void 0) throw new Error(`${flag} must be a non-negative integer.`);
	}
}
async function runPluginStopHooks(registry) {
	const { createHookRunner } = await import("./hooks-CPQpZQVr.mjs");
	const runner = createHookRunner(registry, { logger: createSubsystemLogger("plugins") });
	if (await awaitWithinDeadline(() => withPluginRuntimeRegistryScope(registry, () => runner.runGatewayStop({ reason: "cli message action complete" }, {})), Date.now() + GATEWAY_STOP_TIMEOUT_MS) === ABSOLUTE_DEADLINE_EXPIRED) defaultRuntime.error(danger(`gateway_stop hook exceeded ${GATEWAY_STOP_TIMEOUT_MS}ms; continuing`));
}
function asChannelMessageActionName(action) {
	return CHANNEL_MESSAGE_ACTION_NAME_SET.has(action) ? action : void 0;
}
function isGatewayOwnedMessageAction(action, scopedChannel) {
	const messageAction = asChannelMessageActionName(action);
	if (!messageAction || !scopedChannel) return false;
	return getChannelPlugin(scopedChannel)?.actions?.resolveExecutionMode?.({ action: messageAction }) === "gateway";
}
/** Create shared option decorators and the common message action runner. */
function createMessageCliHelpers(messageChannelOptions) {
	return {
		withMessageBase: (command, target) => {
			if (target === "required") command.requiredOption("-t, --target <dest>", CHANNEL_TARGET_DESCRIPTION);
			return command.option("--channel <channel>", `Channel: ${messageChannelOptions}`, parseChannelSelector).option("--account <id>", "Channel account id (accountId)", parseAccountSelector).option("--json", "Output result as JSON", false).option("--dry-run", "Print payload and skip sending", false).option("--verbose", "Verbose logging", false);
		},
		runMessageAction: async (action, opts) => {
			setVerbose(Boolean(opts.verbose));
			let failed = false;
			let result;
			let pluginRegistry;
			try {
				await runCommandWithRuntime(defaultRuntime, async () => {
					validateMessageNumericOptions(opts);
					if (action === "poll" && opts.pollAnonymous === true && opts.pollPublic === true) throw new Error("--poll-anonymous and --poll-public are mutually exclusive.");
					const { channel: scopedChannel } = resolveMessageSecretScope({
						channel: opts.channel,
						target: opts.target,
						targets: opts.targets
					});
					const preloadPlugins = opts.dryRun === true || action === "broadcast" || !isGatewayOwnedMessageAction(action, scopedChannel);
					await measureCliCommandStartup("config-ready", async () => {
						const { ensureConfigReady } = await import("./config-guard-CdYKx1bP.mjs");
						await ensureConfigReady({
							runtime: defaultRuntime,
							commandPath: ["message", action],
							suppressDoctorStdout: opts.json === true,
							validateConfigOnly: !preloadPlugins,
							measure: (stage, run) => measureCliCommandStartup(stage, run)
						});
					});
					if (preloadPlugins) {
						const config = getRuntimeConfig();
						const pluginIds = scopedChannel ? resolveDiscoverableScopedChannelPluginIds({
							config,
							activationSourceConfig: config,
							channelIds: [scopedChannel],
							env: process.env
						}) : resolveConfiguredChannelPluginIds({
							config,
							activationSourceConfig: config,
							env: process.env
						});
						const activatedConfig = withActivatedPluginIds({
							config,
							pluginIds
						}) ?? config;
						const { loadPluginRegistryHandle } = await import("./plugins/loader.js");
						pluginRegistry = loadPluginRegistryHandle({
							config: activatedConfig,
							activationSourceConfig: activatedConfig,
							onlyPluginIds: pluginIds,
							throwOnLoadError: true
						});
					}
					const [{ messageCommand }, { createDefaultDeps }] = await Promise.all([import("./message-DzxpCAXz.mjs"), import("./deps-LgwU-wpy.mjs")]);
					const deps = createDefaultDeps();
					const run = () => messageCommand({
						...normalizeMessageOptions(opts),
						action
					}, deps, defaultRuntime);
					result = await withPluginRuntimeRegistryScope(pluginRegistry, run);
				}, (err) => {
					failed = true;
					defaultRuntime.error(danger(formatErrorMessage(err)));
				});
			} finally {
				if (pluginRegistry && action !== "read") await runPluginStopHooks(pluginRegistry);
			}
			failed ||= result !== void 0 && !resolveMessageActionOutcome(result).ok;
			requestExitAfterOneShotOutput(defaultRuntime, failed ? 1 : 0);
		}
	};
}
//#endregion
//#region src/cli/program/message/register.discord-admin.ts
const requiredOptions = {
	guild: ["--guild-id <id>", "Guild id"],
	user: ["--user-id <id>", "User id"],
	role: ["--role-id <id>", "Role id"],
	eventName: ["--event-name <name>", "Event name"],
	startTime: ["--start-time <iso>", "Event start time"]
};
function registerMessageDiscordAdminCommands(message, helpers) {
	function register(parent, name, description, action, required) {
		const command = parent.command(name).description(description);
		for (const key of required) {
			const [flags, optionDescription] = requiredOptions[key];
			command.requiredOption(flags, optionDescription);
		}
		return helpers.withMessageBase(command).action((opts) => helpers.runMessageAction(action, opts));
	}
	const role = message.command("role").description("Role actions");
	register(role, "info", "List roles", "role-info", ["guild"]);
	register(role, "add", "Add role to a member", "role-add", [
		"guild",
		"user",
		"role"
	]);
	register(role, "remove", "Remove role from a member", "role-remove", [
		"guild",
		"user",
		"role"
	]);
	const channel = message.command("channel").description("Channel actions");
	helpers.withMessageBase(channel.command("info").description("Fetch channel info"), "required").action((opts) => helpers.runMessageAction("channel-info", opts));
	register(channel, "list", "List channels", "channel-list", ["guild"]);
	register(message.command("member").description("Member actions"), "info", "Fetch member info", "member-info", ["user"]).option("--guild-id <id>", "Guild id (Discord)").option("--channel-id <id>", "Room id (Matrix) or Graph team-id/channel-id (Microsoft Teams)");
	register(message.command("voice").description("Voice actions"), "status", "Fetch voice status", "voice-status", ["guild", "user"]);
	const event = message.command("event").description("Event actions");
	register(event, "list", "List scheduled events", "event-list", ["guild"]);
	register(event, "create", "Create a scheduled event", "event-create", [
		"guild",
		"eventName",
		"startTime"
	]).option("--end-time <iso>", "Event end time").option("--desc <text>", "Event description").option("--channel-id <id>", "Channel id").option("--location <text>", "Event location").option("--event-type <stage|external|voice>", "Event type").option("--image <url>", "Cover image URL or local file path");
	register(message, "timeout", "Timeout a member", "timeout", ["guild", "user"]).option("--duration-min <n>", "Timeout duration minutes").option("--until <iso>", "Timeout until").option("--reason <text>", "Moderation reason");
	register(message, "kick", "Kick a member", "kick", ["guild", "user"]).option("--reason <text>", "Moderation reason");
	register(message, "ban", "Ban a member", "ban", ["guild", "user"]).option("--reason <text>", "Moderation reason").option("--delete-days <n>", "Ban delete message days");
}
//#endregion
//#region src/cli/program/message/register.permissions-search.ts
function registerMessagePermissionsCommand(message, helpers) {
	helpers.withMessageBase(message.command("permissions").description("Fetch channel permissions"), "required").action((opts) => helpers.runMessageAction("permissions", opts));
}
function registerMessageSearchCommand(message, helpers) {
	helpers.withMessageBase(message.command("search").description("Search messages")).requiredOption("--query <text>", "Search query").option("--guild-id <id>", "Guild id (Discord)").option("--channel-id <id>", "Channel id (Discord) or Graph team-id/channel-id (Microsoft Teams)").option("--channel-ids <id>", "Channel id (repeat)", collectOption, []).option("--author-id <id>", "Author id").option("--author-ids <id>", "Author id (repeat)", collectOption, []).option("--limit <n>", "Result limit").action((opts) => helpers.runMessageAction("search", opts));
}
//#endregion
//#region src/cli/program/message/register.read-edit-delete.ts
function registerMessageReadEditDeleteCommands(message, helpers) {
	helpers.withMessageBase(message.command("read").description("Read recent messages"), "required").option("--limit <n>", "Result limit").option("--message-id <id>", "Read a specific message id").option("--before <id>", "Read/search before id").option("--after <id>", "Read/search after id").option("--around <id>", "Read around id").option("--thread-id <id>", "Thread id (Slack thread timestamp)").addOption(new Option("--include-thread").hideHelp()).action((opts) => helpers.runMessageAction("read", opts));
	helpers.withMessageBase(message.command("edit").description("Edit a message").requiredOption("--message-id <id>", "Message id").requiredOption("-m, --message <text>", "Message body"), "required").option("--thread-id <id>", "Thread id (Telegram forum thread)").action((opts) => helpers.runMessageAction("edit", opts));
	helpers.withMessageBase(message.command("delete").description("Delete a message").requiredOption("--message-id <id>", "Message id"), "required").action((opts) => helpers.runMessageAction("delete", opts));
}
//#endregion
//#region src/cli/program/message/register.send.ts
/** Register `message send` and route execution through shared message helpers. */
function registerMessageSendCommand(message, helpers) {
	helpers.withMessageBase(message.command("send").description("Send a message").option("-m, --message <text>", "Message body (required unless --media or --presentation is set)").requiredOption("-t, --target <dest>", CHANNEL_TARGET_DESCRIPTION).option("--media <path-or-url>", "Attach media (image/audio/video/document). Accepts local paths or URLs. Repeat to attach multiple files.", collectOption).option("--presentation <json>", "Shared presentation payload as JSON (text, context, dividers, charts, tables, buttons, selects)").option("--delivery <json>", "Shared delivery preferences as JSON").option("--pin", "Request that the delivered message be pinned when supported", false).option("--reply-to <id>", "Reply-to message id").option("--thread-id <id>", "Thread id (Telegram forum thread)").option("--gif-playback", "Treat video media as GIF playback (WhatsApp only).", false).option("--force-document", "Preserve original image bytes on Slack, or send images, GIFs, and videos as documents on Telegram and WhatsApp, to avoid channel compression.", false).option("--silent", "Send message silently without notification (Telegram + Discord)", false)).action(({ media, ...opts }) => helpers.runMessageAction("send", {
		...opts,
		mediaUrls: media
	}));
}
//#endregion
//#region src/cli/program/message/register.thread.ts
function resolveThreadCreateRequest(opts) {
	const { channel } = resolveMessageSecretScope(opts);
	if (channel) {
		const request = getChannelPlugin(channel)?.actions?.resolveCliActionRequest?.({
			action: "thread-create",
			args: opts
		});
		if (request) return request;
	}
	return {
		action: "thread-create",
		args: opts
	};
}
function registerMessageThreadCommands(message, helpers) {
	const thread = message.command("thread").description("Thread actions");
	helpers.withMessageBase(thread.command("create").description("Create a thread").requiredOption("--thread-name <name>", "Thread name"), "required").option("--message-id <id>", "Message id (optional)").option("-m, --message <text>", "Initial thread message text").option("--auto-archive-min <n>", "Thread auto-archive minutes").action(async (opts) => {
		const request = resolveThreadCreateRequest(opts);
		await helpers.runMessageAction(request.action, request.args);
	});
	helpers.withMessageBase(thread.command("list").description("List threads").requiredOption("--guild-id <id>", "Guild id")).option("--channel-id <id>", "Channel id").option("--include-archived", "Include archived threads", false).option("--before <id>", "Read/search before id").option("--limit <n>", "Result limit").action((opts) => helpers.runMessageAction("thread-list", opts));
	helpers.withMessageBase(thread.command("reply").description("Reply in a thread").requiredOption("-m, --message <text>", "Message body"), "required").option("--media <path-or-url>", "Attach media (image/audio/video/document). Accepts local paths or URLs.").option("--reply-to <id>", "Reply-to message id").action((opts) => helpers.runMessageAction("thread-reply", opts));
}
//#endregion
//#region src/cli/program/register.message.ts
/** Register the `message` command group with shared channel option helpers. */
function registerMessageCommands(program, ctx) {
	const message = program.command("message").description("Send, read, and manage messages and channel actions").addHelpText("after", () => `
${theme.heading("Examples:")}
${formatHelpExamples([
		["openclaw message send --target +15555550123 --message \"Hi\"", "Send a text message."],
		["openclaw message send --target +15555550123 --message \"Hi\" --media photo.jpg", "Send a message with media."],
		["openclaw message poll --channel discord --target channel:123 --poll-question \"Snack?\" --poll-option Pizza --poll-option Sushi", "Create a Discord poll."],
		["openclaw message react --channel discord --target 123 --message-id 456 --emoji \"✅\"", "React to a message."]
	])}

${theme.muted("Docs:")} ${formatDocsLink("/cli/message", "docs.openclaw.ai/cli/message")}`);
	const helpers = createMessageCliHelpers(ctx.messageChannelOptions);
	registerMessageSendCommand(message, helpers);
	helpers.withMessageBase(message.command("broadcast").description("Broadcast a message to multiple targets")).requiredOption("--targets <target...>", CHANNEL_TARGETS_DESCRIPTION).option("--message <text>", "Message to send").option("--media <url>", "Media URL").action((options) => helpers.runMessageAction("broadcast", options));
	helpers.withMessageBase(message.command("poll").description("Send a poll"), "required").requiredOption("--poll-question <text>", "Poll question").option("--poll-option <choice>", "Poll option (repeat 2-12 times)", collectOption, []).option("--poll-multi", "Allow multiple selections", false).option("--poll-duration-hours <n>", "Poll duration in hours (Discord)").option("--poll-duration-seconds <n>", "Poll duration in seconds (Telegram; 5-604800)").option("--poll-anonymous", "Send an anonymous poll (Telegram)", false).option("--poll-public", "Send a non-anonymous poll (Telegram)", false).option("-m, --message <text>", "Optional message body").option("--silent", "Send poll silently without notification (Telegram + Discord where supported)", false).option("--thread-id <id>", "Thread id (Telegram forum topic / Slack thread ts)").action((opts) => helpers.runMessageAction("poll", opts));
	helpers.withMessageBase(message.command("react").description("Add or remove a reaction"), "required").requiredOption("--message-id <id>", "Message id").option("--emoji <emoji>", "Emoji for reactions").option("--remove", "Remove reaction", false).option("--participant <id>", "WhatsApp reaction participant").option("--from-me", "WhatsApp reaction fromMe", false).option("--target-author <id>", "Signal reaction target author (uuid or phone)").option("--target-author-uuid <uuid>", "Signal reaction target author uuid").action((opts) => helpers.runMessageAction("react", opts));
	helpers.withMessageBase(message.command("reactions").description("List reactions on a message"), "required").requiredOption("--message-id <id>", "Message id").option("--limit <n>", "Result limit").action((opts) => helpers.runMessageAction("reactions", opts));
	registerMessageReadEditDeleteCommands(message, helpers);
	helpers.withMessageBase(message.command("pin").description("Pin a message"), "required").requiredOption("--message-id <id>", "Message id").action((opts) => helpers.runMessageAction("pin", opts));
	helpers.withMessageBase(message.command("unpin").description("Unpin a message"), "required").requiredOption("--message-id <id>", "Message id (or pinned message resource id for MSTeams)").option("--pinned-message-id <id>", "Pinned message resource id (MSTeams: from pin or list-pins, not the chat message id)").action((opts) => helpers.runMessageAction("unpin", opts));
	helpers.withMessageBase(message.command("pins").description("List pinned messages"), "required").option("--limit <n>", "Result limit").action((opts) => helpers.runMessageAction("list-pins", opts));
	registerMessagePermissionsCommand(message, helpers);
	registerMessageSearchCommand(message, helpers);
	registerMessageThreadCommands(message, helpers);
	const emoji = message.command("emoji").description("Emoji actions");
	helpers.withMessageBase(emoji.command("list").description("List emojis")).option("--guild-id <id>", "Guild id (Discord)").action((opts) => helpers.runMessageAction("emoji-list", opts));
	helpers.withMessageBase(emoji.command("upload").description("Upload an emoji").requiredOption("--guild-id <id>", "Guild id")).requiredOption("--emoji-name <name>", "Emoji name").requiredOption("--media <path-or-url>", "Emoji media (path or URL)").option("--role-ids <id>", "Role id (repeat)", collectOption, []).action((opts) => helpers.runMessageAction("emoji-upload", opts));
	const sticker = message.command("sticker").description("Sticker actions");
	helpers.withMessageBase(sticker.command("send").description("Send stickers"), "required").requiredOption("--sticker-id <id>", "Sticker id (repeat)", collectOption).option("-m, --message <text>", "Optional message body").action((opts) => helpers.runMessageAction("sticker", opts));
	helpers.withMessageBase(sticker.command("upload").description("Upload a sticker").requiredOption("--guild-id <id>", "Guild id")).requiredOption("--sticker-name <name>", "Sticker name").requiredOption("--sticker-desc <text>", "Sticker description").requiredOption("--sticker-tags <tags>", "Sticker tags").requiredOption("--media <path-or-url>", "Sticker media (path or URL)").action((opts) => helpers.runMessageAction("sticker-upload", opts));
	registerMessageDiscordAdminCommands(message, helpers);
	for (const command of message.commands) if (command.commands.length > 0) applyParentDefaultHelpAction(command);
	applyParentDefaultHelpAction(message);
}
//#endregion
export { registerMessageCommands };
