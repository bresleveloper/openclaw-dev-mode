import { t as projectRuntimeToolInputSchema } from "./tool-schema-json-projection-DTb7YiHb.js";
//#region src/agents/openai-tool-projection.ts
function isRecord(value) {
	return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
function unreadableToolDiagnostic(toolIndex) {
	return {
		toolIndex,
		violations: [`tool[${toolIndex}] is unreadable`]
	};
}
/** Snapshots direct/custom tool descriptors before OpenAI payload construction. */
function projectOpenAITools(tools) {
	let inputToolCount;
	try {
		inputToolCount = tools.length;
	} catch {
		return {
			inputToolCount: 0,
			tools: [],
			diagnostics: [unreadableToolDiagnostic(0)]
		};
	}
	const projectedTools = [];
	const diagnostics = [];
	for (let toolIndex = 0; toolIndex < inputToolCount; toolIndex += 1) {
		let tool;
		try {
			tool = tools[toolIndex];
		} catch {
			diagnostics.push(unreadableToolDiagnostic(toolIndex));
			continue;
		}
		let name;
		try {
			name = tool.name;
		} catch {
			diagnostics.push({
				toolIndex,
				violations: [`tool[${toolIndex}].name is unreadable`]
			});
			continue;
		}
		if (typeof name !== "string" || !name) {
			diagnostics.push({
				toolIndex,
				violations: [`tool[${toolIndex}].name is empty`]
			});
			continue;
		}
		let parameters;
		try {
			parameters = tool.parameters;
		} catch {
			diagnostics.push({
				toolIndex,
				toolName: name,
				violations: [`${name}.parameters is unreadable`]
			});
			continue;
		}
		const schemaProjection = projectRuntimeToolInputSchema(parameters ?? {}, `${name}.parameters`);
		if (!isRecord(schemaProjection.schema) || schemaProjection.violations.length > 0) {
			diagnostics.push({
				toolIndex,
				toolName: name,
				violations: schemaProjection.violations.length > 0 ? schemaProjection.violations : [`${name}.parameters must be a JSON object schema`]
			});
			continue;
		}
		let descriptionValue;
		try {
			descriptionValue = tool.description;
		} catch {}
		const description = typeof descriptionValue === "string" ? descriptionValue : void 0;
		projectedTools.push({
			toolIndex,
			name,
			...description !== void 0 ? { description } : {},
			parameters: schemaProjection.schema
		});
	}
	return {
		inputToolCount,
		tools: projectedTools,
		diagnostics
	};
}
function requireProjectedFunction(name, projection, choiceLabel) {
	if (!projection.tools.some((tool) => tool.name === name)) throw new Error(`${choiceLabel} requested unavailable tool "${name}" after schema conversion`);
}
/** Keeps Responses tool choices aligned with surviving function schemas. */
function reconcileOpenAIResponsesToolChoice(choice, projection) {
	if (choice === "auto") return projection.tools.length > 0 ? choice : void 0;
	if (choice === "required") {
		if (projection.tools.length === 0) throw new Error("OpenAI Responses tool_choice requires a tool, but no tools survived schema conversion");
		return choice;
	}
	if (choice === "none" || !isRecord(choice)) return choice;
	const choiceType = choice.type;
	if (choiceType === "function") {
		const functionName = choice.name;
		if (typeof functionName !== "string") return choice;
		requireProjectedFunction(functionName, projection, "OpenAI Responses tool_choice");
		return {
			type: "function",
			name: functionName
		};
	}
	if (choiceType !== "allowed_tools") return choice;
	const mode = choice.mode;
	const tools = choice.tools;
	if (mode !== "auto" && mode !== "required" || !Array.isArray(tools)) return choice;
	const normalizedAllowedTools = [];
	for (const tool of tools) {
		if (!isRecord(tool) || tool.type !== "function") {
			normalizedAllowedTools.push(tool);
			continue;
		}
		const functionName = tool.name;
		if (typeof functionName === "string" && projection.tools.some((projectedTool) => projectedTool.name === functionName)) normalizedAllowedTools.push({
			type: "function",
			name: functionName
		});
	}
	if (normalizedAllowedTools.length === 0) {
		if (mode === "auto") return "none";
		throw new Error("OpenAI Responses tool_choice requires a tool, but no allowed tools survived schema conversion");
	}
	return {
		type: "allowed_tools",
		mode,
		tools: normalizedAllowedTools
	};
}
/** Keeps Chat Completions tool choices aligned with surviving function schemas. */
function reconcileOpenAICompletionsToolChoice(choice, projection) {
	if (choice === "auto") return projection.tools.length > 0 ? choice : void 0;
	if (choice === "required") {
		if (projection.tools.length === 0) throw new Error("OpenAI Chat Completions tool_choice requires a tool, but no tools survived schema conversion");
		return choice;
	}
	if (choice === "none" || !isRecord(choice)) return choice;
	const choiceType = choice.type;
	if (choiceType === "custom") throw new Error("OpenAI Chat Completions custom tool_choice is unsupported because this adapter emits function tools only");
	if (choiceType === "function") {
		const functionChoice = choice.function;
		if (!isRecord(functionChoice)) return choice;
		const functionName = functionChoice.name;
		if (typeof functionName !== "string") return choice;
		requireProjectedFunction(functionName, projection, "OpenAI Chat Completions tool_choice");
		return {
			type: "function",
			function: { name: functionName }
		};
	}
	if (choiceType !== "allowed_tools") return choice;
	const allowedConfig = choice.allowed_tools;
	if (!isRecord(allowedConfig)) return choice;
	const mode = allowedConfig.mode;
	const tools = allowedConfig.tools;
	if (mode !== "auto" && mode !== "required" || !Array.isArray(tools)) return choice;
	const normalizedAllowedTools = [];
	for (const tool of tools) {
		if (!isRecord(tool) || tool.type !== "function") continue;
		const functionChoice = tool.function;
		const functionName = isRecord(functionChoice) ? functionChoice.name : void 0;
		if (typeof functionName === "string" && projection.tools.some((projectedTool) => projectedTool.name === functionName)) normalizedAllowedTools.push({
			type: "function",
			function: { name: functionName }
		});
	}
	if (normalizedAllowedTools.length === 0) {
		if (mode === "auto") return "none";
		throw new Error("OpenAI Chat Completions tool_choice requires a tool, but no allowed tools survived schema conversion");
	}
	return {
		type: "allowed_tools",
		allowed_tools: {
			mode,
			tools: normalizedAllowedTools
		}
	};
}
/** Truncates a prompt cache key by Unicode code point count. */
function clampOpenAIPromptCacheKey(key) {
	if (key === void 0) return;
	const chars = Array.from(key);
	if (chars.length <= 64) return key;
	return chars.slice(0, 64).join("");
}
//#endregion
export { reconcileOpenAIResponsesToolChoice as i, projectOpenAITools as n, reconcileOpenAICompletionsToolChoice as r, clampOpenAIPromptCacheKey as t };
