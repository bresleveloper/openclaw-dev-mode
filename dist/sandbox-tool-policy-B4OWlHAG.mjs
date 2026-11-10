import { y as uniqueStrings } from "./string-normalization-D6DKCpwE.mjs";
//#region src/agents/sandbox-tool-policy.ts
/**
* Converts user-facing sandbox tool policy config into the normalized runtime
* allow/deny policy object used by tool filtering.
*/
/** Provenance marker for wildcard allowlists created from `alsoAllow`. */
const IMPLICIT_ALLOW_ALL_FROM_ALSO_ALLOW = Symbol.for("openclaw.toolPolicy.implicitAllowAllFromAlsoAllow");
/** Picks the effective sandbox tool policy from allow/alsoAllow/deny config. */
function pickSandboxToolPolicy(config) {
	if (!config) return;
	const base = Array.isArray(config.allow) ? config.allow : void 0;
	const extra = Array.isArray(config.alsoAllow) ? config.alsoAllow : void 0;
	const allowFromAlsoAllowOnly = !base && extra && extra.length > 0 && !extra.some((entry) => entry.trim() === "*");
	const allow = extra?.length ? uniqueStrings([...base?.length ? base : ["*"], ...extra]) : base;
	const deny = Array.isArray(config.deny) ? config.deny : void 0;
	if (!allow && !deny) return;
	const policy = {
		allow,
		deny
	};
	if (allowFromAlsoAllowOnly) Object.defineProperty(policy, IMPLICIT_ALLOW_ALL_FROM_ALSO_ALLOW, { value: true });
	return policy;
}
//#endregion
export { pickSandboxToolPolicy as n, IMPLICIT_ALLOW_ALL_FROM_ALSO_ALLOW as t };
