import { t as restoreTerminalState } from "./restore-hVJBgmhX.mjs";
import { h as sleep } from "./utils-DgZn2dLu.mjs";
import { n as isRich, r as theme } from "./theme-DzaUZY4q.mjs";
import { i as supportsDecorativeEmoji, t as decorativeEmoji } from "./decorative-emoji-DbUbxlxW.mjs";
//#region src/cli/claw-banner.ts
const MASCOT_ART = [
	" •●●:.        .:●●•",
	":●●●●:        :●●●●:",
	".●●●●:.:•●●•:.:●●●●.",
	" .●●●: •●●●●• :●●●.",
	" ..:••●●●●●●●●••:..",
	".::••••●●●●●●••••::.",
	" . .:  •●●●●•  :. .",
	"    .  :●●●●:  .",
	"      .●●●●●●.",
	"       :••••:"
];
const MASCOT_OPEN_ROWS = ["•●•.:.        .:.•●•", ":●●●•:        :•●●●:"];
const MASCOT_WIDTH = 20;
const WORDMARK_ROW_OFFSET = 3;
const WORDMARK_ART = [
	"█▀▀▀█ █▀▀▀█ █▀▀▀▀ █▄  █ █▀▀▀▀ █     █▀▀▀█ █   █",
	"█   █ █▀▀▀▀ █▀▀▀  █ ▀▄█ █     █     █▀▀▀█ █▄▀▄█",
	"▀▀▀▀▀ ▀     ▀▀▀▀▀ ▀   ▀ ▀▀▀▀▀ ▀▀▀▀▀ ▀   ▀ ▀   ▀"
];
const GAP = 3;
const BANNER_WIDTH = 71;
const ROWS = MASCOT_ART.length;
const identityTint = (text) => text;
function composeFrame(params) {
	const mascotRows = params.mascotRows ?? MASCOT_ART;
	const lines = [];
	for (let row = 0; row < ROWS; row++) {
		const mascotRow = (mascotRows[row] ?? "").padEnd(MASCOT_WIDTH).slice(0, MASCOT_WIDTH);
		let out = "";
		for (let col = 0; col < mascotRow.length; col++) {
			const ch = mascotRow[col] ?? " ";
			out += ch === " " ? " " : (params.mascotTint?.(col) ?? theme.accent)(ch);
		}
		const wordmarkRow = WORDMARK_ART[row - WORDMARK_ROW_OFFSET];
		if (wordmarkRow) {
			out += " ".repeat(GAP);
			for (let col = 0; col < wordmarkRow.length; col++) {
				const ch = wordmarkRow[col] ?? " ";
				out += ch === " " ? " " : (params.wordmarkTint?.(23 + col) ?? identityTint)(ch);
			}
		}
		lines.push(out.replace(/\s+$/, ""));
	}
	return lines;
}
function plainTitleLine() {
	const icon = decorativeEmoji("🦞");
	return supportsDecorativeEmoji() && icon ? `${icon} OPENCLAW ${icon}` : "OPENCLAW";
}
async function animateBanner(opts) {
	const { settleWhen, sleep, write } = opts;
	let settleRequested = false;
	const settleSignal = settleWhen ? Promise.resolve(settleWhen).then(() => {
		settleRequested = true;
	}, () => {
		settleRequested = true;
	}) : null;
	const pause = async (ms) => {
		if (!settleSignal) {
			await sleep(ms);
			return true;
		}
		await Promise.race([sleep(ms), settleSignal]);
		return !settleRequested;
	};
	let drewFrame = false;
	const draw = (lines) => {
		const prefix = drewFrame ? `\x1b[${ROWS}F` : "";
		drewFrame = true;
		write(`${prefix}${lines.map((line) => `\x1b[K${line}`).join("\n")}\n`);
	};
	const onSignal = (signal) => {
		restoreTerminalState(`claw banner ${signal}`);
		process.exit(signal === "SIGINT" ? 130 : 143);
	};
	const onSigint = () => onSignal("SIGINT");
	const onSigterm = () => onSignal("SIGTERM");
	process.once("SIGINT", onSigint);
	process.once("SIGTERM", onSigterm);
	write("\x1B[?25l");
	try {
		const wipeSteps = 5;
		for (let step = 0; step <= wipeSteps; step++) {
			const edge = Math.round(BANNER_WIDTH * step / wipeSteps);
			const tintAt = (colored) => (col) => col < edge ? colored : col < edge + 2 ? theme.accentBright : theme.muted;
			draw(composeFrame({
				mascotTint: tintAt(theme.accent),
				wordmarkTint: tintAt(identityTint)
			}));
			if (!await pause(20)) return "settled";
		}
		for (let x = MASCOT_WIDTH; x < 77; x += 9) {
			const band = (col) => col >= x && col < x + 9 ? theme.accentBright : identityTint;
			draw(composeFrame({ wordmarkTint: band }));
			if (!await pause(20)) return "settled";
		}
		draw(composeFrame({ mascotRows: [...MASCOT_OPEN_ROWS, ...MASCOT_ART.slice(2)] }));
		if (!await pause(35)) return "settled";
		draw(composeFrame({}));
		if (!await pause(35)) return "settled";
		draw(composeFrame({}));
		return "completed";
	} finally {
		try {
			if (settleRequested && drewFrame) draw(composeFrame({}));
		} finally {
			process.off("SIGINT", onSigint);
			process.off("SIGTERM", onSigterm);
			write("\x1B[?25h");
		}
	}
}
/**
* Prints the OpenClaw banner: animated on rich interactive terminals, static
* otherwise, plain title on terminals too narrow for the art.
*/
async function printClawBanner(runtime, options = {}) {
	if ((options.columns ?? process.stdout.columns ?? 80) < BANNER_WIDTH) {
		runtime.log(`${plainTitleLine()}\n`);
		return "static";
	}
	const env = options.env ?? process.env;
	if (!((options.isTty ?? process.stdout.isTTY ?? false) && (options.rich ?? isRich()) && !env.CI && !env.VITEST)) {
		runtime.log(`${composeFrame({}).join("\n")}\n`);
		return "static";
	}
	const result = await animateBanner({
		settleWhen: options.settleWhen,
		sleep: options.sleep ?? sleep,
		write: options.write ?? ((chunk) => process.stdout.write(chunk))
	});
	(options.write ?? ((chunk) => process.stdout.write(chunk)))("\n");
	return result;
}
//#endregion
export { printClawBanner as t };
