[openclaw] 🦞 _Found it. Exact source code proof:_

───

File 1: Cron Schema

`**/opt/openclaw-dev-mode/src/gateway/protocol/schema/cron.ts**` (line 14)

```
lightContext: Type.Optional(Type.Boolean()),
```

_Proof:_ Yes, cron payload has `lightContext` as an optional boolean.

───

File 2: Cron CLI Add

`**/opt/openclaw-dev-mode/src/cli/cron-cli/register.cron-add.ts**` (line 169)

```
lightContext: opts.lightContext === true ? true : undefined,
```

_Proof:_ The CLI passes `lightContext` through to the cron payload.

───

File 3: Server-Plugins Dispatch

`**/opt/openclaw-dev-mode/src/gateway/server-plugins.ts**` (line 470)

```
...(params.lightContext === true && { bootstrapContextMode: "lightweight" }),
```

_Proof:_ When `lightContext: true`, it sets `bootstrapContextMode: "lightweight"` on the agent run.

───

File 4: Bootstrap Files Filter — THE MEANING

`**/opt/openclaw-dev-mode/src/agents/bootstrap-files.ts**` (lines 177-195)

```
function applyContextModeFilter(params: {
  files: WorkspaceBootstrapFile[];
  contextMode?: BootstrapContextMode;
  runKind?: BootstrapContextRunKind;
}): WorkspaceBootstrapFile[] {
  const contextMode = params.contextMode ?? "full";
  const runKind = params.runKind ?? "default";
  if (contextMode !== "lightweight") {
    return params.files;
  }
  if (runKind === "heartbeat") {
    return params.files.filter((file) => file.name === "HEARTBEAT.md");
  }
  // cron/default lightweight mode keeps bootstrap context empty on purpose.
  return [];
}
```

───

ANSWER: What `lightContext` means for CRON

```
| Setting                       | Behavior                                                                                            |
| ----------------------------- | --------------------------------------------------------------------------------------------------- |
| lightContext: false (default) | All bootstrap files injected (SOUL.md, USER.md, PROTOCOLS.md, MEMORY.md, AGENTS.md, TOOLS.md, etc.) |
| lightContext: true            | EMPTY bootstrap context — NO files injected at all                                                  |
```

_Critical difference from heartbeat:_

• Heartbeat `lightContext: true` → keeps only `HEARTBEAT.md`
• _Cron `lightContext: true` → keeps NOTHING_ (empty array `[]`)

The code explicitly says: `// cron/default lightweight mode keeps bootstrap context empty on purpose.`

---

let me recap the actual behaviors:

Cron lightContext: true = ZERO files loaded
Heartbeat lightContext: true = only HEARTBEAT.md loaded

Cron lightContext: false = all files loaded
Heartbeat lightContext: false = all files loaded

Cron systemEvent / normal Heartbeat = with entire agents session (Full Conversation History)
