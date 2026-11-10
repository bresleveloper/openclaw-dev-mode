import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { Ng as errorShape } from "./src-pLJQA6J5.mjs";
import { n as operatorScopeSatisfied } from "./operator-scope-compat-Ci6GBcmU.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { t as assertActiveAgentRuntimeAuthority } from "./agent-runtime-authority-B3KjbGu2.mjs";
import { t as resolveAgentIdOrRespondError } from "./agent-id-shared-BTlRmOxU.mjs";
import { o as readCronCallerScope } from "./cron-caller-scope-mSZERe9F.mjs";
import { i as requestMcpEvent, n as prepareMcpEventConnection } from "./service-mcp-events-HqZDWxYS.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/gateway/server-methods/mcp-events.ts
function boundedString(value, maximum) {
	return typeof value === "string" && value.length > 0 && value.length <= maximum;
}
/** One bounded page, with an explicit cursor; never traverse unbounded remote catalogs. */
function projectCatalog(value) {
	if (!isRecord(value) || !Array.isArray(value.events) || value.events.length > 1e3 || Buffer.byteLength(JSON.stringify(value), "utf8") > 1048576 || value.nextCursor !== void 0 && !boundedString(value.nextCursor, 16384)) throw new Error("Invalid MCP Events catalog response.");
	return {
		events: value.events.map((event) => {
			if (!isRecord(event) || !boundedString(event.name, 256) || !Array.isArray(event.delivery) || !event.delivery.every((mode) => typeof mode === "string") || !(isRecord(event.inputSchema) || typeof event.inputSchema === "boolean") || !(isRecord(event.payloadSchema) || typeof event.payloadSchema === "boolean")) throw new Error("Invalid MCP Events catalog definition.");
			return {
				name: event.name,
				...typeof event.description === "string" ? { description: truncateUtf16Safe(event.description, 4096) } : {},
				delivery: event.delivery,
				inputSchema: event.inputSchema,
				payloadSchema: event.payloadSchema
			};
		}).filter((event) => event.delivery.includes("webhook")),
		...value.nextCursor !== void 0 ? { nextCursor: value.nextCursor } : {}
	};
}
const mcpEventsHandlers = { "mcp.events.list": async (options) => {
	const { params, client, context, respond, signal, hasCurrentClientAuthority } = options;
	if (Object.keys(params).some((key) => ![
		"agentId",
		"serverName",
		"cursor"
	].includes(key)) || !boundedString(params.serverName, 256) || params.agentId !== void 0 && !boundedString(params.agentId, 128) || params.cursor !== void 0 && !boundedString(params.cursor, 16384)) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "Expected {agentId?, serverName, cursor?}."));
		return;
	}
	const serverName = params.serverName;
	const cursor = params.cursor;
	const cfg = context.getRuntimeConfig();
	const registry = context.getGatewayMethodRegistry?.();
	if (!registry?.descriptors().some((entry) => entry.owner.kind === "plugin" && entry.owner.pluginId === "mcp-events")) {
		respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "Enable the MCP Events plugin to browse event sources."));
		return;
	}
	const caller = readCronCallerScope(client);
	const resolved = resolveAgentIdOrRespondError({
		cfg,
		respond,
		rawAgentId: params.agentId ?? caller?.agentId
	});
	if (!resolved) return;
	if (caller && caller.agentId !== resolved.agentId) {
		respond(false, void 0, errorShape(ErrorCodes.FORBIDDEN, "MCP Events catalog is bound to the caller's agent."));
		return;
	}
	const requester = caller?.toolsAllowProvenance?.channelRequester;
	const principal = {
		agentId: resolved.agentId,
		...caller ? {
			sessionKey: caller.sessionKey,
			account: {
				id: caller.accountId,
				channel: caller.toolsAllowProvenance?.callerOrigin?.kind === "external" ? caller.toolsAllowProvenance.callerOrigin.channel : void 0
			}
		} : {},
		...requester ? { requester: {
			requesterSenderId: requester.senderId,
			messageChannel: requester.channel,
			agentAccountId: requester.accountId
		} } : {}
	};
	const identity = {
		user: client?.authenticatedUserId,
		profile: client?.authenticatedUserProfile?.profileId,
		runtime: client?.internal?.agentRuntimeIdentity
	};
	const assertCurrent = () => {
		signal?.throwIfAborted();
		client?.connectionSignal?.throwIfAborted();
		options.sessionMutationCommitGuard?.();
		if (!client || client.invalidated || hasCurrentClientAuthority?.() === false || !operatorScopeSatisfied("operator.read", client.connect.scopes ?? []) || context.getRuntimeConfig() !== cfg || context.getGatewayMethodRegistry?.() !== registry || client.authenticatedUserId !== identity.user || client.authenticatedUserProfile?.profileId !== identity.profile || client.internal?.agentRuntimeIdentity !== identity.runtime || !isDeepStrictEqual(readCronCallerScope(client), caller)) throw new Error("MCP Events catalog caller authority changed.");
		assertActiveAgentRuntimeAuthority(client, context);
	};
	try {
		assertCurrent();
		const connection = await prepareMcpEventConnection({
			cfg,
			principal,
			serverName,
			assertCurrent
		});
		try {
			const discovered = await requestMcpEvent({
				...connection,
				serverName,
				method: "server/discover",
				signal,
				assertCurrent: connection.assertCurrent
			});
			connection.assertCurrent();
			if (!isRecord(discovered) || !Array.isArray(discovered.supportedVersions) || !discovered.supportedVersions.includes("2026-07-28") || !isRecord(discovered.capabilities) || !Object.hasOwn(discovered.capabilities, "events")) throw new Error("This MCP server does not advertise the supported Events protocol.");
			const result = projectCatalog(await requestMcpEvent({
				...connection,
				serverName,
				method: "events/list",
				params: typeof cursor === "string" ? { cursor } : {},
				signal,
				assertCurrent: connection.assertCurrent
			}));
			connection.assertCurrent();
			respond(true, {
				serverName,
				...result
			}, void 0);
		} finally {
			connection.release();
		}
	} catch {
		respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "MCP event catalog unavailable. Check the server's Events support, your account connection, and current access."));
	}
} };
//#endregion
export { mcpEventsHandlers };
