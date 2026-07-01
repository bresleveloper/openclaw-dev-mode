# claude-hourly.ps1 - Automated hourly Claude Code run for WA Claw v2
# Registered with Windows Task Scheduler, fires every 1 hour.
# Each run: Opus wakes, reads todo, spawns Sonnet worker, commits+pushes, exits.
#
# Fresh session each run (no --resume). CLAUDE.md provides project context automatically.
# Uses --model opus for orchestration (spawns Sonnet subagents for implementation).
#
# IMPORTANT: Keep this file ASCII-only. PowerShell 5.1 default codepage mangles
# non-ASCII chars when passing strings to native commands.

$repoRoot = "C:\Users\Ariel\source\openclaw chaos mode\openclaw-dev-mode"
$todoFile = "$repoRoot\dev-mode\openclaw-whatsapp-claw\v2-todo.md"
$logDir = "$repoRoot\dev-mode\openclaw-whatsapp-claw\logs"
$logFile = "$logDir\claude-hourly.log"

# Ensure log directory exists
if (-not (Test-Path $logDir)) { New-Item -ItemType Directory -Path $logDir -Force | Out-Null }

# Timestamp
$ts = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
"" | Out-File $logFile -Append -Encoding utf8
"=== [$ts] Hourly run starting ===" | Out-File $logFile -Append -Encoding utf8

# Change to repo root (claude -p uses CWD for CLAUDE.md discovery)
Set-Location $repoRoot

# Check if todo has unchecked tasks before burning tokens
$todoContent = Get-Content $todoFile -Raw
if ($todoContent -notmatch '\- \[ \]') {
    "[$ts] No unchecked tasks remaining. Skipping." | Out-File $logFile -Append -Encoding utf8
    exit 0
}

# The prompt - Opus orchestrator wakes up and does one task
# NOTE: Keep this ASCII-only. PowerShell 5.1 reads .ps1 as Windows-1252 by default,
# which mangles non-ASCII chars like em-dashes when passed to native commands.
$prompt = @'
You are an automated Opus orchestrator for the WhatsApp Claw v2 implementation.
CLAUDE.md is loaded automatically and has full project context, SSH details, and delegation rules.

YOUR TASK: Complete exactly ONE item from the todo list, then stop.

STEP BY STEP:

1. Run `git pull` to get latest code.
2. Check what branch you are on. If not on `v2-impl`, create it: `git checkout -b v2-impl` (or switch to it if it exists: `git checkout v2-impl`).
3. Read `dev-mode/openclaw-whatsapp-claw/v2-todo.md` and find the FIRST line starting with `- [ ]`.
4. Read the spec section referenced by that task in `dev-mode/openclaw-whatsapp-claw/docs/plan-v2.md`.
5. Spawn ONE Sonnet subagent (Agent tool, model: sonnet) with a COMPLETE brief:
   - State what files to create or edit, with full paths from repo root
   - Paste the relevant spec content into the brief (do not tell it to go read a file)
   - Include test commands if the task mentions testing
   - Tell it NOT to run git commands - you handle commits
6. Review the subagent output. Verify the changes match the spec.
7. If issues: fix them or spawn another Sonnet subagent.
8. Mark the completed task as `- [x]` in v2-todo.md.
9. Stage changed files with `git add`, then commit: `git commit -m "feat(wa-claw-v2): T<id> - <short description>"`
10. Push: `git push -u origin v2-impl`
11. STOP. Do not proceed to the next task. Exit cleanly.

RULES:
- One task per run. Even if fast, stop after pushing.
- If blocked: write a note under the task line, mark it `- [~]`, skip to the next `- [ ]` task.
- If no unchecked tasks remain: write "ALL TASKS COMPLETE" at the bottom of v2-todo.md and stop.
- You are Opus. Delegate implementation to Sonnet subagents per CLAUDE.md rules. You plan, brief, review, and commit.
'@

# Run claude in non-interactive mode - fresh session, no --resume
try {
    $output = & claude -p $prompt `
        --model opus `
        --allowedTools "Read,Edit,Write,Bash,Glob,Grep,Agent" `
        --permission-mode acceptEdits `
        --max-turns 100 `
        --output-format text 2>&1

    $output | Out-File $logFile -Append -Encoding utf8
} catch {
    "[$ts] ERROR: $_" | Out-File $logFile -Append -Encoding utf8
}

$tsEnd = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
"=== [$tsEnd] Run complete ===" | Out-File $logFile -Append -Encoding utf8
