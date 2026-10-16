import { c as normalizeOptionalLowercaseString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { t as getChatCommands } from "./commands-registry.data-DhJCPcZC.mjs";
import { n as resolveSkillReadPath } from "./workspace-skill-read-path-Ct1QXBcj.mjs";
import { a as resolveSkillCommandFileHost, i as resolveExplicitSkillSelectionFileHost, n as recordExplicitSkillSelectionFileHost } from "./skill-command-provenance-D3weQ69x.mjs";
//#region src/skills/discovery/chat-command-invocation.ts
const MAX_EXPLICIT_SKILL_REFERENCES = 8;
const MAX_EXPLICIT_SKILL_REFERENCE_CHARS = 512;
const MAX_EXPLICIT_SKILL_INSTRUCTION_CHARS = 1e3;
function skillCommandsToExplicitSelections(skills) {
	return skills.flatMap((skill) => {
		if (!skill.skillFile) return [];
		const fileHost = resolveSkillCommandFileHost(skill);
		const selection = {
			name: skill.name,
			path: skill.skillFile
		};
		return [fileHost ? recordExplicitSkillSelectionFileHost(selection, fileHost) : selection];
	});
}
function mergeExplicitSkillSelections(...groups) {
	const merged = /* @__PURE__ */ new Map();
	for (const selection of groups.flatMap((group) => group ?? [])) merged.set(`${selection.name}\0${selection.path}\0${resolveExplicitSkillSelectionFileHost(selection) ?? ""}`, selection);
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
	return skillCommands.find((entry) => normalizeOptionalLowercaseString(entry.name) === lowered || normalizeOptionalLowercaseString(entry.skillName) === lowered || normalizeSkillCommandLookup(entry.name) === normalized || normalizeSkillCommandLookup(entry.skillName) === normalized);
}
function isEscapedReference(text, index) {
	let backslashes = 0;
	for (let cursor = index - 1; cursor >= 0 && text[cursor] === "\\"; cursor -= 1) backslashes += 1;
	return backslashes % 2 === 1;
}
function* skillReferenceNames(text) {
	for (const match of text.matchAll(/\$([-a-zA-Z0-9_:]+)/gu)) {
		const name = match[1]?.replace(/:+$/gu, "");
		const index = match.index;
		if (name && index !== void 0 && !isEscapedReference(text, index) && /[a-z]/u.test(name)) yield name;
	}
}
/** Returns true when text may contain an explicit `$skill-name` reference. */
function hasSkillReferenceCandidate(text) {
	return !skillReferenceNames(text).next().done;
}
function resolveSkillCommandInvocation(params) {
	const match = params.commandBodyNormalized.trim().match(/^\/([^\s]+)(?:\s+([\s\S]+))?$/);
	if (!match) return null;
	const commandName = normalizeOptionalLowercaseString(match[1]);
	const invocation = commandName === "skill" ? match[2]?.trim().match(/^([^\s]+)(?:\s+([\s\S]+))?$/) : match;
	if (!commandName || !invocation) return null;
	const command = commandName === "skill" ? findSkillCommand(params.skillCommands, invocation[1] ?? "") : params.skillCommands.find((entry) => normalizeOptionalLowercaseString(entry.name) === commandName);
	return command ? {
		command,
		args: invocation[2]?.trim() || void 0
	} : null;
}
function expandBundleCommandPromptTemplate(template, args) {
	const normalizedArgs = args?.trim() ?? "";
	if (template.includes("$ARGUMENTS")) return template.replaceAll("$ARGUMENTS", () => normalizedArgs).trim();
	const rendered = template.trim();
	return normalizedArgs ? `${rendered}\n\nUser input:\n${normalizedArgs}` : rendered;
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
	const referenceLines = available.map((skill) => {
		if (skill.modelVisible !== false || !skill.skillFile) return `- ${skill.skillName}`;
		const readPath = resolveSkillReadPath({
			name: skill.skillName,
			filePath: skill.skillFile
		}, resolveSkillCommandFileHost(skill));
		return `- ${skill.skillName} (SKILL.md: ${readPath})`;
	});
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
