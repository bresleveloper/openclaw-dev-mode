import { r as consumeRootOptionToken, s as isValueToken } from "./cli-root-options-DGcy1qRg.mjs";
import { t as parseInlineOptionToken } from "./inline-option-token-Dqt7rKG4.mjs";
//#region src/cli/root-option-scan.ts
/** Walk argv once, letting callers consume custom flags before forwarding root options. */
function scanCliRootOptions(argv, visit) {
	if (argv.length < 2) return {
		ok: true,
		argv
	};
	const out = argv.slice(0, 2);
	const args = argv.slice(2);
	for (let i = 0; i < args.length; i += 1) {
		const arg = args[i];
		if (arg === void 0) continue;
		if (arg === "--") {
			out.push(arg, ...args.slice(i + 1));
			break;
		}
		const visited = visit({
			arg,
			args,
			index: i,
			out
		});
		if (visited.kind === "error") return {
			ok: false,
			error: visited.error
		};
		if (visited.kind === "handled") {
			if (visited.consumedNext) i += 1;
			continue;
		}
		const consumedRootOption = consumeRootOptionToken(args, i);
		if (consumedRootOption > 0) {
			for (let offset = 0; offset < consumedRootOption; offset += 1) {
				const token = args[i + offset];
				if (token !== void 0) out.push(token);
			}
			i += consumedRootOption - 1;
			continue;
		}
		out.push(arg);
	}
	return {
		ok: true,
		argv: out
	};
}
//#endregion
//#region src/cli/root-option-value.ts
/** Return the normalized option value and whether the next argv token was consumed. */
function takeCliRootOptionValue(raw, next) {
	const parsed = parseInlineOptionToken(raw);
	if (parsed.hasInlineValue) return {
		value: (parsed.inlineValue ?? "").trim() || null,
		consumedNext: false
	};
	const consumedNext = isValueToken(next);
	return {
		value: (consumedNext ? next.trim() : "") || null,
		consumedNext
	};
}
//#endregion
export { scanCliRootOptions as n, takeCliRootOptionValue as t };
