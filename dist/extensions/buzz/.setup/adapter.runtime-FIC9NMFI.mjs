import { m as parseBuzzTarget, n as decodeBuzzPrivateKey, o as resolveBuzzPublicKey, u as buildBuzzTarget } from "./types-CeupBG0P.mjs";
import { c as openBuzzRelaySubscription, i as parseBuzzRoomMembershipEvent, o as connectAuthenticatedBuzzRelaySession, s as parseBuzzAuthTag, t as BUZZ_ROOM_MEMBERSHIP_KIND, u as isNewerBuzzRevision } from "./room-membership-tqLQznFE.mjs";
import { i as buildBuzzMessageTags, s as parseBuzzMessageEvent } from "./message-event-X_aBiM1X.mjs";
import { z } from "zod";
import { finalizeEvent } from "nostr-tools";
import { isLoopbackHost } from "openclaw/plugin-sdk/ssrf-runtime";
import { setTimeout as setTimeout$1 } from "node:timers/promises";
import fs from "node:fs/promises";
import path from "node:path";
//#region extensions/buzz/src/qa/credentials.ts
function isSafeBuzzQaRelayUrl(value) {
	try {
		const relayUrl = new URL(value);
		return relayUrl.protocol === "wss:" || relayUrl.protocol === "ws:" && isLoopbackHost(relayUrl.hostname);
	} catch {
		return false;
	}
}
const buzzQaCredentialPayloadSchema = z.object({
	relayUrl: z.string().url().refine(isSafeBuzzQaRelayUrl),
	roomId: z.string().min(1),
	driverPrivateKey: z.string().min(1),
	sutPrivateKey: z.string().min(1),
	driverAuthTag: z.string().optional(),
	sutAuthTag: z.string().optional()
}).strict();
function parseBuzzQaCredentialPayload(payload) {
	const parsed = buzzQaCredentialPayloadSchema.safeParse(payload);
	if (!parsed.success) throw new Error("Buzz QA credentials are missing or malformed.");
	let roomId;
	let driverPublicKey;
	let sutPublicKey;
	try {
		roomId = parseBuzzTarget(parsed.data.roomId);
		driverPublicKey = resolveBuzzPublicKey(parsed.data.driverPrivateKey);
		sutPublicKey = resolveBuzzPublicKey(parsed.data.sutPrivateKey);
		parseBuzzAuthTag(parsed.data.driverAuthTag ?? "");
		parseBuzzAuthTag(parsed.data.sutAuthTag ?? "");
	} catch {
		throw new Error("Buzz QA credentials are missing or malformed.");
	}
	if (driverPublicKey === sutPublicKey) throw new Error("Buzz QA requires distinct driver and SUT identities.");
	return {
		...parsed.data,
		roomId,
		driverPublicKey,
		sutPublicKey
	};
}
async function readBuzzQaCredentialFile(params) {
	const resolvedPath = path.resolve(params.repoRoot ?? process.cwd(), params.filePath);
	let raw;
	try {
		raw = await fs.readFile(resolvedPath, "utf8");
	} catch (error) {
		throw new Error(`Unable to read Buzz QA credential file ${resolvedPath}.`, { cause: error });
	}
	let payload;
	try {
		payload = JSON.parse(raw);
	} catch {
		throw new Error(`Buzz QA credential file ${resolvedPath} is not valid JSON.`);
	}
	return parseBuzzQaCredentialPayload(payload);
}
//#endregion
//#region extensions/buzz/src/qa/relay-client.ts
const BUZZ_MESSAGE_KIND = 9;
const MEMBERSHIP_TIMEOUT_MS = 1e4;
const OBSERVER_READY_TIMEOUT_MS = 1e4;
async function loadBuzzQaRoomMembership(params) {
	return await new Promise((resolve, reject) => {
		let latest;
		let settled = false;
		let receivedEose = false;
		const subscriptionRef = {};
		const finish = (error) => {
			if (settled) return;
			settled = true;
			clearTimeout(timeout);
			if (receivedEose) subscriptionRef.current?.close("membership loaded");
			if (error) reject(error);
			else if (latest) resolve(latest);
			else reject(/* @__PURE__ */ new Error(`Buzz QA room ${params.roomId} has no membership roster.`));
		};
		const timeout = setTimeout(() => {
			finish(/* @__PURE__ */ new Error(`Timed out loading Buzz QA room ${params.roomId} membership.`));
			params.relay.close();
		}, MEMBERSHIP_TIMEOUT_MS);
		try {
			subscriptionRef.current = openBuzzRelaySubscription(params.relay, [{
				kinds: [BUZZ_ROOM_MEMBERSHIP_KIND],
				authors: [params.relayPublicKey],
				"#d": [params.roomId],
				limit: 1
			}], {
				onevent: (event) => {
					const membership = parseBuzzRoomMembershipEvent(event, params.relayPublicKey);
					if (membership?.roomId === params.roomId && isNewerBuzzRevision(membership, latest)) latest = membership;
				},
				oneose: () => {
					receivedEose = true;
					if (settled) subscriptionRef.current?.close("membership loaded");
					else finish();
				},
				onclose: (reason) => {
					if (reason !== "membership loaded") finish(/* @__PURE__ */ new Error(`Buzz QA membership subscription closed: ${reason}`));
				}
			});
		} catch (error) {
			finish(error instanceof Error ? error : new Error(String(error)));
			return;
		}
		if (settled && receivedEose) subscriptionRef.current.close("membership loaded");
	});
}
function assertBuzzQaMembership(membership, credentials) {
	if (!membership.members.has(credentials.driverPublicKey)) throw new Error(`Buzz QA driver ${credentials.driverPublicKey} is not a member of room ${credentials.roomId}.`);
	if (!membership.members.has(credentials.sutPublicKey) || membership.roles.get(credentials.sutPublicKey) !== "bot") throw new Error(`Buzz QA SUT ${credentials.sutPublicKey} must have the Bot role in room ${credentials.roomId}.`);
}
async function createBuzzQaRelayDriver(params) {
	const credentials = params.credentials;
	const secretKey = decodeBuzzPrivateKey(credentials.driverPrivateKey);
	const lifecycleAbort = new AbortController();
	let transportError;
	let messageQueue = Promise.resolve();
	const observedEventIds = /* @__PURE__ */ new Set();
	const { relay, relayPublicKey } = await connectAuthenticatedBuzzRelaySession({
		relayUrl: credentials.relayUrl,
		secretKey,
		authTag: parseBuzzAuthTag(credentials.driverAuthTag ?? ""),
		signal: lifecycleAbort.signal
	});
	try {
		assertBuzzQaMembership(await loadBuzzQaRoomMembership({
			relay,
			relayPublicKey,
			roomId: credentials.roomId
		}), credentials);
	} catch (error) {
		lifecycleAbort.abort(error);
		relay.close();
		throw error;
	}
	let observerReady = false;
	let resolveObserverReady;
	let rejectObserverReady;
	const observerReadyPromise = new Promise((resolve, reject) => {
		resolveObserverReady = resolve;
		rejectObserverReady = reject;
	});
	const observerReadyTimeout = setTimeout(() => {
		rejectObserverReady?.(/* @__PURE__ */ new Error("Timed out waiting for the Buzz QA message observer."));
	}, OBSERVER_READY_TIMEOUT_MS);
	let subscription;
	try {
		subscription = openBuzzRelaySubscription(relay, [{
			kinds: [BUZZ_MESSAGE_KIND],
			authors: [credentials.sutPublicKey],
			"#h": [credentials.roomId],
			since: Math.floor(Date.now() / 1e3) - 5
		}], {
			onevent: (event) => {
				if (!observerReady) return;
				if (observedEventIds.has(event.id)) return;
				observedEventIds.add(event.id);
				const message = parseBuzzMessageEvent(event);
				if (!message || message.channelId !== credentials.roomId || message.senderPubkey !== credentials.sutPublicKey) return;
				messageQueue = messageQueue.then(async () => await params.onMessage(message)).catch((error) => {
					transportError = error instanceof Error ? error : new Error(String(error));
				});
			},
			oneose: () => {
				observerReady = true;
				clearTimeout(observerReadyTimeout);
				resolveObserverReady?.();
			},
			onclose: (reason) => {
				if (!observerReady) {
					clearTimeout(observerReadyTimeout);
					rejectObserverReady?.(/* @__PURE__ */ new Error(`Buzz QA message observer closed before it was ready: ${reason}`));
					return;
				}
				if (reason !== "shutdown" && reason !== "relay connection closed by us") transportError = /* @__PURE__ */ new Error(`Buzz QA message subscription closed: ${reason}`);
			}
		});
	} catch (error) {
		clearTimeout(observerReadyTimeout);
		lifecycleAbort.abort(error);
		relay.close();
		throw error;
	}
	try {
		await observerReadyPromise;
	} catch (error) {
		lifecycleAbort.abort(error);
		relay.close();
		throw error;
	}
	return {
		assertHealthy() {
			if (transportError) throw transportError;
		},
		async sendMessage(input) {
			if (transportError) throw transportError;
			const tags = buildBuzzMessageTags({
				channelId: credentials.roomId,
				threadId: input.threadId,
				replyToId: input.replyToId
			});
			if (input.mentionSut) tags.push(["p", credentials.sutPublicKey]);
			const event = finalizeEvent({
				kind: BUZZ_MESSAGE_KIND,
				content: input.text,
				created_at: Math.floor(Date.now() / 1e3),
				tags
			}, secretKey);
			await relay.publish(event);
			return {
				eventId: event.id,
				timestamp: event.created_at * 1e3
			};
		},
		async close() {
			lifecycleAbort.abort(/* @__PURE__ */ new Error("Buzz QA relay driver closed"));
			subscription.close("shutdown");
			relay.close();
			await messageQueue;
		}
	};
}
//#endregion
//#region extensions/buzz/src/qa/adapter.runtime.ts
const BUZZ_GATEWAY_ACCOUNT_ID = "default";
const BUZZ_MESSAGE_ID_MAPPING_TIMEOUT_MS = 5e3;
function isBuzzMention(text) {
	return /(^|\s)@openclaw\b/iu.test(text);
}
async function waitForBuzzChannelRunning(params) {
	const timeoutMs = params.timeoutMs ?? 6e4;
	const pollIntervalMs = params.pollIntervalMs ?? 500;
	const startedAt = Date.now();
	let lastStatus;
	while (Date.now() - startedAt < timeoutMs) {
		const status = (await params.gateway.call("channels.status", {
			probe: false,
			timeoutMs: 2e3
		}, { timeoutMs: 5e3 })).channelAccounts?.buzz?.find((entry) => entry.accountId === params.accountId);
		lastStatus = status;
		if (status?.running === true && status.restartPending !== true) return;
		await setTimeout$1(pollIntervalMs);
	}
	throw new Error(`buzz account "${params.accountId}" did not become ready; last status: ${JSON.stringify(lastStatus)}`);
}
async function createBuzzQaTransportAdapter(context) {
	const options = context.adapterOptions ?? {};
	const credentialFile = options.credentialFile?.trim();
	const requestedCredentialSource = options.credentialSource?.trim().toLowerCase() || (credentialFile ? "file" : void 0);
	if (requestedCredentialSource !== void 0 && requestedCredentialSource !== "file" && requestedCredentialSource !== "convex") throw new Error("Buzz QA credential source must be \"file\" or \"convex\".");
	if (requestedCredentialSource === "file" && !credentialFile) throw new Error("Buzz QA file credentials require --credential-file <path>.");
	if (requestedCredentialSource === "file" && options.credentialRole?.trim()) throw new Error("Buzz QA --credential-role is only valid with --credential-source convex.");
	if (requestedCredentialSource === "convex" && credentialFile) throw new Error("Buzz QA --credential-file cannot be combined with --credential-source convex.");
	const fileCredentials = requestedCredentialSource === "file" && credentialFile ? await readBuzzQaCredentialFile({
		filePath: credentialFile,
		repoRoot: options.repoRoot
	}) : void 0;
	const lease = await context.credentials.acquire({
		kind: "buzz",
		source: requestedCredentialSource === "file" ? "env" : requestedCredentialSource,
		role: options.credentialRole,
		resolveEnvPayload: () => {
			if (!fileCredentials) throw new Error("Buzz QA file credentials are unavailable.");
			return fileCredentials;
		},
		parsePayload: parseBuzzQaCredentialPayload
	});
	const heartbeat = context.credentials.startHeartbeat(lease);
	const credentials = lease.payload;
	const accountId = options.sutAccountId?.trim() || "sut";
	const nativeMessageIds = /* @__PURE__ */ new Map();
	const busMessageIds = /* @__PURE__ */ new Map();
	let logicalConversationId = credentials.roomId;
	let logicalConversationKind = "group";
	let relayDriver;
	const resolveBusMessageId = async (nativeId) => {
		if (!nativeId) return;
		const startedAt = Date.now();
		while (Date.now() - startedAt < BUZZ_MESSAGE_ID_MAPPING_TIMEOUT_MS) {
			const busId = busMessageIds.get(nativeId);
			if (busId) return busId;
			await setTimeout$1(10);
		}
		throw new Error(`Buzz QA could not resolve the portable id for native message ${nativeId}.`);
	};
	const recordOutbound = async (message) => {
		const [threadId, replyToId] = await Promise.all([resolveBusMessageId(message.threadId), resolveBusMessageId(message.replyToId)]);
		const outbound = await context.messages.addOutboundMessage({
			accountId,
			to: `${logicalConversationKind}:${logicalConversationId}`,
			senderId: credentials.sutPublicKey,
			text: message.text,
			timestamp: message.createdAt * 1e3,
			threadId,
			replyToId
		});
		nativeMessageIds.set(outbound.id, message.id);
		busMessageIds.set(message.id, outbound.id);
	};
	try {
		relayDriver = await createBuzzQaRelayDriver({
			credentials,
			onMessage: recordOutbound
		});
	} catch (error) {
		try {
			await heartbeat.stop();
		} finally {
			await lease.release();
		}
		throw error;
	}
	return {
		id: "buzz",
		label: "Buzz live",
		accountId,
		requiredPluginIds: ["buzz"],
		supportedActions: [],
		assertTransportHealthy() {
			heartbeat.throwIfFailed();
			relayDriver.assertHealthy();
		},
		async sendInbound(input) {
			heartbeat.throwIfFailed();
			relayDriver.assertHealthy();
			logicalConversationId = input.conversation.id;
			logicalConversationKind = input.conversation.kind;
			const sent = await relayDriver.sendMessage({
				text: input.text,
				mentionSut: isBuzzMention(input.text),
				...input.threadId ? { threadId: nativeMessageIds.get(input.threadId) } : {},
				...input.replyToId ? { replyToId: nativeMessageIds.get(input.replyToId) } : {}
			});
			const inbound = await context.messages.addInboundMessage({
				...input,
				accountId,
				senderId: credentials.driverPublicKey,
				timestamp: sent.timestamp
			});
			nativeMessageIds.set(inbound.id, sent.eventId);
			busMessageIds.set(sent.eventId, inbound.id);
			return inbound;
		},
		resetTransport() {
			logicalConversationId = credentials.roomId;
			logicalConversationKind = "group";
			nativeMessageIds.clear();
			busMessageIds.clear();
		},
		createGatewayConfig: () => ({ channels: { buzz: {
			enabled: true,
			relayUrl: credentials.relayUrl,
			privateKey: credentials.sutPrivateKey,
			...credentials.sutAuthTag ? { authTag: credentials.sutAuthTag } : {},
			groupPolicy: "allowlist",
			groupAllowFrom: [credentials.driverPublicKey],
			groups: { [credentials.roomId]: {
				enabled: true,
				requireMention: options.transportPolicy?.requireGroupMention ?? true
			} },
			defaultTo: buildBuzzTarget(credentials.roomId)
		} } }),
		waitReady: async ({ gateway, timeoutMs, pollIntervalMs }) => await waitForBuzzChannelRunning({
			accountId: BUZZ_GATEWAY_ACCOUNT_ID,
			gateway,
			timeoutMs,
			pollIntervalMs
		}),
		buildAgentDelivery: () => ({
			channel: "buzz",
			to: buildBuzzTarget(credentials.roomId),
			replyChannel: "buzz",
			replyTo: buildBuzzTarget(credentials.roomId)
		}),
		async handleAction() {
			throw new Error("Buzz live QA adapter does not implement transport actions");
		},
		createReportNotes: () => ["Runs through a real authenticated Buzz relay room; credential values are omitted."],
		async cleanup() {
			await relayDriver.close();
		},
		async cleanupAfterGatewayStop() {
			try {
				await heartbeat.stop();
			} finally {
				await lease.release();
			}
		}
	};
}
//#endregion
export { createBuzzQaTransportAdapter };
