import { O as validateAgentRunDelegatedAuthority, c as getAgentRunContext } from "./agent-run-registry-DO6Dg2r0.mjs";
//#region src/infra/agent-run-terminal-writes.ts
const terminalWrites = /* @__PURE__ */ new WeakMap();
/** Bind a prepared runtime's write context to its exact live operational owner. */
function bindAgentRunTerminalWriteContext(authority, context) {
	const owner = getAgentRunContext(authority.operationalRunInstance.runId);
	if (owner?.delegatedAuthority !== authority || !validateAgentRunDelegatedAuthority(authority)) throw new Error("Terminal write owner is no longer active");
	const current = terminalWrites.get(owner);
	if (current?.authority === authority) current.context = context;
	else terminalWrites.set(owner, {
		authority,
		context,
		pending: /* @__PURE__ */ new Set()
	});
}
/** A new fallback candidate cannot borrow the preceding runtime's account context. */
function clearAgentRunTerminalWriteContext(instance) {
	const owner = getAgentRunContext(instance.runId);
	const current = owner ? terminalWrites.get(owner) : void 0;
	if (current?.authority.operationalRunInstance === instance) current.context = void 0;
}
/** Capture before async session resolution; a replaced candidate revokes this exact capture. */
function captureAgentRunTerminalWriteContext(runId) {
	const owner = getAgentRunContext(runId);
	const authority = owner?.delegatedAuthority;
	if (!owner || !authority || !validateAgentRunDelegatedAuthority(authority)) return;
	let current = terminalWrites.get(owner);
	if (!current) {
		current = {
			authority,
			pending: /* @__PURE__ */ new Set()
		};
		terminalWrites.set(owner, current);
	}
	if (current.authority !== authority) return;
	const captured = current;
	const context = captured.context;
	const assertCurrent = () => {
		if (getAgentRunContext(runId) !== owner || terminalWrites.get(owner) !== captured || captured.context !== context || owner.delegatedAuthority !== captured.authority || !validateAgentRunDelegatedAuthority(captured.authority)) throw new Error("Terminal write owner changed before commit");
	};
	return {
		assertCurrent,
		run: (write) => {
			assertCurrent();
			return context ? context.run(write) : write();
		},
		track: (persistence) => {
			captured.pending.add(persistence);
			const settled = () => captured.pending.delete(persistence);
			persistence.then(settled, settled);
		}
	};
}
/** Normal completion joins accepted terminal writes; explicit authority close stays immediate. */
async function drainAgentRunTerminalWrites(instance) {
	const owner = getAgentRunContext(instance.runId);
	const current = owner ? terminalWrites.get(owner) : void 0;
	if (current?.authority.operationalRunInstance === instance) while (current.pending.size > 0) await Promise.allSettled(current.pending);
}
//#endregion
export { drainAgentRunTerminalWrites as i, captureAgentRunTerminalWriteContext as n, clearAgentRunTerminalWriteContext as r, bindAgentRunTerminalWriteContext as t };
