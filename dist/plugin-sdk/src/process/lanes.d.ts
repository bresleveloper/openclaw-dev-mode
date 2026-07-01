/** Named queue lanes for work that must not interleave with the main command stream. */
export declare const enum CommandLane {
    Main = "main",
    Cron = "cron",
    CronNested = "cron-nested",
    Subagent = "subagent",
    Nested = "nested"
}
