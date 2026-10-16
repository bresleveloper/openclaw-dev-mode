//#region src/process/lanes.ts
const SUBAGENT_LANE_PREFIX = `subagent:`;
const SWARM_LANE_PREFIX = `${SUBAGENT_LANE_PREFIX}swarm:`;
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
export { SUBAGENT_LANE_PREFIX as n, SWARM_LANE_PREFIX as r, STATIC_COMMAND_LANES as t };
