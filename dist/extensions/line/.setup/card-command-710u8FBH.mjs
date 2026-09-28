import { d as createActionCard, f as createImageCard, m as createListCard, p as createInfoCard, u as createReceiptCard } from "./send-retry-DbfiHBPd.mjs";
import { t as createFlexMessage } from "./send-BmsHY4WC.mjs";
import { normalizeLowercaseStringOrEmpty } from "openclaw/plugin-sdk/string-coerce-runtime";
import { expectDefined } from "openclaw/plugin-sdk/expect-runtime";
//#region extensions/line/src/card-command.ts
const CARD_USAGE = `Usage: /card <type> "title" "body" [options]

Types:
  info "Title" "Body" ["Footer"]
  image "Title" "Caption" --url <image-url>
  action "Title" "Body" --actions "Btn1|url1,Btn2|text2"
  list "Title" "Item1|Desc1,Item2|Desc2"
  receipt "Title" "Item1:$10,Item2:$20" --total "$30"
  confirm "Question?" --yes "Yes|data" --no "No|data"
  buttons "Title" "Text" --actions "Btn1|url1,Btn2|data2"

Escape a separator that belongs to the data with a backslash: \\, \\|, or \\:

Examples:
  /card info "Welcome" "Thanks for joining!"
  /card image "Product" "Check it out" --url https://example.com/img.jpg
  /card action "Menu" "Choose an option" --actions "Order|/order,Help|/help"
  /card action "Links" "Pick one" --actions "Open|https://example.com/a\\,b"`;
