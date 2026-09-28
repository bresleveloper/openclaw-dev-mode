import { s as registerSecretValueForRedaction } from "./secret-redaction-registry-CKxLTepq.mjs";
import { n as NODE_DESKTOP_STREAM_COMMAND } from "./node-desktop-stream-BZM2AiRA.mjs";
import { l as resolveNodeCommandAllowlist, o as isNodeCommandAllowed } from "./node-command-policy-CnGfXM76.mjs";
import { t as DesktopCredentialsRequiredError } from "./host-source-errors-46uOYNUn.mjs";
import { r as mintDesktopObserverToken } from "./observe-bridge-DK60MrDW.mjs";
//#region src/gateway/desktop/node-source.ts
/** Combines node command policy, ticket redemption, and desktop session ownership. */
function createNodeDesktopService(params) {
	const ownerEpochs = /* @__PURE__ */ new Map();
	const sessions = /* @__PURE__ */ new Map();
	const commandAllowed = (node) => isNodeCommandAllowed({
		command: NODE_DESKTOP_STREAM_COMMAND,
		declaredCommands: node.commands,
		allowlist: resolveNodeCommandAllowlist(params.getConfig(), node)
	}).ok;
	const stopNode = (nodeId) => params.desktopRegistry.stop(`node:${nodeId}`);
	const ensureSession = async (request) => {
		const sourceKey = `node:${request.nodeId}`;
		const current = sessions.get(request.nodeId);
		if (current?.connId === request.connId && current.pairingGeneration === request.pairingGeneration) {
			await params.desktopRegistry.activate({
				sourceKey,
				ownerEpoch: current.ownerEpoch
			});
			return current;
		}
		const ownerEpoch = (ownerEpochs.get(request.nodeId) ?? 0) + 1;
		ownerEpochs.set(request.nodeId, ownerEpoch);
		const session = {
			connId: request.connId,
			pairingGeneration: request.pairingGeneration,
			ownerEpoch,
			active: /* @__PURE__ */ new Set()
		};
		sessions.set(request.nodeId, session);
		try {
			await params.desktopRegistry.activate({
				sourceKey,
				ownerEpoch,
				teardown: async () => {
					if (sessions.get(request.nodeId) === session) sessions.delete(request.nodeId);
					await Promise.all([...session.active].map((active) => active.stop()));
					session.active.clear();
				}
			});
			return session;
		} catch (error) {
			if (sessions.get(request.nodeId) === session) sessions.delete(request.nodeId);
			throw error;
		}
	};
	return {
		stopNode,
		async reconcileRuntimePolicy() {
			await Promise.all([...sessions].map(async ([nodeId, session]) => {
				const node = params.nodeRegistry.get(nodeId);
				if (!node || node.connId !== session.connId || node.pairingGeneration !== session.pairingGeneration || !commandAllowed(node)) await stopNode(nodeId);
			}));
		},
		async observe(request) {
			const node = params.nodeRegistry.get(request.nodeId);
			if (!node?.pairingGeneration) throw new Error("node desktop is unavailable; reconnect and approve the node capability");
			const pairingGeneration = node.pairingGeneration;
			const isRequesterCurrent = () => !request.requester?.signal?.aborted && request.requester?.isCurrent() !== false;
			const isAuthorized = () => params.nodeRegistry.get(request.nodeId) === node && node.pairingGeneration === pairingGeneration && commandAllowed(node);
			const assertAuthorized = () => {
				if (!isRequesterCurrent()) throw new Error("Desktop observer connection is no longer current");
				if (!isAuthorized()) throw new Error("node desktop is unavailable; enable Desktop Sharing on the node, approve its capability request, and check gateway.nodes.commands.deny");
			};
			assertAuthorized();
			const sourceKey = `node:${request.nodeId}`;
			const session = await ensureSession({
				nodeId: request.nodeId,
				connId: node.connId,
				pairingGeneration
			});
			assertAuthorized();
			const active = params.desktopRegistry.createStream({
				sourceKey,
				ownerEpoch: session.ownerEpoch,
				onStopped: () => {
					session.active.delete(active);
				}
			});
			if (!active.reserve()) throw new Error("node desktop observer limit reached");
			const signal = request.requester?.signal ? AbortSignal.any([active.signal, request.requester.signal]) : active.signal;
			session.active.add(active);
			try {
				const ticket = params.streamBroker.mint({
					nodeId: request.nodeId,
					connId: node.connId,
					pairingGeneration
				});
				const attached = await active.connect(ticket, () => params.nodeRegistry.invoke({
					nodeId: request.nodeId,
					expectedConnId: node.connId,
					expectedPairingGeneration: pairingGeneration,
					command: NODE_DESKTOP_STREAM_COMMAND,
					params: {
						ticket: ticket.ticket,
						attachPath: ticket.attachPath
					},
					timeoutMs: 0,
					onProgress: () => {},
					signal,
					isDispatchAuthorized: () => !active.stopped && sessions.get(request.nodeId) === session && isRequesterCurrent() && isAuthorized()
				}));
				if (active.stopped || sessions.get(request.nodeId) !== session) {
					attached.stream.destroy();
					throw new Error("node desktop session was superseded before attachment");
				}
				assertAuthorized();
				let preauth;
				if (attached.auth === "vnc-password") {
					const password = attached.vncPassword ?? request.credentials?.password;
					if (!password) throw new DesktopCredentialsRequiredError("vnc-password", "VNC password is required to observe this node");
					registerSecretValueForRedaction(password);
					preauth = {
						auth: attached.auth,
						credentials: { password }
					};
				} else {
					const username = request.credentials?.username?.trim() ?? "";
					const password = request.credentials?.password ?? "";
					if (!username || !password) throw new DesktopCredentialsRequiredError("ard-account", "macOS account credentials are required to observe this node");
					registerSecretValueForRedaction(password);
					preauth = {
						auth: attached.auth,
						credentials: {
							username,
							password
						}
					};
				}
				const attachment = active.publish();
				if (!attachment) throw new Error("node desktop session was superseded before publication");
				const minted = mintDesktopObserverToken({
					sourceKey,
					ownerEpoch: session.ownerEpoch,
					control: request.control,
					requester: request.requester,
					attachment,
					preauth,
					onAbandon: active.stop
				});
				active.expireAt(minted.expiresAtMs);
				return {
					transport: "rfb",
					wsPath: `/desktop/observe?token=${minted.token}`,
					expiresAtMs: minted.expiresAtMs,
					control: request.control,
					auth: attached.auth,
					preauthenticated: true
				};
			} catch (error) {
				await active.stop();
				throw error;
			}
		}
	};
}
//#endregion
export { createNodeDesktopService };
