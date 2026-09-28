import { c as normalizeOptionalLowercaseString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { t as getChatCommands } from "./commands-registry.data-C5Im7bOZ.mjs";
//#region src/skills/discovery/chat-command-invocation.ts
const MAX_EXPLICIT_SKILL_REFERENCES = 8;
const MAX_EXPLICIT_SKILL_REFERENCE_CHARS = 512;
const MAX_EXPLICIT_SKILL_INSTRUCTION_CHARS = 1e3;
function skillCommandsToExplicitSelections(skills) {
	return skills.flatMap((skill) => skill.skillFile ? [{
		name: skill.name,
		path: skill.skillFile
	}] : []);
}
function mergeExplicitSkillSelections(...groups) {
	const merged = /* @__PURE__ */ new Map();
	for (const selection of groups.flatMap((group) => group ?? [])) merged.set(`${selection.name}\0${selection.path}`, selection);
	return merged.size > 0 ? [...merged.values()] : void 0;
}
/** Lists slash command names reserved by built-in chat commands and callers. */
function listReservedChatSlashCommandNames(extraNames = []) {
	const reserved = /* @__PURE__ */ new Set();
	for (const command of getChatCommands()) {
		if (command.nativeName) reserved.add(normalizeOptionalLowercaseString(command.nativeName) ?? "");
		for (const alias of command.textAliases) {
			const trimmed = alias.trim();
			if (!trimmed.startsWith("/")) continue;
			reserved.add(normalizeLowercaseStringOrEmpty(trimmed.slice(1)));
		}
	}
	for (const name of extraNames) {
		const trimmed = normalizeOptionalLowercaseString(name);
		if (trimmed) reserved.add(trimmed);
	}
	return reserved;
}
function normalizeSkillCommandLookup(value) {
	return (normalizeOptionalLowercaseString(value) ?? "").replace(/[\s_]+/g, "-");
}
function findSkillCommand(skillCommands, rawName) {
	const trimmed = rawName.trim();
	if (!trimmed) return;
	const lowered = normalizeOptionalLowercaseString(trimmed) ?? "";
	const normalized = normalizeSkillCommandLookup(trimmed);
	return skillCommands.find((entry) => {
		if (normalizeOptionalLowercaseString(entry.name) === lowered) return true;
		if (normalizeOptionalLowercaseString(entry.skillName) === lowered) return true;
		return normalizeSkillCommandLookup(entry.name) === normalized || normalizeSkillCommandLookup(entry.skillName) === normalized;
	});
}
function skillReferenceMatches(text) {
	return text.matchAll(/\$([-a-zA-Z0-9_:]+)/gu);
}
function isEscapedReference(text, index) {
	let backslashes = 0;
	for (let cursor = index - 1; cursor >= 0 && text[cursor] === "\\"; cursor -= 1) backslashes += 1;
	return backslashes % 2 === 1;
}
function isShellVariableReference(name) {
	return !/[a-z]/u.test(name);
}
function* skillReferenceNames(text) {
	for (const match of skillReferenceMatches(text)) {
		const name = match[1]?.replace(/:+$/gu, "");
		const index = match.index;
		if (name && index !== void 0 && !isEscapedReference(text, index) && !isShellVariableReference(name)) yield name;
	}
}
/** Returns true when text may contain an explicit `$skill-name` reference. */
function hasSkillReferenceCandidate(text) {
	return !skillReferenceNames(text).next().done;
}
function resolveSkillCommandInvocation(params) {
	const trimmed = params.commandBodyNormalized.trim();
	if (trimmed.startsWith("/")) {
		const match = trimmed.match(/^\/([^\s]+)(?:\s+([\s\S]+))?$/);
		if (!match) return null;
		const commandName = normalizeOptionalLowercaseString(match[1]);
		if (!commandName) return null;
		if (commandName === "skill") {
			const remainder = match[2]?.trim();
			if (!remainder) return null;
			const skillMatch = remainder.match(/^([^\s]+)(?:\s+([\s\S]+))?$/);
			if (!skillMatch) return null;
			const skillCommand = findSkillCommand(params.skillCommands, skillMatch[1] ?? "");
			if (!skillCommand) return null;
			return {
				command: skillCommand,
				args: skillMatch[2]?.trim() || void 0
			};
		}
		const command = params.skillCommands.find((entry) => normalizeOptionalLowercaseString(entry.name) === commandName);
		if (command) return {
			command,
			args: match[2]?.trim() || void 0
		};
	}
	return null;
}
function expandBundleCommandPromptTemplate(template, args) {
	const normalizedArgs = args?.trim() ?? "";
	const rendered = template.includes("$ARGUMENTS") ? template.replaceAll("$ARGUMENTS", () => normalizedArgs) : template;
	if (!normalizedArgs || template.includes("$ARGUMENTS")) return rendered.trim();
	return `${rendered.trim()}\n\nUser input:\n${normalizedArgs}`;
}
/** Expands model-routed skill references while leaving unknown slash commands untouched. */
function expandExplicitSkillReferences(params) {
	const leadingSlash = params.text.trimStart().startsWith("/");
	const leadingInvocation = leadingSlash ? resolveSkillCommandInvocation({
		commandBodyNormalized: params.text,
		skillCommands: params.skillCommands
	}) : null;
	if (leadingInvocation?.command.promptTemplate) return {
		body: expandBundleCommandPromptTemplate(leadingInvocation.command.promptTemplate, leadingInvocation.args),
		skills: [leadingInvocation.command]
	};
	const available = [];
	const allCommands = params.allSkillCommands ?? params.skillCommands;
	let unavailable;
	if (leadingSlash) {
		if (leadingInvocation) available.push(leadingInvocation.command);
		else if (allCommands !== params.skillCommands) unavailable = resolveSkillCommandInvocation({
			commandBodyNormalized: params.text,
			skillCommands: allCommands
		})?.command;
	} else {
		const seen = /* @__PURE__ */ new Set();
		for (const name of skillReferenceNames(params.text)) {
			const command = findSkillCommand(params.skillCommands, name);
			if (command) {
				if (!command.promptTemplate && !seen.has(command.name)) {
					seen.add(command.name);
					available.push(command);
				}
			} else if (allCommands !== params.skillCommands) {
				unavailable = findSkillCommand(allCommands, name);
				if (unavailable) break;
			}
		}
	}
	const error = unavailable ? `Skill "${unavailable.skillName}" is not available for this agent. Update the skill allowlist or choose an allowed skill.` : available.length > MAX_EXPLICIT_SKILL_REFERENCES ? `Too many skill references. Use at most ${MAX_EXPLICIT_SKILL_REFERENCES} skills in one message.` : void 0;
	if (error) return {
		body: params.text,
		error,
		skills: []
	};
	if (available.length === 0) return {
		body: params.text,
		skills: []
	};
	const referenceLines = available.map((skill) => skill.modelVisible === false && skill.skillFile ? `- ${skill.skillName} (SKILL.md: ${skill.skillFile})` : `- ${skill.skillName}`);
	if (referenceLines.some((line) => line.length > MAX_EXPLICIT_SKILL_REFERENCE_CHARS)) return {
		body: params.text,
		error: `Skill reference metadata is too long. Keep each rendered reference at ${MAX_EXPLICIT_SKILL_REFERENCE_CHARS} characters or less.`,
		skills: []
	};
	const instructionPrefix = [
		"Use the following explicitly referenced skills for this request. Read each skill's SKILL.md before acting:",
		...referenceLines,
		"",
		"User request:",
		""
	].join("\n");
	if (instructionPrefix.length > MAX_EXPLICIT_SKILL_INSTRUCTION_CHARS) return {
		body: params.text,
		error: "Combined skill reference metadata is too long. Use fewer or shorter skill references.",
		skills: []
	};
	return {
		body: `${instructionPrefix}${params.text}`,
		skills: available
	};
}
//#endregion
export { mergeExplicitSkillSelections as a, listReservedChatSlashCommandNames as i, expandExplicitSkillReferences as n, resolveSkillCommandInvocation as o, hasSkillReferenceCandidate as r, skillCommandsToExplicitSelections as s, expandBundleCommandPromptTemplate as t };
