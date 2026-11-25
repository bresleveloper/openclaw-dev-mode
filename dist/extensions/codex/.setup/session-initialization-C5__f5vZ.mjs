import { s as validateBindingForWrite } from "./session-binding-record-codec-I8YXPEq3.mjs";
import "./session-binding-_y0fotvm.mjs";
import { createNativeSessionInitializationOwner } from "openclaw/plugin-sdk/agent-harness-session-runtime";
// extensions/codex/src/app-server/session-initialization.ts
const { prepare: prepareCodexSessionInitialization, getRollback: getCodexSessionInitializationRollback } = createNativeSessionInitializationOwner({
	validateBinding: validateBindingForWrite,
	writeBinding: (store, identity, binding, assertCurrent) => store.mutate(identity, {
		kind: "set",
		if: { kind: "absent" },
		binding
	}, assertCurrent),
	errors: {
		linkChanged: "Codex initialization link changed before cleanup",
		bindingChanged: "Codex session binding changed during initialization",
		linkWriteFailed: "Codex initialization link could not be persisted",
		ownerChanged: "Codex initialization binding owner changed before rollback"
	}
});
export { prepareCodexSessionInitialization as n, getCodexSessionInitializationRollback as t };
