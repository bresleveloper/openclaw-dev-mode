//#region packages/llm-core/src/utils/assistant-message-events.ts
function appendTextDeltaToAssistantMessage(message, contentIndex, delta) {
	const content = [...message.content];
	const currentContent = content[contentIndex];
	content[contentIndex] = currentContent?.type === "text" ? {
		...currentContent,
		text: currentContent.text + delta
	} : {
		type: "text",
		text: delta
	};
	return {
		...message,
		content
	};
}
//#endregion
export { appendTextDeltaToAssistantMessage as t };
