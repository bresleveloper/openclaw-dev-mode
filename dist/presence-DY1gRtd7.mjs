import { t as closedObject } from "./closed-object-DGvQfpTV.mjs";
import "./user-profile-constants-DfyZS95p.mjs";
import { t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape } from "./error-codes-Dh56LniQ.mjs";
import { t as lazyCompile } from "./protocol-validator-BeXu4Ype.mjs";
import { it as PresenceQueryParamsSchema, nt as PresenceLocationSchema } from "./worker-admission-CNeLWzVQ.mjs";
import { u as resolveGatewayOperatorRoleActor } from "./operator-role-policy-BqPaarjx.mjs";
import { n as presenceUserKey, t as groupPresenceUsers } from "./presence-user-DFg4B6Vx.mjs";
import { a as readGatewayRequestMutationAuthority } from "./session-mutation-guards-CxCbIrod.mjs";
import { t as assertValidParams } from "./validation-Bu27N0nv.mjs";
import { t as buildAuthenticatedPresenceUser } from "./authenticated-presence-user-W1udm3RS.mjs";
import { isIP } from "node:net";
import { Type } from "typebox";
//#region src/gateway/presence-summary.ts
function deviceId(entry, connectionId) {
	return entry.deviceId ? `device:${entry.deviceId}` : entry.instanceId ? `instance:${entry.user ? presenceUserKey(entry.user) : `connection:${connectionId}`}:${entry.instanceId}` : `connection:${connectionId}`;
}
function latestActivity(observations) {
	return observations.flatMap(({ activity }) => activity ? [activity] : []).toSorted((a, b) => b.at - a.at || a.deviceId.localeCompare(b.deviceId))[0] ?? null;
}
function collectObservations(entries, nodes) {
	const observations = /* @__PURE__ */ new Map();
	const nodesByConnection = new Map(nodes.map((node) => [node.connId, node]));
	for (const entry of entries) {
		const connectionId = entry.connectionId;
		if (!connectionId || entry.reason === "disconnect" || entry.roles?.includes("node") && !nodesByConnection.has(connectionId)) continue;
		const id = deviceId(entry, connectionId);
		observations.set(connectionId, {
			entry,
			connectionId,
			deviceId: id,
			activity: entry.connectionLastActivityAt === void 0 ? null : {
				at: entry.connectionLastActivityAt,
				source: "openclaw-interaction",
				deviceId: id
			}
		});
	}
	for (const node of nodes) {
		const existing = observations.get(node.connId);
		const user = node.client.authenticatedUserProfile?.profileId === "gateway-owner" || node.client.authenticatedGitHubIdentitySync && !node.client.authenticatedUserProfile ? void 0 : buildAuthenticatedPresenceUser(node.client);
		const entry = {
			...existing?.entry,
			connectionId: node.connId,
			deviceId: node.client.connect.device?.id ?? node.nodeId,
			host: node.displayName ?? existing?.entry.host ?? node.nodeId,
			clientId: node.clientId,
			platform: node.platform,
			deviceFamily: node.deviceFamily,
			timeZone: node.client.connect.client.timeZone,
			ip: node.client.internal?.isLocalClient ? void 0 : existing?.entry.ip ?? node.remoteIp,
			user,
			ts: node.presenceUpdatedAtMs ?? node.connectedAtMs,
			onlineSince: existing?.entry.onlineSince ?? node.connectedAtMs
		};
		const id = deviceId(entry, node.connId);
		const nativeActivity = node.lastActiveAtMs !== void 0 && node.presenceActivitySource ? {
			at: node.lastActiveAtMs,
			source: node.presenceActivitySource === "app" ? "app-input" : "system-input",
			deviceId: id
		} : null;
		observations.set(node.connId, {
			entry,
			connectionId: node.connId,
			deviceId: id,
			node,
			activity: nativeActivity && nativeActivity.at > (existing?.activity?.at ?? -1) ? nativeActivity : existing?.activity ?? null
		});
	}
	return [...observations.values()];
}
function projectDevices(observations, include, locations) {
	const grouped = /* @__PURE__ */ new Map();
	for (const observation of observations) {
		const group = grouped.get(observation.deviceId);
		if (group) group.push(observation);
		else grouped.set(observation.deviceId, [observation]);
	}
	return [...grouped.entries()].toSorted(([a], [b]) => a.localeCompare(b)).map(([id, group]) => {
		const node = group.find((item) => item.node)?.node;
		const names = group.flatMap(({ entry }) => entry.host ? [entry.host] : []).toSorted();
		const device = {
			id,
			name: node?.displayName ?? names[0] ?? id,
			kind: node ? "node" : "client",
			personIds: [...new Set(group.flatMap(({ entry }) => entry.user ? [presenceUserKey(entry.user)] : []))].toSorted(),
			online: true,
			activity: latestActivity(group),
			connections: group.toSorted((a, b) => a.connectionId.localeCompare(b.connectionId)).map(({ entry, connectionId }) => {
				const connection = { id: connectionId };
				if (entry.clientId) connection.clientId = entry.clientId;
				if (entry.platform) connection.platform = entry.platform;
				if (entry.deviceFamily) connection.deviceFamily = entry.deviceFamily;
				if (entry.timeZone) connection.timeZone = entry.timeZone;
				if (include.includes("network")) connection.network = { ip: entry.ip ?? null };
				if (include.includes("location")) connection.location = entry.ip && locations.get(entry.ip) || {
					source: "ip",
					status: "unavailable"
				};
				return connection;
			})
		};
		if (node) device.nodeId = node.nodeId;
		return device;
	});
}
/** Read model shared by Gateway presence consumers; it retains no history or inferred ownership. */
function buildPresenceSummary(options) {
	const { params, observedAt } = options;
	const include = params.include ?? [];
	const locations = options.locations ?? /* @__PURE__ */ new Map();
	const observations = collectObservations(options.presence, options.nodes);
	const people = groupPresenceUsers(observations.map(({ entry }) => entry)).users.map((group) => {
		const id = presenceUserKey(group);
		const own = observations.filter(({ entry }) => entry.user && presenceUserKey(entry.user) === id);
		const onlineSince = own.flatMap(({ entry }) => entry.onlineSince === void 0 ? [] : [entry.onlineSince]);
		const devices = projectDevices(own, include, locations);
		const person = {
			id,
			name: group.identity?.id === "gateway-owner" ? "Shared owner" : group.name ?? group.email ?? group.id,
			online: true,
			activity: latestActivity(own),
			deviceCount: devices.length
		};
		if (group.identity) person.profileId = group.identity.id;
		if (onlineSince.length) person.onlineSince = Math.min(...onlineSince);
		if (include.length) person.devices = devices;
		return person;
	}).toSorted((a, b) => a.name.localeCompare(b.name) || a.id.localeCompare(b.id));
	const base = {
		observedAt,
		status: "ok",
		people: [],
		totalPeople: 0,
		truncated: false
	};
	const action = params.action ?? "list";
	const sharedDevices = () => projectDevices(observations.filter(({ entry }) => !entry.user), include, locations);
	if (action === "device") {
		const devices = projectDevices(observations, include, locations).filter((device) => device.id === params.deviceId);
		return {
			...base,
			status: devices.length ? "ok" : "not-found",
			devices,
			...devices.length ? {} : { message: "No connected device matches that presence device ID." }
		};
	}
	let matches = people;
	if (action === "person") {
		const selector = params.person?.trim() ?? "";
		if (selector.toLowerCase() === "me") {
			if (!options.requesterKey) return {
				...base,
				status: "identity-unavailable",
				message: "This caller has no authenticated person identity. Select a person returned by list."
			};
			matches = people.filter((person) => person.id === options.requesterKey);
		} else {
			const exact = people.filter((person) => person.id === selector || person.profileId === selector);
			matches = exact.length ? exact : people.filter((person) => person.name.toLowerCase() === selector.toLowerCase());
		}
		if (matches.length === 0) return {
			...base,
			status: "not-found",
			message: "No connected person matches. Offline activity is not retained.",
			...selector.toLowerCase() === "me" && include.length ? { devices: sharedDevices() } : {}
		};
	}
	const limit = params.limit ?? 50;
	return {
		...base,
		status: action === "person" && matches.length > 1 ? "ambiguous" : "ok",
		people: matches.slice(0, limit),
		totalPeople: matches.length,
		truncated: matches.length > limit,
		...action === "person" && matches.length > 1 ? { message: "Multiple connected people match. Select one of the returned person IDs." } : {},
		...(action === "list" || action === "person" && params.person?.trim().toLowerCase() === "me") && include.length ? { devices: sharedDevices() } : {}
	};
}
//#endregion
//#region src/gateway/server-methods/presence.ts
const validateParams = /* @__PURE__ */ lazyCompile(PresenceQueryParamsSchema);
const validateLocationResult = /* @__PURE__ */ lazyCompile(closedObject({ results: Type.Array(closedObject({
	ip: Type.String(),
	...Type.Omit(PresenceLocationSchema, ["source"]).properties
}), { maxItems: 200 }) }));
function requesterKey(client) {
	const actor = resolveGatewayOperatorRoleActor(client);
	if (actor) return actor.kind === "operator" ? `profile:${actor.profileId}` : void 0;
	const profile = client?.authenticatedUserProfile;
	if (profile) return `profile:${profile.profileId}`;
	return client?.authenticatedUserId && !client.authenticatedGitHubIdentitySync ? presenceUserKey({ id: client.authenticatedUserId }) : void 0;
}
async function lookupLocations(summary, options) {
	const devices = [...summary.people.flatMap((person) => person.devices ?? []), ...summary.devices ?? []];
	const ips = [...new Set(devices.flatMap((device) => device.connections.flatMap((connection) => {
		const ip = connection.network?.ip;
		return ip && isIP(ip) ? [ip] : [];
	})))];
	const locations = /* @__PURE__ */ new Map();
	if (!ips.length) return locations;
	const { dispatchGatewayMethodInProcessRaw } = await import("./server-plugin-in-process-dispatch-uEtPf8ph.mjs");
	for (let offset = 0; offset < ips.length; offset += 200) {
		const result = await dispatchGatewayMethodInProcessRaw("geolocation.lookup", { ips: ips.slice(offset, offset + 200) }, {
			disableSyntheticClient: true,
			requireScopedClient: true,
			signal: options.signal,
			hasCurrentClientAuthority: options.hasCurrentClientAuthority,
			sessionMutationCommitGuard: () => readGatewayRequestMutationAuthority(options).assertCurrent()
		});
		readGatewayRequestMutationAuthority(options).assertCurrent();
		if (result.ok && validateLocationResult(result.payload)) for (const { ip, ...location } of result.payload.results) locations.set(ip, {
			source: "ip",
			...location
		});
	}
	return locations;
}
const presenceHandlers = { "presence.query": async (options) => {
	const { params, respond, context, client } = options;
	if (!assertValidParams(params, validateParams, "presence.query", respond)) return;
	const action = params.action ?? "list";
	if (action === "person" && !params.person?.trim() || action === "device" && !params.deviceId?.trim() || action !== "person" && params.person !== void 0 || action !== "device" && params.deviceId !== void 0) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "person requires a person selector; device requires a presence deviceId. Selectors apply only to their matching action."));
		return;
	}
	const locations = params.include?.includes("location") ? await lookupLocations(buildPresenceSummary({
		params: {
			...params,
			include: [.../* @__PURE__ */ new Set([...params.include ?? [], "network"])]
		},
		presence: context.getPresenceSnapshot(),
		nodes: context.nodeRegistry.listCurrentConnectedSync(),
		requesterKey: requesterKey(client),
		observedAt: Date.now()
	}), options) : void 0;
	readGatewayRequestMutationAuthority(options).assertCurrent();
	respond(true, buildPresenceSummary({
		params,
		presence: context.getPresenceSnapshot(),
		nodes: context.nodeRegistry.listCurrentConnectedSync(),
		requesterKey: requesterKey(client),
		observedAt: Date.now(),
		locations
	}), void 0);
} };
//#endregion
export { presenceHandlers };
