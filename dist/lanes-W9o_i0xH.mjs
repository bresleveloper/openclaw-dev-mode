//#region src/process/lanes.ts
const STATIC_COMMAND_LANES = [
	"main",
	"system-agent",
	"system-agent-inference",
	"cron",
	"cron-nested",
	"hook-dispatch",
	"background",
	"subagent",
	"active-memory",
	"nested"
];
//#endregion
export { STATIC_COMMAND_LANES as t };
