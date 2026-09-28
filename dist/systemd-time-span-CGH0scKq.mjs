//#region src/daemon/systemd-time-span.ts
const SYSTEMD_DEFAULT_STOP_TIMEOUT_MS = 9e4;
const UNITS = {
	us: .001,
	usec: .001,
	μs: .001,
	ms: 1,
	msec: 1,
	s: 1e3,
	sec: 1e3,
	second: 1e3,
	seconds: 1e3,
	m: 6e4,
	min: 6e4,
	minute: 6e4,
	minutes: 6e4,
	h: 36e5,
	hr: 36e5,
	hour: 36e5,
	hours: 36e5,
	d: 864e5,
	day: 864e5,
	days: 864e5,
	w: 6048e5,
	week: 6048e5,
	weeks: 6048e5,
	M: 26298e5,
	month: 26298e5,
	months: 26298e5,
	y: 315576e5,
	year: 315576e5,
	years: 315576e5
};
function parseSystemdTimeSpanMs(value) {
	const text = value.trim();
	if (text === "infinity") return Infinity;
	let remaining = text;
	let total = 0;
	if (!remaining) return;
	while (remaining) {
		const match = /^(\d+(?:\.\d+)?|\.\d+)\s*([a-zA-Zμ]+)?\s*/u.exec(remaining);
		if (!match) return;
		const factor = match[2] ? UNITS[match[2]] : 1e3;
		if (factor === void 0) return;
		total += Number(match[1]) * factor;
		remaining = remaining.slice(match[0].length);
	}
	return Number.isFinite(total) ? total : void 0;
}
//#endregion
export { parseSystemdTimeSpanMs as n, SYSTEMD_DEFAULT_STOP_TIMEOUT_MS as t };
