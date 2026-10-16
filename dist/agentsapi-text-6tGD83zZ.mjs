//#region extensions/agentsapi/agentsapi-text.ts
function readAgentsApiFinalText(items) {
	const completedMessages = items.filter((item) => item.type === "message" && item.role === "assistant" && item.status === "completed");
	const finalItems = completedMessages.filter((item) => item.phase === "final_answer");
	return (finalItems.length ? finalItems : completedMessages.filter((item) => item.phase !== "commentary")).map((item) => item.content?.filter((part) => part.type === "output_text").map((part) => part.text ?? "").join("") ?? "").join("\n");
}
//#endregion
export { readAgentsApiFinalText as t };
