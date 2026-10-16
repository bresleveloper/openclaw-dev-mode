//#region src/hooks/internal-hook-types.ts
const KNOWN_INTERNAL_HOOK_EVENT_FAMILIES = [
	"command",
	"session",
	"agent",
	"gateway",
	"message"
];
/**
* Event keys emitted by core trigger sites (see docs/automation/hooks.md
* events table — keep both in sync when adding a trigger). Hooks can also
* subscribe to a bare family key to receive every action of that family.
* Plugins can emit additional keys via the deprecated plugin-sdk/hook-runtime
* barrel, so anything outside this set is flagged as a likely typo
* (advisory), not rejected.
*/
const KNOWN_INTERNAL_HOOK_EVENT_KEYS = [
	"agent:bootstrap",
	"command:new",
	"command:reset",
	"command:stop",
	"gateway:pre-restart",
	"gateway:shutdown",
	"gateway:startup",
	"message:preprocessed",
	"message:received",
	"message:sent",
	"message:transcribed",
	"session:auto-reset",
	"session:compact:after",
	"session:compact:before",
	"session:patch"
];
function isKnownInternalHookEventKey(key) {
	return KNOWN_INTERNAL_HOOK_EVENT_KEYS.includes(key) || KNOWN_INTERNAL_HOOK_EVENT_FAMILIES.includes(key);
}
//#endregion
export { isKnownInternalHookEventKey as t };
