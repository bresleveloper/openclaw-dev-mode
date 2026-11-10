import { j as validateAgentRunDelegatedAuthority, n as captureAgentRunDelegatedSourceAssertion, u as getAgentRunContext } from "./agent-run-registry-gmaPgO-n.mjs";
import { o as composeSessionSourceAssertion } from "./session-source-authority-fdILH-PW.mjs";
//#region src/infra/agent-run-terminal-writes.ts
const terminalWrites = /* @__PURE__ */ new WeakMap();
const operationalTerminalWrites = /* @__PURE__ */ new WeakMap();
function prepareTerminalWrites(owner, instance) {
	let current = terminalWrites.get(owner);
	const retained = operationalTerminalWrites.get(instance);
	if (retained && current !== retained || owner.delegatedAuthority && owner.delegatedAuthority.operationalRunInstance !== instance) throw new Error("Terminal write settlement owner changed");
	if (!current || current.instance !== instance) {
		current = {
			instance,
			pending: /* @__PURE__ */ new Set()
		};
		terminalWrites.set(owner, current);
	}
	operationalTerminalWrites.set(instance, current);
	return current;
}
/** Register settlement before a projected turn can fail prior to runtime admission. */
function bindAgentRunTerminalWriteSettlement(instance) {
	const owner = getAgentRunContext(instance.runId);
	if (owner) prepareTerminalWrites(owner, instance);
}
function trackTerminalWrite(current, persistence) {
	current.pending.add(persistence);
	const settled = () => current.pending.delete(persistence);
	persistence.then(settled, settled);
}
/** Capture accepted-work settlement independently of permission to perform a write. */
function captureAgentRunTerminalPersistence(runId) {
	const writeContext = captureAgentRunTerminalWriteContext(runId);
	const owner = getAgentRunContext(runId);
	const current = owner ? terminalWrites.get(owner) : void 0;
	return {
		writeContext,
		track: writeContext?.track ?? (current ? (persistence) => trackTerminalWrite(current, persistence) : void 0)
	};
}
/** Bind a prepared runtime's write context to its exact live operational owner. */
function bindAgentRunTerminalWriteContext(authority, context) {
	const owner = getAgentRunContext(authority.operationalRunInstance.runId);
	if (owner?.delegatedAuthority !== authority || !validateAgentRunDelegatedAuthority(authority)) throw new Error("Terminal write owner is no longer active");
	const current = prepareTerminalWrites(owner, authority.operationalRunInstance);
	current.authority = authority;
	current.context = context;
}
/** A new fallback candidate cannot borrow the preceding runtime's account context. */
function clearAgentRunTerminalWriteContext(instance) {
	const owner = getAgentRunContext(instance.runId);
	const current = owner ? terminalWrites.get(owner) : void 0;
	if (current?.instance === instance) current.context = void 0;
}
/** Capture before async session resolution; a replaced candidate revokes this exact capture. */
function captureAgentRunTerminalWriteContext(runId) {
	const owner = getAgentRunContext(runId);
	const authority = owner?.delegatedAuthority;
	if (!owner || !authority) return;
	const refuse = () => {
		throw new Error("Terminal write owner changed before commit");
	};
	const source = captureAgentRunDelegatedSourceAssertion(authority, refuse);
	if (!source) return;
	const current = prepareTerminalWrites(owner, authority.operationalRunInstance);
	current.authority ??= authority;
	if (current.authority !== authority) return;
	const captured = current;
	const context = captured.context;
	const assertBinding = () => {
		if (getAgentRunContext(runId) !== owner || terminalWrites.get(owner) !== captured || captured.context !== context || owner.delegatedAuthority !== captured.authority || captured.authority !== authority) refuse();
		source.assertBinding();
	};
	return {
		assertCurrent: composeSessionSourceAssertion([source.assertCurrent], (assertSource) => {
			assertBinding();
			assertSource();
		}),
		run: (write) => {
			assertBinding();
			return context ? context.run(write) : write();
		},
		track: (persistence) => trackTerminalWrite(captured, persistence)
	};
}
/** Normal completion joins accepted terminal writes; explicit authority close stays immediate. */
async function drainAgentRunTerminalWrites(instance) {
	const current = operationalTerminalWrites.get(instance);
	if (current) while (current.pending.size > 0) await Promise.allSettled(current.pending);
}
//#endregion
export { drainAgentRunTerminalWrites as a, clearAgentRunTerminalWriteContext as i, bindAgentRunTerminalWriteSettlement as n, captureAgentRunTerminalPersistence as r, bindAgentRunTerminalWriteContext as t };