function buildLineReply(lineData) {
	return { channelData: { line: lineData } };
}
function buildLineFlexReply(altText, contents) {
	const message = createFlexMessage(altText, contents);
	return buildLineReply({ flexMessage: {
		altText: message.altText,
		contents: message.contents
	} });
}
/**
* Split a card option value on its unescaped separators.
*
* Each pass consumes escapes for its own separator and preserves every other
* backslash. This lets nested comma, pipe, and colon passes stay independent.
*/
function splitCardValue(value, separator) {
	const parts = [];
	let current = "";
	for (let index = 0; index < value.length; index += 1) {
		const char = value[index];
		if (char === "\\" && value[index + 1] === separator) {
			current += separator;
			index += 1;
			continue;
		}
		if (char === separator) {
			parts.push(current);
			current = "";
			continue;
		}
		current += char;
	}
	parts.push(current);
	return parts;
}
/** Split a "Label|data" pair, keeping escaped separators inside either side. */
function splitCardPair(part) {
	const [label = "", data] = splitCardValue(part, "|").map((piece) => piece.trim());
	return [label, data];
}
/**
* Parse action string format: "Label|data,Label2|data2"
* Data can be a URL (uri action) or plain text (message action) or key=value (postback)
*/
function parseActions(actionsStr) {
	if (!actionsStr) return [];
	const results = [];
	for (const part of splitCardValue(actionsStr, ",")) {
		const [label, data] = splitCardPair(part);
		if (!label) continue;
		const actionData = data || label;
		const action = actionData.startsWith("http://") || actionData.startsWith("https://") ? {
			type: "uri",
			label,
			uri: actionData
		} : actionData.includes("=") ? {
			type: "postback",
			label,
			data: actionData,
			displayText: label
		} : {
			type: "message",
			label,
			text: actionData
		};
		results.push({
			label,
			action
		});
	}
	return results;
}
/**
* Parse list items format: "Item1|Subtitle1,Item2|Subtitle2"
*/
function parseListItems(itemsStr) {
	return splitCardValue(itemsStr, ",").map((part) => {
		const [title, subtitle] = splitCardPair(part);
		return {
			title,
			subtitle
		};
	}).filter((item) => item.title);
}
/**
* Parse receipt items format: "Item1:$10,Item2:$20"
*/
function parseReceiptItems(itemsStr) {
	return splitCardValue(itemsStr, ",").map((part) => {
		const segments = splitCardValue(part, ":");
		const value = segments.length > 1 ? segments.pop() : void 0;
		return {
			name: segments.join(":").trim(),
			value: value?.trim() ?? ""
		};
	}).filter((item) => item.name);
}
/**
* Parse quoted arguments from command string
* Supports: /card type "arg1" "arg2" "arg3" --flag value
*/
function parseCardArgs(argsStrInput) {
	let argsStr = argsStrInput;
	const result = {
		type: "",
		args: [],
		flags: {}
	};
	const typeMatch = argsStr.match(/^(\w+)/);
	if (typeMatch) {
		result.type = normalizeLowercaseStringOrEmpty(typeMatch[1]);
		argsStr = argsStr.slice(typeMatch[0].length).trim();
	}
	const quotedRegex = /"([^"]*?)"/g;
	let match;
	while ((match = quotedRegex.exec(argsStr)) !== null) result.args.push(expectDefined(match[1], "quoted card argument capture") || void 0);
	const flagRegex = /--(\w+)\s+(?:"([^"]*?)"|(\S+))/g;
	while ((match = flagRegex.exec(argsStr)) !== null) {
		const key = expectDefined(match[1], "card flag name capture");
		result.flags[key] = expectDefined(match[2] ?? match[3], "card flag value capture");
	}
	return result;
}
async function handleLineCardCommand(argsInput) {
	const argsStr = argsInput?.trim() ?? "";
	if (!argsStr) return { text: CARD_USAGE };
	const { type, args, flags } = parseCardArgs(argsStr);
	if (!type) return { text: CARD_USAGE };
	try {
		switch (type) {
			case "info": {
				const [title = "Info", body = "", footer] = args;
				const bubble = createInfoCard(title, body, footer);
				return buildLineFlexReply(body ? `${title}: ${body}` : title, bubble);
			}
			case "image": {
				const [title = "Image", caption = ""] = args;
				const imageUrl = flags.url || flags.image;
				if (!imageUrl) return { text: "Error: Image card requires --url <image-url>" };
				const bubble = createImageCard(imageUrl, title, caption);
				return buildLineFlexReply(`${title}: ${caption}`, bubble);
			}
			case "action": {
				const [title = "Actions", body = ""] = args;
				const actions = parseActions(flags.actions);
				if (actions.length === 0) return { text: "Error: Action card requires --actions \"Label1|data1,Label2|data2\"" };
				const bubble = createActionCard(title, body, actions, { imageUrl: flags.url || flags.image });
				return buildLineFlexReply(body ? `${title}: ${body}` : title, bubble);
			}
			case "list": {
				const [title = "List", itemsStr = ""] = args;
				const items = parseListItems(itemsStr || flags.items || "");
				if (items.length === 0) return { text: "Error: List card requires items. Usage: /card list \"Title\" \"Item1|Desc1,Item2|Desc2\"" };
				const bubble = createListCard(title, items);
				return buildLineFlexReply(`${title}: ${items.map((item) => item.title).join(", ")}`, bubble);
			}
			case "receipt": {
				const [title = "Receipt", itemsStr = ""] = args;
				const items = parseReceiptItems(itemsStr || flags.items || "");
				const total = flags.total ? {
					label: "Total",
					value: flags.total
				} : void 0;
				const footer = flags.footer;
				if (items.length === 0) return { text: "Error: Receipt card requires items. Usage: /card receipt \"Title\" \"Item1:$10,Item2:$20\" --total \"$30\"" };
				const bubble = createReceiptCard({
					title,
					items,
					total,
					footer
				});
				return buildLineFlexReply(`${title}: ${items.map((item) => `${item.name} ${item.value}`).join(", ")}`, bubble);
			}
			case "confirm": {
				const [question = "Confirm?"] = args;
				const yesStr = flags.yes || "Yes|yes";
				const noStr = flags.no || "No|no";
				const [yesLabel, yesData] = splitCardPair(yesStr);
				const [noLabel, noData] = splitCardPair(noStr);
				return buildLineReply({ templateMessage: {
					type: "confirm",
					text: question,
					confirmLabel: yesLabel || "Yes",
					confirmData: yesData || "yes",
					cancelLabel: noLabel || "No",
					cancelData: noData || "no",
					altText: question
				} });
			}
			case "buttons": {
				const [title = "Menu", text = "Choose an option"] = args;
				const actionParts = parseActions(flags.actions || "");
				if (actionParts.length === 0) return { text: "Error: Buttons card requires --actions \"Label1|data1,Label2|data2\"" };
				const templateActions = actionParts.map((a) => {
					const action = a.action;
					const label = action.label ?? a.label;
					if (action.type === "uri") return {
						type: "uri",
						label,
						uri: action.uri
					};
					if (action.type === "postback") return {
						type: "postback",
						label,
						data: action.data
					};
					return {
						type: "message",
						label,
						data: action.text
					};
				});
				return buildLineReply({ templateMessage: {
					type: "buttons",
					title,
					text,
					thumbnailImageUrl: flags.url || flags.image,
					actions: templateActions
				} });
			}
			default: return { text: `Unknown card type: "${type}". Available types: info, image, action, list, receipt, confirm, buttons` };
		}
	} catch (err) {
		return { text: `Error creating card: ${String(err)}` };
	}
}
//#endregion
export { handleLineCardCommand };
