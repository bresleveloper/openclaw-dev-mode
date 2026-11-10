import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
import { n as RelayError, o as identityFromPrivateKey } from "./protocol-BGPlkY3T.mjs";
import { generateKeyPairSync } from "node:crypto";
//#region extensions/mcp-relay/src/state.ts
const OWNER_AUTHORITY = {
	principal: { kind: "owner" },
	ceiling: ["operator.read", "operator.write"]
};
function stateError() {
	return new RelayError("unavailable", "MCP relay state is missing or invalid. Restore a valid OpenClaw state backup before enabling the plugin again.");
}
function timestamp(value) {
	return typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
}
function parseAuthority(value) {
	const { principal, ceiling, principalLabel } = value;
	if (!isRecord(principal) || !Array.isArray(ceiling) || !ceiling.every((scope) => typeof scope === "string" && scope.length > 0) || principalLabel !== void 0 && typeof principalLabel !== "string") throw stateError();
	let parsedPrincipal;
	if (principal.kind === "owner") parsedPrincipal = { kind: "owner" };
	else if (principal.kind === "person" && typeof principal.profileId === "string" && principal.profileId.trim()) parsedPrincipal = {
		kind: "person",
		profileId: principal.profileId
	};
	else throw stateError();
	return {
		principal: parsedPrincipal,
		ceiling: [...ceiling],
		...principalLabel === void 0 ? {} : { principalLabel }
	};
}
function parseGrant(value) {
	if (!isRecord(value) || typeof value.grantId !== "string" || typeof value.clientId !== "string" || typeof value.clientName !== "string" || !timestamp(value.createdAt) || value.lastUsedAt !== void 0 && !timestamp(value.lastUsedAt)) throw stateError();
	return {
		grantId: value.grantId,
		clientId: value.clientId,
		clientName: value.clientName,
		createdAt: value.createdAt,
		...parseAuthority(value),
		...value.lastUsedAt === void 0 ? {} : { lastUsedAt: value.lastUsedAt }
	};
}
var RelayState = class {
	#store;
	#relayOrigin;
	#assertCurrent;
	#grants = /* @__PURE__ */ new Map();
	#updates = Promise.resolve();
	constructor(runtime, relayUrl, assertCurrent) {
		this.#relayOrigin = new URL(relayUrl).origin;
		this.#assertCurrent = assertCurrent;
		this.#store = runtime.state.openKeyedStoreV2({
			namespace: "mcp-relay-authority",
			maxEntries: 1101,
			overflowPolicy: "reject-new"
		}, { assertCurrent });
	}
	async initialize() {
		let identity = await this.#store.lookup("identity");
		if (identity === void 0) {
			identity = {
				relayOrigin: this.#relayOrigin,
				privateKey: generateKeyPairSync("ed25519").privateKey.export({
					type: "pkcs8",
					format: "der"
				}).toString("base64url")
			};
			await this.#store.register("identity", identity);
		}
		if (!isRecord(identity) || typeof identity.privateKey !== "string" || typeof identity.relayOrigin !== "string") throw stateError();
		if (identity.relayOrigin !== this.#relayOrigin) throw new RelayError("unavailable", `MCP relay identity is bound to ${identity.relayOrigin}. Restore the matching relayUrl in the plugin configuration.`);
		let resolvedIdentity;
		try {
			resolvedIdentity = identityFromPrivateKey(identity.privateKey);
		} catch {
			throw stateError();
		}
		this.#grants.clear();
		for (const entry of await this.#store.entries()) if (entry.key.startsWith("grant:")) {
			const grant = parseGrant(entry.value);
			this.#grants.set(grant.grantId, grant);
		}
		return resolvedIdentity;
	}
	async #update(action) {
		const update = this.#updates.then(action);
		this.#updates = update.then(() => {}, () => {});
		return update;
	}
	assertGrantCurrent(grantId) {
		if (!this.getGrant(grantId)) throw new RelayError("grant_revoked", "This connection was revoked. Run openclaw mcp-relay pair and connect again.");
	}
	getGrant(grantId) {
		this.#assertCurrent();
		return this.#grants.get(grantId);
	}
	async issue(codeHash, expiresAt, now, assertCommandCurrent, authority = OWNER_AUTHORITY) {
		await this.#store.register(`code:${codeHash}`, authority, {
			ttlMs: expiresAt - now,
			assertCurrent: assertCommandCurrent
		});
	}
	async createGrant(params, now) {
		return this.#update(async () => {
			if (this.getGrant(params.grantId)) throw new RelayError("invalid_params", "This grant ID is already connected.");
			const value = await this.#store.consume(`code:${params.codeHash}`);
			if (value === void 0) return false;
			if (!isRecord(value)) throw stateError();
			const code = parseAuthority(value);
			const grant = {
				grantId: params.grantId,
				clientId: params.client.id,
				clientName: params.client.name,
				createdAt: now,
				principal: code.principal,
				ceiling: code.ceiling,
				...code.principalLabel === void 0 ? {} : { principalLabel: code.principalLabel }
			};
			await this.#store.register(`grant:${grant.grantId}`, grant);
			this.#grants.set(grant.grantId, grant);
			return true;
		});
	}
	async approveGrant(grant, assertCommandCurrent) {
		return this.#update(async () => {
			await this.#store.register(`grant:${grant.grantId}`, grant, { assertCurrent: assertCommandCurrent });
			this.#grants.set(grant.grantId, grant);
		});
	}
	async authorize(grantId, now) {
		return this.#update(async () => {
			const grant = this.getGrant(grantId);
			if (!grant) return;
			const updated = {
				...grant,
				lastUsedAt: now
			};
			await this.#store.register(`grant:${grantId}`, updated);
			this.#grants.set(grantId, updated);
			return updated;
		});
	}
	async revoke(grantId, assertCommandCurrent) {
		return this.#update(async () => {
			const removed = await this.#store.delete(`grant:${grantId}`, { assertCurrent: assertCommandCurrent });
			this.#grants.delete(grantId);
			return removed;
		});
	}
	async grants() {
		this.#assertCurrent();
		return [...this.#grants.values()];
	}
};
//#endregion
export { RelayState };
