import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { t as ownedWorkerBytes } from "./worker-transfer-bytes-D_DP0IHa.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/agents/worktrees/errors.ts
var WorktreeRepositoryError = class extends Error {
	constructor(message, options) {
		super(message, options);
		this.name = "WorktreeRepositoryError";
	}
};
//#endregion
//#region src/infra/git-worker-context.ts
const context = new AsyncLocalStorage();
const errorOrigins = /* @__PURE__ */ new WeakMap();
function serializeGitWorkerFailure(error) {
	const code = asOptionalRecord(error)?.code;
	return {
		name: error instanceof Error ? error.name : "Error",
		message: error instanceof Error ? error.message : String(error),
		...typeof code === "string" || typeof code === "number" ? { code } : {},
		...error instanceof Error && errorOrigins.has(error) ? { origin: errorOrigins.get(error) } : {}
	};
}
function restoreGitWorkerFailure(failure) {
	const error = failure.name === "WorktreeRepositoryError" ? new WorktreeRepositoryError(failure.message) : new Error(failure.message);
	error.name = failure.name;
	if (failure.code !== void 0) Object.assign(error, { code: failure.code });
	if (failure.origin !== void 0) errorOrigins.set(error, failure.origin);
	return error;
}
function hasGitWorkerContext() {
	return context.getStore() !== void 0;
}
function canReadGitFilesystemRefs() {
	return context.getStore()?.filesystemRefs === true;
}
async function withGitWorkerContext(channel, operation, filesystemRefs = false) {
	const state = {
		channel,
		filesystemRefs,
		pending: [],
		closed: false
	};
	return await context.run(state, async () => {
		try {
			return await operation();
		} finally {
			state.closed = true;
			await state.drain;
		}
	});
}
async function requestHost(request) {
	const state = context.getStore();
	if (!state || state.closed) throw new Error("Git operation requires its worker host");
	const transfers = [];
	if (request.type === "workspace.inventory.write") {
		const bytes = ownedWorkerBytes(request.input.bytes);
		request.input.bytes = bytes;
		transfers.push(bytes.buffer);
	}
	if ((request.type === "git.text" || request.type === "git.buffer") && request.input.options.input instanceof Uint8Array) {
		const input = Uint8Array.from(request.input.options.input);
		request.input.options.input = input;
		transfers.push(input.buffer);
	}
	return await new Promise((resolve, reject) => {
		state.pending.push({
			request,
			transfers,
			resolve,
			reject
		});
		state.drain ??= Promise.resolve().then(() => drainHostRequests(state));
	});
}
/** Independent Git reads keep their parallelism inside the pool's serial host channel. */
async function drainHostRequests(state) {
	try {
		while (state.pending.length > 0) {
			const pending = state.pending.splice(0, 16);
			try {
				if (state.closed) throw new Error("Git operation closed before host execution");
				const batch = {
					type: "git.batch",
					input: { requests: pending.map((entry) => entry.request) }
				};
				const response = await state.channel.request(batch, pending.flatMap((entry) => entry.transfers));
				try {
					const replies = response.input;
					if (!Array.isArray(replies) || replies.length !== pending.length) throw new Error("Git host returned an incomplete batch");
					for (const [index, entry] of pending.entries()) {
						const reply = replies[index];
						if (reply.ok) entry.resolve(reply.value);
						else entry.reject(restoreGitWorkerFailure(reply.error));
					}
				} finally {
					response.consumed();
				}
			} catch (error) {
				for (const entry of pending) entry.reject(error);
			}
		}
	} finally {
		state.drain = void 0;
	}
}
async function requestGitWorkerCommand(command) {
	return await requestHost(command);
}
async function requestGitWorkerEffect(effect) {
	return await requestHost(effect);
}
//#endregion
export { restoreGitWorkerFailure as a, WorktreeRepositoryError as c, requestGitWorkerEffect as i, hasGitWorkerContext as n, serializeGitWorkerFailure as o, requestGitWorkerCommand as r, withGitWorkerContext as s, canReadGitFilesystemRefs as t };
