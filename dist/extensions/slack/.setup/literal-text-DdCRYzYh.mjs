import { Ot as escapeSlackMrkdwn, vt as SLACK_SECTION_TEXT_MAX } from "./probe-BHqvMbno.mjs";
import { chunkTextForOutbound } from "openclaw/plugin-sdk/text-chunking";
// extensions/slack/src/literal-text.ts
/** Native plain-text blocks plus a non-parsing accessibility fallback. */
function buildSlackLiteralText(text) {
	const blocks = chunkTextForOutbound(text, SLACK_SECTION_TEXT_MAX, { preserveWhitespace: true }).map((chunk) => ({
		type: "section",
		text: {
			type: "plain_text",
			text: chunk,
			emoji: false
		}
	}));
	return {
		text: escapeSlackMrkdwn(text),
		blocks,
		mrkdwn: false,
		parse: "none",
		link_names: false,
		unfurl_links: false,
		unfurl_media: false
	};
}
export { buildSlackLiteralText as t };
