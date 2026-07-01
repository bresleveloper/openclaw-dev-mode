# WhatsApp Claw — Media Capture (situation & insights)

- **Status:** Pre-plan — situation + insights for grilling. NOT an implementation plan.
- **Date:** 2026-05-18
- **Companion docs:** `design-concept.md`, `plan-v1.md`
- **Why this doc exists:** `wa-history.db` records message _metadata_ but saves no
  media files. Ariel asked to capture the situation and the design insights now,
  to be grilled into a real plan later.

---

## 1. Situation today

`dev-mode/wa-history.ts` attaches to the Baileys socket and, on every
`messages.upsert`, writes one row to the `messages` table. For a media message
it stores:

- `body` — empty (the logger only extracts `conversation` /
  `extendedTextMessage.text`; a media caption is **not** captured).
- `raw_json` — the full Baileys message object, which **does** contain the
  media node (`imageMessage`, `videoMessage`, …) with all of its metadata.

No bytes are ever downloaded. The panel therefore cannot show any media.

### What is actually in the live db (VPS inspection, 2026-05-18)

42,937 messages. Message-content node counts:

| node                  | count  |     | node                         | count |
| --------------------- | ------ | --- | ---------------------------- | ----- |
| `imageMessage`        | 13,081 |     | `audioMessage`               | 453   |
| `videoMessage`        | 8,598  |     | `documentMessage`            | 152   |
| `extendedTextMessage` | 11,703 |     | `stickerMessage`             | 39    |
| `conversation`        | 5,227  |     | `albumMessage`               | 10    |
| `reactionMessage`     | 909    |     | `documentWithCaptionMessage` | 7     |
| `protocolMessage`     | 2,282  |     | `ptvMessage` (video note)    | 3     |
| `contactMessage`      | 47     |     | `contactsArrayMessage`       | 3     |

So **~22,000 of 42,937 messages carry downloadable media** — overwhelmingly
images and videos. This is the bulk of the conversation history and it is
currently invisible in the panel.

### Sample media node (real, from the db)

```jsonc
// imageMessage
{
  "url": "https://mmg.whatsapp.net/o1/v/t24/f2/m232/AQOC...?ccb=9-4&oh=01_Q5...&oe=69EDC526&mms3=true",
  "mimetype": "image/jpeg",
  "fileSha256": "i4Sgpve...", // sha256 of the PLAINTEXT file
  "fileLength": "186744",
  "height": 1458,
  "width": 1170,
  "mediaKey": "6j+qEwU2QDp6...", // <-- the decryption key
  "fileEncSha256": "FRZgvPa8...", // sha256 of the CIPHERTEXT (.enc)
  "directPath": "/o1/v/t24/f2/m232/AQOC...",
  "mediaKeyTimestamp": "1774518200",
  "jpegThumbnail": "/9j/4AAQSkZJRg...", // <-- base64 JPEG preview, INLINE
}
```

`documentMessage` additionally has `fileName` / `title`; `audioMessage` has
`ptt` (true = voice note) and `waveform`; `stickerMessage` is `image/webp`.

## 2. Why this is not a one-liner

WhatsApp media is **end-to-end encrypted**. The `url` / `directPath` point at
**ciphertext** (`.enc`) sitting on `mmg.whatsapp.net`. To get a usable file you
must:

