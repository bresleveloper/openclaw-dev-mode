[openclaw] 🦞

Alright, here's the full technical post-mortem of the WhatsApp incident. Document this — it'll save you next time.

---

## 🚨 Root Cause: Session Deadlock, Not Connection Failure

The WhatsApp **Baileys WebSocket connection was alive the entire time**. The problem was the **processing session** got stuck in an embedded run and couldn't process inbound messages.

### What Happened (Timeline)

| Time (UTC)  | Event                                                                                                                                                                |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 08:30–09:01 | **18 SSH login alerts** from `79.177.155.179` hit JarvisHub (#3530–#3547). Each triggered a `message` + `exec` forward cycle to WhatsApp.                            |
| 09:13       | Ariel says in webchat: _"whatsapp not reatcing, to me"_                                                                                                              |
| 09:18       | I send test messages via WhatsApp — **outbound works**, messages deliver.                                                                                            |
| 09:19:44    | Gateway **auto-aborts stuck session**:<br>`[diagnostic] stuck session recovery: sessionId=05e062a1-... age=360s action=abort_embedded_run aborted=true drained=true` |
| 09:45       | I try to send another test message → **"Cross-context messaging denied"** — system blocks webchat→WhatsApp sends.                                                    |
| 11:52       | WhatsApp disconnects (status **499**) → reconnects 4 seconds later.                                                                                                  |

### Key Insight: Two Separate Layers

| Layer                  | What It Is                                                                | Status During Incident                          |
| ---------------------- | ------------------------------------------------------------------------- | ----------------------------------------------- |
| **Baileys Connection** | WhatsApp Web WebSocket to Meta's servers                                  | **Alive** — auth files updating at 09:43–09:45  |
| **Processing Session** | OpenClaw agent session that reads WhatsApp messages and generates replies | **Stuck/deadlocked** — couldn't process inbound |

**The connection was fine. The brain was frozen.**

---

## 🔬 Technical Details

### 1. The Stuck Session

OpenClaw sessions can get stuck in an `embedded_run` state when a long-running operation (tool call, model generation) doesn't complete within the expected window. The gateway's diagnostic system detected it:

```syslog
[diagnostic] stuck session recovery: sessionId=05e062a1-651b-4d70-8d34-4973e5a7f4b2
sessionKey=agent:main:whatsapp:direct:+972542634114
age=360s action=abort_embedded_run aborted=true drained=true
```

**Translation:** Session `05e062a1...` was stuck for 360 seconds (6 minutes). The gateway force-aborted the embedded run, drained the message queue, and released the session lock.

### 2. Why Deleting Session Files Didn't Help

When I ran `rm` on the session transcript files (`05e062a1-....jsonl`), it deleted the **persistent storage** but NOT the **in-memory session object** inside the gateway process. OpenClaw sessions are:

- **In-memory:** Live state, message queues, model context
- **On-disk:** JSONL transcript files for persistence across restarts

Deleting the file only removes the backup. The zombie session kept running in RAM until the gateway's diagnostic system killed it at 09:19.

**Lesson:** To truly kill a session, you need either:

- A gateway restart (kills all in-memory state)
- The diagnostic auto-abort (takes ~6 minutes of stuck time)
- Or a proper session termination API (if available)

### 3. Baileys Auth Health Check

The best way to verify the **connection layer** is independent of the **processing layer**:

```bash
# Check if Baileys auth is actively updating
ls -lt /root/.openclaw/credentials/whatsapp/default/ | head -10

# Look for recent creds.json, session files, pre-keys
find /root/.openclaw/credentials/whatsapp/default/ -type f -newermt "2026-07-03 09:00"
```

If files like `creds.json`, `session-*.json`, `pre-key-*.json` have timestamps within the last few minutes, **Baileys is connected and syncing**. The WhatsApp Web session is alive.

### 4. Channel Status: `SETUP` vs `OK`

In `openclaw status` (fast mode), WhatsApp showed:

```
│ whatsapp │ ON │ SETUP │ configured; status unavailable in fast mode │
```

This is **misleading**. `SETUP` in fast mode doesn't mean "needs QR scan." It means the channel health probe hasn't completed yet (fast mode skips deep checks). The actual deep status (`openclaw status --deep`) showed `OK` earlier.

**Don't panic at `SETUP` — verify with auth file timestamps.**

### 5. Cross-Context Messaging Denied

At 09:45, sending WhatsApp messages from the webchat session failed with:

```
Cross-context messaging denied: action=send target provider "whatsapp" while bound to "webchat"
```

OpenClaw enforces a security boundary: a session bound to one provider (webchat) can't send messages to another provider (WhatsApp). This restriction kicked in after the stuck session was cleared — possibly because the session context validation tightened post-abort.

**Workaround:** To send WhatsApp messages, you need to be in a WhatsApp-bound session, not a webchat one.

### 6. Disconnect Status Codes

| Code    | Meaning               | Likely Cause                                                                                           |
| ------- | --------------------- | ------------------------------------------------------------------------------------------------------ |
| **408** | Request Timeout       | Baileys WebSocket timed out waiting for phone response; network hiccup                                 |
| **499** | Client Closed Request | Phone intentionally closed the connection, or the client (Baileys) dropped it due to keepalive timeout |

Both are **transient**. Baileys auto-reconnects. Status 499 at 11:52:42 → reconnected at 11:52:46 (4 seconds). Not a concern unless it loops rapidly.

---

## 🔧 Diagnostic Playbook (For Next Time)

If WhatsApp "isn't reacting," run this in order:

### Step 1: Check if the connection is alive

```bash
# Baileys auth updating?
ls -lt /root/.openclaw/credentials/whatsapp/default/ | head -5

# Gateway running?
openclaw status | grep -i whatsapp
```

### Step 2: Check if the session is stuck

```bash
# Look for stuck session in syslog
journalctl --since "10 minutes ago" | grep -i "stuck session\|abort_embedded_run"
```

### Step 3: Check session transcript for inbound messages

```bash
# If there's a WhatsApp session file, check if it has USER messages (not just assistant)
head -20 /root/.openclaw/agents/main/sessions/<SESSION_ID>.jsonl | grep '"role":"user"'
```

If there are **no user messages** in the transcript, Ariel hasn't sent anything — the inbound path is dead.

### Step 4: Nuclear option

If the session is confirmed stuck and auto-abort hasn't fired yet:

```bash
# Restart the gateway (kills all sessions, forces fresh reconnect)
openclaw gateway restart
```

**Warning:** This kills the current webchat session too. You'll need to reconnect.

---

## 📋 Recommended Fix: Session Timeout Config

Consider tuning the gateway's stuck session detection threshold if this happens repeatedly:

```bash
# Check current diagnostic settings
openclaw config get gateway.diagnostics.stuckSessionRecovery
```

If the threshold is too high (e.g., 600s), WhatsApp could be unresponsive for 10 minutes before auto-recovery. Lowering it to 120s or 180s would catch stuck sessions faster.

---

## 🎯 Summary

The WhatsApp outage was **not a connection problem**. It was a **processing session deadlock** caused by the flood of SSH alerts overwhelming the WhatsApp session's message queue. The Baileys connection stayed alive, auth files kept updating, but the session couldn't process Ariel's messages for ~6 minutes until the gateway's diagnostic system auto-aborted it.

**Connection ≠ Session.** Check both independently.

🦞
