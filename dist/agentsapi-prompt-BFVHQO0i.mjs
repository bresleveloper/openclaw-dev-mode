import { n as buildTemporalContextText } from "./date-time-DNFKWNdt.mjs";
import { i as buildUiPresentationPrompt, t as buildHarnessVisibleReplyGuidance } from "./source-reply-delivery-mode-C0QKYTyh.mjs";
import { t as log } from "./logger-BpegRAAz.mjs";
import { d as resolveMainSessionDelegationMode, f as buildCredentialSafetyPrompt, l as buildSkillWorkshopPromptSection, u as buildDelegationGuidanceSection } from "./watched-sessions-prompt-DYB0TQlV.mjs";
import { S as prepareAgentWorkspaceContext, f as prepareWatchedSessionsHarnessContext } from "./agent-harness-runtime-BxShxpgh.mjs";
import { o as resolveAgentWorkspaceMemoryRouting, s as shouldIncludeAgentHarnessRuntimeContext } from "./agent-harness-attempt-runtime-Dv3UHbll.mjs";
//#region extensions/agentsapi/agentsapi-prompt.ts
const OPENAI_HOSTED_ENVIRONMENT_INSTRUCTIONS = [
	"You are the OpenClaw assistant. Use your hosted Linux workspace for commands and files.",
	"OpenClaw functions run in the Gateway and use its workspace; your hosted VM owns shell commands and VM files.",
	"Input attachments are mapped to hosted VM paths in each user message. Write deliverable files under /workspace/outputs; OpenClaw transfers them and attaches them to your final reply after your turn completes.",
	"Gateway messaging functions cannot open hosted VM paths. Finish your assistant turn to deliver hosted output attachments."
].join("\n\n");
const SELF_HOSTED_ENVIRONMENT_INSTRUCTIONS = [
	"You are the OpenClaw assistant. Use your connected self-hosted executor for commands and workspace files.",
	"OpenClaw functions run in the Gateway and use its workspace. Native shell commands and file operations run in your connected executor's workspace.",
	"Input attachments prepared by the workspace provider are identified by execution-only paths in the current user message. Use those paths with executor tools; original Gateway media paths are not executor paths. Other attachment references are not proof of a transferred file.",
	"OpenClaw does not automatically transfer output files from this executor through the Agents API."
].join("\n\n");
const INLINE_IMAGE_INPUT_INSTRUCTIONS = [
	"The OpenClaw Agents API harness does not support inline image inputs. Do not send images as inline input to this harness.",
	"For image or document tasks, use supplied text or available tools to inspect original files at the prepared execution paths in the current message.",
	"If the needed content is unavailable, ask for a text description. Do not claim to have viewed an image you have not inspected."
].join(" ");
const HOSTED_ATTACHMENT_UPLOAD_UNAVAILABLE_FEEDBACK = "Input attachment feedback: The hosted environment is unavailable for file uploads. There are no confirmed hosted VM paths for this message's attachments, including any files uploaded before the environment disconnected. Files retained from earlier turns do not establish the contents of these new attachments. Use supplied text or available Gateway tools that can access the originals. If the needed content remains inaccessible, explain that limitation and ask for relevant text. Do not claim to have inspected the current attachments unless a tool actually reads them.";
const INLINE_IMAGE_INPUT_CAPABILITY_NOTICE = "Input capability feedback: The Agents API harness does not support inline image inputs. The inline images for this message were not sent.";
const OMITTED_IMAGE_REPLY_GUIDANCE = "Continue the task without claiming to have viewed the omitted images.";
const IMAGE_RECOVERY_WITH_PREPARED_ATTACHMENTS = [
	INLINE_IMAGE_INPUT_CAPABILITY_NOTICE,
	"Original attachments are available at the prepared execution paths above. Use any supplied text or inspect those files with available tools to try another approach.",
	OMITTED_IMAGE_REPLY_GUIDANCE
].join(" ");
const IMAGE_RECOVERY_WITHOUT_PREPARED_ATTACHMENTS = [
	INLINE_IMAGE_INPUT_CAPABILITY_NOTICE,
	"No confirmed execution paths are available for this message's original attachments. Use supplied text or available tools that can access the originals, or ask for a text description if the image is necessary and remains inaccessible.",
	OMITTED_IMAGE_REPLY_GUIDANCE
].join(" ");
/** The native session owns this snapshot until OpenClaw resets its binding. */
async function buildAgentsApiInstructions(params, tools, environment) {
	const toolNames = new Set(tools.map((tool) => tool.name));
	const workspaceDir = params.bootstrapWorkspaceDir ?? params.workspaceDir;
	const { memoryToolNames, memoryToolRouted } = resolveAgentWorkspaceMemoryRouting({
		config: params.config,
		agentId: params.agentId,
		workspaceDir,
		toolNames
	});
	const workspace = await prepareAgentWorkspaceContext({
		scope: "full",
		workspaceDir,
		config: params.config,
		sessionKey: params.sessionKey,
		sessionId: params.sessionId,
		bootstrapUserProfileId: params.bootstrapUserProfileId,
		agentId: params.agentId,
		chatType: params.chatType,
		contextMode: params.bootstrapContextMode,
		runKind: params.bootstrapContextRunKind,
		warn: (message) => log.warn(message),
		memoryToolRouted,
		memoryTools: shouldIncludeAgentHarnessRuntimeContext(params) ? {
			toolNames: [...toolNames],
			citationsMode: params.config?.memory?.citations
		} : void 0
	});
	const messageTool = tools.find((tool) => tool.name === "message");
	const fullPrompt = params.promptMode !== "minimal" && params.promptMode !== "none";
	const delegationAvailable = params.disableTools !== true && params.delegationCapability !== "report_only" && params.sourceReplyDeliveryMode !== "message_tool_only";
	return joinSections([
		environment.type === "openai_hosted" ? OPENAI_HOSTED_ENVIRONMENT_INSTRUCTIONS : `${SELF_HOSTED_ENVIRONMENT_INSTRUCTIONS}\n\nYour executor workspace directory is ${JSON.stringify(environment.workspace_directory)}.`,
		INLINE_IMAGE_INPUT_INSTRUCTIONS,
		environment.type === "openai_hosted" ? "OpenClaw workspace files below are Gateway-owned instruction and reference snapshots. Their paths identify their source, not files available in your hosted VM. Do not try to reread or edit those paths with hosted shell or file tools." : "OpenClaw workspace files below are Gateway-owned instruction and reference snapshots. Their paths identify their source, not files available in your connected executor. Do not try to reread or edit those paths with executor shell or file tools.",
		workspace.instructionSnapshot.instructions,
		workspace.personaInstructions,
		workspace.promptContextFiles.length ? [
			"## OpenClaw Workspace Context",
			"Supporting project reference from the Gateway workspace:",
			...workspace.promptContextFiles.map((file) => `### ${file.path}\n\n${file.content}`)
		].join("\n\n") : void 0,
		workspace.memoryRecallInstructions,
		workspace.memoryReferenceFiles.length ? [
			"## OpenClaw Workspace Memory",
			`MEMORY.md is a memory file, not an instruction file. Its contents are not embedded here. Use ${memoryToolNames.join(" or ")} when durable memory is relevant.`,
			...workspace.memoryReferenceFiles.map((file) => `- ${file.path}`)
		].join("\n\n") : void 0,
		toolNames.has("skill_workshop") ? buildSkillWorkshopPromptSection().join("\n") : void 0,
		delegationAvailable ? buildDelegationGuidanceSection({
			mode: resolveMainSessionDelegationMode(params),
			isMinimal: !fullPrompt,
			hiddenDelegationTool: toolNames.has("sessions_spawn") ? "`sessions_spawn`" : "",
			hasVisibleSessionSpawn: toolNames.has("sessions_spawn"),
			hasSessionsYield: toolNames.has("sessions_yield"),
			hasSubagentsList: toolNames.has("subagents"),
			hasSessionsSend: toolNames.has("sessions_send")
		}).join("\n") : void 0,
		params.disableTools !== true && fullPrompt ? buildUiPresentationPrompt({
			screenToolName: toolNames.has("screen") ? "screen" : void 0,
			showWidgetToolName: toolNames.has("show_widget") ? "show_widget" : void 0,
			dashboardToolName: toolNames.has("dashboard") ? "dashboard" : void 0,
			portalToolName: toolNames.has("portal") ? "portal" : void 0,
			messageTool
		}) : void 0,
		buildCredentialSafetyPrompt(toolNames.has("openclaw") || toolNames.has("gateway") ? { controlToolsAvailable: true } : void 0),
		params.gitCoauthorPrompt,
		params.extraSystemPrompt
	]);
}
async function buildAgentsApiTurnInput(params, tools, prompt, mappingText, environmentType, assertCurrent, attachmentFeedback) {
	const attachmentNote = environmentType === "self_hosted" && prompt.endsWith(`\n\n${mappingText}`) ? "" : mappingText;
	return [
		await buildAgentsApiTurnContext(params, tools, assertCurrent),
		prompt,
		attachmentNote,
		attachmentFeedback,
		params.images?.length ? mappingText ? IMAGE_RECOVERY_WITH_PREPARED_ATTACHMENTS : IMAGE_RECOVERY_WITHOUT_PREPARED_ATTACHMENTS : void 0
	].filter(Boolean).join("\n\n");
}
/** Current facts use the existing input carrier, not immutable session instructions. */
async function buildAgentsApiTurnContext(params, tools, assertCurrent) {
	if (!shouldIncludeAgentHarnessRuntimeContext(params)) return;
	const toolNames = new Set(tools.map((tool) => tool.name));
	return joinSections([
		"OpenClaw runtime context for this turn (replaces earlier runtime facts):",
		buildTemporalContextText({
			configuredTimezone: params.config?.agents?.defaults?.userTimezone,
			sessionStatusAvailable: toolNames.has("session_status")
		}),
		params.hostCapabilities.activeComputerContext?.() ?? "Current active computer: active_node=unknown (host presence unavailable)",
		buildHarnessVisibleReplyGuidance({
			sourceReplyDeliveryMode: params.sourceReplyDeliveryMode,
			messageToolAvailable: toolNames.has("message"),
			requireExplicitMessageTarget: params.requireExplicitMessageTarget
		}),
		params.permissionChange?.notice,
		await prepareWatchedSessionsHarnessContext({
			config: params.config,
			sessionKey: params.sessionKey,
			toolNames,
			assertCurrent
		}),
		"Current user request:"
	]);
}
function joinSections(sections) {
	return sections.filter((section) => section?.trim()).join("\n\n");
}
//#endregion
export { buildAgentsApiInstructions as n, buildAgentsApiTurnInput as r, HOSTED_ATTACHMENT_UPLOAD_UNAVAILABLE_FEEDBACK as t };