1. Download the `.enc` ciphertext from `url` (or re-resolve `directPath`).
2. Derive AES/HMAC keys from `mediaKey` via HKDF (WhatsApp's media scheme).
3. AES-CBC-decrypt, verify against `fileEncSha256` / `fileSha256`.

Baileys already implements all of this — `downloadMediaMessage()` /
`downloadContentFromMessage()` do steps 1–3 given the media node. The
`mediaKey` we need **is already stored in `raw_json`**, so messages are in
principle decryptable later — _if the ciphertext is still reachable_.

### The expiry trap

The `url` carries an `oe=` expiry (e.g. `oe=69EDC526`). WhatsApp CDN media
expires in **roughly two weeks**. After that the `url` 404s. Baileys can ask
WhatsApp to re-upload via a "media retry" receipt
(`sock.updateMediaMessage`), but that only succeeds for _reasonably recent_
messages whose sender device can still be reached.

**Consequence:** media must be captured **eagerly, at receive time**, while the
socket is live. A backfill of the existing 22k media messages is _mostly
futile_ — those URLs expired long ago. Media capture is **forward-only**;
treat the existing history's media as lost.

## 3. Free quick win — `jpegThumbnail` is already here

Every `imageMessage` / `videoMessage` node carries a `jpegThumbnail`: a small
(~1–4 KB) base64 JPEG, **already inside `raw_json`**, already in the db, never
expiring. The panel could render a low-res preview for all 21,679 existing
image/video messages **today**, with zero downloading, zero schema change,
zero gateway work — just parse `raw_json` in `wa-store.mjs`.

This is worth doing as "phase 0" regardless of the full capture plan: it makes
the existing history visually useful immediately.

## 4. Proposed shape of the real fix (to be grilled)

### 4.1 Storage layout

A media folder **next to the db**, mirroring the `wa-history.db` location:

```
~/.openclaw/dev-mode/
  wa-history.db
  wa-media/
    <message-id>.jpg
    <message-id>.mp4
    <message-id>.ogg
    ...
```

File stem = the message `id` (already the `messages` PRIMARY KEY — unique, and
a safe opaque token). Extension from `mimetype`. No user-controlled filename
on disk (a document's real `fileName` is kept in the db, not used as the path).

### 4.2 DB pointer

The message row should _point to_ the file. Two options to grill:

- **A — column on `messages`:** add `media_file TEXT`, `media_mime TEXT`,
  `media_kind TEXT` (`image|video|audio|document|sticker`). Simplest; one row
  per message; matches "message content contains a pointer".
- **B — separate `media` table:** `media(message_id, file, mime, kind,
bytes, caption, sha256)`. Cleaner for albums (one message → several files)
  and for a download-status/retry column.

Recommendation to grill: **B** — `albumMessage` already exists in the data, and
a `status` column (`pending|done|expired|failed`) makes the async download
auditable and retryable. Either way `wa-history.ts` owns the DDL (same pattern
as the new `chats` table) and `wa-store.mjs` reads it.

### 4.3 The download path (in `wa-history.ts`)

On `messages.upsert`, after the existing row insert, if the message has a media
node and capture is enabled:

- Enqueue a best-effort async download (small fixed concurrency, e.g. 3).
- `downloadMediaMessage(msg, "buffer", {}, { reuploadRequest: sock.updateMediaMessage })`.
- Write bytes to `wa-media/<id>.<ext>`; update the db row/`media` row.
- Capture the **caption** too (`imageMessage.caption`, etc.) into `body` or a
  `caption` column — currently dropped.
- Never block or crash the gateway — same discipline as the current logger
  (`try/catch`, fire-and-forget).

### 4.4 Panel side (`app/`)

- `wa-store.mjs` — expose `mediaFile` / `mediaKind` / `caption` per message.
- `server.mjs` — add `GET /media/<file>` serving from `wa-media/` (path-traversal
  guarded, same as `serveStatic`; only files inside `wa-media/`).
- `app.js` — render `<img>` / `<video>` / `<audio controls>` / a document
  download link by `mediaKind`; fall back to `jpegThumbnail` while a download
  is `pending`, and to a "media expired" chip when `failed`.

## 5. Insights & gotchas for the grilling

1. **Forward-only.** Existing media is unrecoverable (expired URLs). Set
   expectations: capture starts the day this ships. `jpegThumbnail` (§3) is the
   only thing that rescues old image/video messages.
2. **Disk size.** 13k images + 8.6k videos. The sample video was 916 KB for 9s;
   videos dominate. Unbounded, this is multi-GB and grows forever. Needs a
   policy: a size cap, per-kind opt-out (e.g. skip video), age-based pruning, or
   a max-file-size skip. Grill the retention model before building.
3. **Opt-in env var.** Consistent with `OPENCLAW_DEV_MODE_WA_SAVE_MESSAGES`,
   gate media capture behind `OPENCLAW_DEV_MODE_WA_SAVE_MEDIA=1`. Heavy I/O and
   disk use should never be on by default.
4. **Nested wrappers.** Media is not always top-level: `albumMessage`,
   `documentWithCaptionMessage`, `ephemeralMessage` (disappearing), and
   view-once wrappers nest the real node. The detector must unwrap. `ptvMessage`
   is a round video note.
5. **Concurrency / rate.** Downloading inline on every upsert can stampede
   (imagine a 200-message history sync). Use a bounded queue; downloads are
   best-effort and may lag the row insert — that is fine.
6. **Failed decrypts.** Messages with `messageStubType` = ciphertext-error
   ("No session found to decrypt message") have no recoverable media. Mark
   `failed`, don't retry forever.
7. **`from_me` media.** Media we _sent_ is downloadable too — include it.
8. **Stickers / voice notes.** `image/webp` stickers and `audio/ogg; opus`
   voice notes (`ptt: true`, with a `waveform`) render fine in browsers.
9. **Security.** Never trust `fileName` as a disk path. Serve `wa-media/` with
   the same path-traversal guard as static files. The panel is token-gated, but
   media URLs should still resolve only inside `wa-media/`.
10. **Backfill via reupload.** For _recent_ messages (last ~2 weeks) a one-shot
    backfill using `sock.updateMediaMessage` could rescue media missed between
    "messages logging on" and "media capture on". Optional, time-boxed.

## 6. Open questions to grill

- Pointer model: column-on-`messages` vs. separate `media` table (§4.2)?
- Retention policy — cap by total size, by age, by per-kind opt-out? Skip video?
- Do we capture `from_me` media and group media, or DM-only first?
- Ship the `jpegThumbnail` quick win (§3) as its own tiny step first?
- Caption: reuse `body`, or a dedicated `caption` column?
- Is media browsing in-scope for the read-only panel, or does it wait for v2?
