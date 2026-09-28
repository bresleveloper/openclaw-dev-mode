import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { t as quoteCliArg } from "./quote-cli-arg-BEt71TUh.mjs";
//#region src/cli/pairing-command-format.ts
/** Format an exact-request approval hint; callers keep token/password flags in reminders. */
function formatPairingApproveCommand(group, requestId, opts = {}) {
	const args = [
		"openclaw",
		group,
		"approve",
		requestId
	];
	const url = normalizeOptionalString(opts.url);
	if (url) args.push("--url", url);
	const timeout = normalizeOptionalString(opts.timeout);
	if (timeout && timeout !== "10000") args.push("--timeout", timeout);
	if (opts.json === true) args.push("--json");
	return formatCliCommand(args.map(quoteCliArg).join(" "));
}
//#endregion
export { formatPairingApproveCommand as t };
