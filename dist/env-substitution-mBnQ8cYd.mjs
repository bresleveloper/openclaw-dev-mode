import { t as appendConfigPathSegment } from "./dot-path-CVD5Jolm.mjs";
import { t as isPlainObject } from "./plain-object-BFvGATnd.mjs";
import { p as parseEnvTemplateSecretRef } from "./types.secrets-DsPRn9Dz.mjs";
//#region src/config/env-substitution.ts
const ENV_VAR_NAME_PATTERN = /^[A-Z_][A-Z0-9_]*$/;
const DEFAULT_VALUE_OPERATOR = ":-";
/** Error thrown when a config value references a missing or empty environment variable. */
var MissingEnvVarError = class extends Error {
	constructor(varName, configPath) {
		super(`Missing env var "${varName}" referenced at config path: ${configPath}`);
		this.varName = varName;
		this.configPath = configPath;
		this.name = "MissingEnvVarError";
	}
};
/** Rebuilds the authored placeholder text for a parsed token. */
function renderEnvTemplateToken(token) {
	return token.defaultValue === void 0 ? `\${${token.name}}` : `\${${token.name}${DEFAULT_VALUE_OPERATOR}${token.defaultValue}}`;
}
/** Shares the substitution grammar with write-back preservation, in authoring order. */
function scanEnvTemplateTokens(value) {
	return Array.from(iterateEnvTemplateTokens(value), (token) => ({
		kind: token.kind,
		name: token.name,
		defaultValue: token.defaultValue
	}));
}
function* iterateEnvTemplateTokens(value) {
	for (let index = value.indexOf("$"); index !== -1; index = value.indexOf("$", index + 1)) {
		const escaped = value[index + 1] === "$" && value[index + 2] === "{";
		if (!escaped && value[index + 1] !== "{") continue;
		const start = index + (escaped ? 3 : 2);
		const end = value.indexOf("}", start);
		if (end === -1) continue;
		const body = value.slice(start, end);
		const operatorIndex = body.indexOf(DEFAULT_VALUE_OPERATOR);
		const name = operatorIndex === -1 ? body : body.slice(0, operatorIndex);
		const defaultValue = operatorIndex === -1 ? void 0 : body.slice(operatorIndex + 2);
		if (!ENV_VAR_NAME_PATTERN.test(name) || defaultValue?.includes("$") || defaultValue?.includes("{")) continue;
		yield {
			kind: escaped ? "escaped" : "substitution",
			name,
			defaultValue,
			start: index,
			end
		};
		index = end;
	}
}
function substituteString(value, env, configPath, opts) {
	if (!value.includes("$")) return value;
	const authoredRef = parseEnvTemplateSecretRef(value);
	if (authoredRef && !containsEnvVarReference(value)) opts?.onPendingEnvSecretRef?.(authoredRef.id, configPath);
	const chunks = [];
	let end = 0;
	for (const token of iterateEnvTemplateTokens(value)) {
		chunks.push(value.slice(end, token.start));
		end = token.end + 1;
		if (token.kind === "escaped") {
			chunks.push(renderEnvTemplateToken(token));
			continue;
		}
		const envValue = env[token.name];
		if (envValue === void 0 || envValue === "") {
			if (token.defaultValue !== void 0) {
				chunks.push(token.defaultValue);
				continue;
			}
			if (opts?.onMissing) {
				opts.onMissing({
					varName: token.name,
					configPath
				});
				if (authoredRef?.id === token.name) opts.onPendingEnvSecretRef?.(token.name, configPath);
				chunks.push(renderEnvTemplateToken(token));
				continue;
			}
			throw new MissingEnvVarError(token.name, configPath);
		}
		if (authoredRef?.id === token.name) opts?.onResolvedEnvSecretRef?.(token.name, configPath);
		chunks.push(envValue);
	}
	chunks.push(value.slice(end));
	return chunks.join("");
}
/** Detects unescaped `${VAR}` references without treating escaped `$${VAR}` as references. */
function containsEnvVarReference(value) {
	for (const token of iterateEnvTemplateTokens(value)) if (token.kind === "substitution") return true;
	return false;
}
/** Resolve config string templates, preserving unresolved text when onMissing is supplied. */
function resolveConfigEnvVars(value, env = process.env, opts) {
	const pending = [];
	const visit = (current, currentPath) => {
		if (typeof current === "string") return substituteString(current, env, currentPath, opts);
		if (Array.isArray(current)) {
			const length = current.length;
			const result = [];
			result.length = length;
			let index = 0;
			pending.push(() => {
				while (index < length) {
					const key = index++;
					if (key in current) {
						result[key] = visit(current[key], `${currentPath}[${key}]`);
						return true;
					}
				}
				return false;
			});
			return result;
		}
		if (isPlainObject(current)) {
			const result = {};
			const entries = Object.entries(current)[Symbol.iterator]();
			pending.push(() => {
				const entry = entries.next();
				if (entry.done) return false;
				const [key, child] = entry.value;
				result[key] = visit(child, appendConfigPathSegment(currentPath, key));
				return true;
			});
			return result;
		}
		return current;
	};
	const result = visit(value, "");
	for (let next = pending.at(-1); next; next = pending.at(-1)) if (!next()) pending.pop();
	return result;
}
//#endregion
export { scanEnvTemplateTokens as i, containsEnvVarReference as n, resolveConfigEnvVars as r, MissingEnvVarError as t };
