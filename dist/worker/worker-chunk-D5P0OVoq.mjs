import{n as e}from"./worker-chunk-lTaEq7OX.mjs";import{t}from"./worker-chunk-ARwSM3No.mjs";import{p as n}from"./worker-chunk-DLQDO6n2.mjs";import{c as r,p as i}from"./worker-chunk-BeiQcY8B.mjs";import{A as a,o}from"./worker-chunk-2YU_cJ4H.mjs";import{i as s,t as c}from"./worker-chunk-B1YzM0QK.mjs";import{n as l,t as u}from"./worker-chunk-DG8Xglej.mjs";import{r as d,t as f}from"./worker-chunk-BBJ6v1Ek.mjs";import{a as p,n as m,r as h}from"./worker-chunk-CUSFQFQE.mjs";import{N as g,f as _}from"./worker-chunk-2D-Xow9R.mjs";import{i as v}from"./worker-chunk-B4Ia9Kcf.mjs";import{o as y,t as b}from"./worker-chunk-XVV02qRu.mjs";import{a as x}from"./worker-chunk-CQ5jHLDB.mjs";import{i as S}from"./worker-chunk-p_wNbL3_.mjs";import{n as C,t as w}from"./worker-chunk-B1mDJicP.mjs";import{t as T}from"./worker-chunk-BHPhgIwT.mjs";import E from"node:fs";import D from"node:path";import O from"node:fs/promises";function resolveToolsMdMigrationWorkspaceTargets(e){let t=/* @__PURE__ */ new Map;for(let n of g(e)){let r=_(e,n),i=D.resolve(r),a=t.get(i);a===void 0?t.set(i,{primaryAgentId:n,agentIds:[n],workspaceDir:r}):a.agentIds.push(n)}return[...t.values()]}function describeToolsMdMergedBootstrapLimits(e){return e.agentIds.flatMap(t=>{let n=x(e.cfg,t);return e.mergedChars<=n?[]:[{agentId:t,message:`Agent "${t}" TOOLS.md migration will produce a ${e.mergedChars}-character AGENTS.md, exceeding its configured bootstrapMaxChars limit of ${n}. Raise \`agents.entries.*.bootstrapMaxChars\` for this agent, or \`agents.defaults.bootstrapMaxChars\` as fallback, to preserve all migrated instructions.`}]})}var k=e((()=>{v(),T()}));function shouldMergeToolsMd(e){return e.trim().length>0&&e!==A&&e!==j&&e!==M}var A,j,M,N=e((()=>{A=`# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup: camera names and locations, SSH hosts and aliases, preferred TTS voices, speaker/room names, device nicknames, anything environment-specific.

## Examples

\`\`\`markdown
### Cameras

- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

### SSH

- home-server → 192.168.1.100, user: admin

### TTS

- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod
\`\`\`

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

Add whatever helps you do your job. This is your cheat sheet.

## Related

- [Agent workspace](/concepts/agent-workspace)
`,j=`# TOOLS.md - User Tool Notes (editable)

This file is for _your_ notes about external tools and conventions. It does not define which tools exist; OpenClaw provides built-in tools internally, and skills add the rest.

## Examples

### imsg

- Send an iMessage/SMS: describe who/what, confirm before sending.
- Prefer short messages; avoid sending secrets.

### sag

- Text-to-speech: specify voice, target speaker/room, and whether to stream.

Add whatever else you want the assistant to know about your local toolchain.

## Related

- [TOOLS.md template](/reference/templates/TOOLS)
`,M=`# TOOLS.md - User Tool Notes (editable)

Add your local tool notes here.
`}));function rewriteLegacyAgentsToolsGuidance$1(e){let t=e;for(let[e,n]of P)t=t.replaceAll(e,n);return t}var P,F=e((()=>{P=[["Skills provide your tools. When you need one, check its `SKILL.md`. Keep local notes (camera names, SSH details, voice preferences) in `TOOLS.md`.",`Skills define how tools work. Keep environment-specific local notes in this section.`],["- Keep environment-specific notes in `TOOLS.md` (notes for skills).","- Keep environment-specific notes in this file's `## Tools` section."],["- Keep environment-specific notes in `TOOLS.md` (Notes for Skills).","- Keep environment-specific notes in this file's `## Tools` section."],["- You learn a lesson -> update `AGENTS.md`, `TOOLS.md`, or the relevant skill.","- You learn a lesson -> update `AGENTS.md` or the relevant skill."],[`- When you learn a lesson → update AGENTS.md, TOOLS.md, or the relevant skill`,`- When you learn a lesson → update AGENTS.md or the relevant skill`],["Skills 提供你的工具。当你需要某个工具时，查看它的 `SKILL.md`。在 `TOOLS.md` 中保存本地笔记（摄像头名称、SSH 详情、语音偏好等）。",`Skills 定义工具的使用方式。请将环境特定的本地笔记保存在本节中。`],["技能提供你的工具。当你需要某个工具时，查看它的 `SKILL.md`。在 `TOOLS.md` 中保存本地笔记（摄像头名称、SSH 详情、语音偏好等）。",`技能定义工具的使用方式。请将环境特定的本地笔记保存在本节中。`],["- 在 `TOOLS.md` 中保存环境特定的笔记（Skills 注意事项）。","- 将环境特定的笔记保存在本文件的 `## Tools` 部分。"],["- 将环境相关的备注保存在 `TOOLS.md`（Skills 备注）中。","- 将环境相关的备注保存在本文件的 `## Tools` 部分。"],["- 将环境相关的备注保存在 `TOOLS.md`（技能备注）中。","- 将环境相关的备注保存在本文件的 `## Tools` 部分。"],[`- 当你学到教训 → 更新 AGENTS.md、TOOLS.md 或相关 Skills 文件`,`- 当你学到教训 → 更新 AGENTS.md 或相关 Skills 文件`],[`- 当你学到教训 → 更新 AGENTS.md、TOOLS.md 或相关技能文件`,`- 当你学到教训 → 更新 AGENTS.md 或相关技能文件`]]}));function samePosixPermissions(e,t){return e.uid===t.uid&&e.gid===t.gid&&(e.mode&4095)==(t.mode&4095)}function addsPosixReaders(e,t){for(let n of/* @__PURE__ */ new Set([e.uid,t.uid,void 0]))for(let r of[!1,!0])for(let i of[!1,!0]){if(e.gid===t.gid&&r!==i)continue;let a=n===e.uid?256:r?32:4,o=n===t.uid?256:i?32:4;if((t.mode&o)!==0&&(e.mode&a)===0)return!0}return!1}async function assertSourceReadersPreserved(e,t){let n=await readMigrationFileSnapshot({filePath:e.path,label:`TOOLS.md`});if(n.content!==e.content||!n.stat||n.stat.dev!==e.stat.dev||n.stat.ino!==e.stat.ino||!samePosixPermissions(n.stat,e.stat))throw Error(`TOOLS.md changed during migration`);if(addsPosixReaders(n.stat,t))throw Error(`Merging TOOLS.md would grant additional POSIX readers. Review both files' owners, groups, and read permissions before rerunning doctor.`)}async function readMigrationFileSnapshot(e){let t;try{t=await O.lstat(e.filePath)}catch(t){if(e.allowMissing&&t.code===`ENOENT`)return{content:``};throw t}if(!t.isFile()||t.nlink>1)throw Error(`${e.label} must be an unlinked regular file for automatic migration`);let r=await n({filePath:e.filePath}),i=await O.lstat(e.filePath);if(r.stat.nlink!==1||r.stat.dev!==t.dev||r.stat.ino!==t.ino||i.dev!==r.stat.dev||i.ino!==r.stat.ino)throw Error(`${e.label} changed while opening it for migration`);return{content:r.buffer.toString(`utf8`),stat:i}}async function readToolsMd(e){let t=(await O.readdir(e).catch(()=>[])).filter(e=>e.startsWith(`TOOLS.md.doctor-importing-`)||e.startsWith(`AGENTS.md.doctor-backup-`));if(t.length>0)throw Error(`Interrupted v2026.7.2-beta.5 migration artifact(s) left untouched: ${t.join(`, `)}. Restore the desired file manually before rerunning doctor.`);let n=D.join(e,y),r=await readMigrationFileSnapshot({filePath:n,label:`TOOLS.md`,allowMissing:!0});if(r.stat)return{path:n,content:r.content,sha256:d(r.content),stat:r.stat}}function appendWithSpacing(e,t,n=``){return`${e}${e.length===0||e.endsWith(`

`)?``:e.endsWith(`
`)?`
`:`

`}${t}${n.length===0||t.endsWith(`

`)?``:t.endsWith(`
`)?`
`:`

`}${n}`}function mergeToolsMdIntoAgentsMd(e,t){let n=rewriteLegacyAgentsToolsGuidance(e);if(n.includes(I)){if(n.includes(t))return n;let e=n.indexOf(I)+40;return appendWithSpacing(n.slice(0,e),t,n.slice(e))}let r=`${I}\n\n${t}`,i=findToolsSection(n);if(!i)return appendWithSpacing(n,`## Tools\n\n${r}`);let a=i.insertAt;return appendWithSpacing(n.slice(0,a),r,n.slice(a))}function rewriteLegacyAgentsToolsGuidance(e){let t=rewriteLegacyAgentsToolsGuidance$1(e);return t===e?e:ensureLocalNotesHeading(t)}function findToolsSection(e){let t=0,n=!1,r=0,i;for(let a of e.match(/.*(?:\n|$)/gu)??[]){if(a===``)continue;let e=a.replace(/\n$/u,``),o=/^\s*(`{3,}|~{3,})/u.exec(e)?.[1],s=/^\s*(`{3,}|~{3,})\s*$/u.exec(e)?.[1],c=o?.[0];if(c&&!i)i={marker:c,length:o.length};else if(s&&i&&s[0]===i.marker&&s.length>=i.length)i=void 0;else if(!i){let i=/^(#{1,6})\s+(.+?)\s*#*\s*$/u.exec(e);if(i){let e=i[1].length;if(n&&e<=2)return{headingEnd:r,insertAt:t};e===2&&i[2].trim().toLowerCase()===`tools`&&(n=!0,r=t+a.length)}}t+=a.length}return n?{headingEnd:r,insertAt:e.length}:void 0}function ensureLocalNotesHeading(e){let t=findToolsSection(e);if(!t)return e;let n=e.slice(t.headingEnd,t.insertAt);return/^###\s+Local notes(?:\s|$)/imu.test(n)?e:`${e.slice(0,t.headingEnd)}\n### Local notes\n${e.slice(t.headingEnd)}`}async function writeAgentsAtomically(e){let t=await readMigrationFileSnapshot({filePath:e.agentsPath,label:`AGENTS.md`,allowMissing:!0});if(t.content!==e.expected)throw Error(`AGENTS.md changed during TOOLS.md migration`);let n=t.stat,r=n?.mode??384,i=`${e.agentsPath}.doctor-writing-${process.pid}-${Date.now()}`;try{let t;{await using a=await O.open(i,`wx`,384);if(await a.writeFile(e.content,`utf8`),process.platform!==`win32`&&n&&(await a.chmod(0),await a.chown(n.uid,n.gid)),process.platform!==`win32`&&e.importedSource&&await assertSourceReadersPreserved(e.importedSource,n??await a.stat()),n&&await a.chmod(r),t=await a.stat(),process.platform!==`win32`&&n&&!samePosixPermissions(t,n))throw Error(`AGENTS.md ownership or permissions could not be preserved`);await a.sync()}let a=await readMigrationFileSnapshot({filePath:e.agentsPath,label:`AGENTS.md`,allowMissing:!0});if(a.content!==e.expected||a.stat?.dev!==n?.dev||a.stat?.ino!==n?.ino||process.platform!==`win32`&&a.stat&&n&&!samePosixPermissions(a.stat,n))throw Error(`AGENTS.md changed during TOOLS.md migration`);process.platform!==`win32`&&e.importedSource&&await assertSourceReadersPreserved(e.importedSource,t),await O.rename(i,e.agentsPath),await p(D.dirname(e.agentsPath))}catch(e){throw await O.rm(i,{force:!0}),e}}async function recoverInterruptedAgentsWrite(e){let t=D.dirname(e),n=`${D.basename(e)}.doctor-writing-`,r=await O.readdir(t).catch(()=>[]),i=!1;for(let e of r){if(!e.startsWith(n))continue;let r=D.join(t,e),a=await O.lstat(r);if(!a.isFile()||a.nlink!==1)throw Error(`interrupted AGENTS.md write must be an unlinked regular file: ${r}`);await O.rm(r),i=!0}i&&await p(t)}async function removeToolsSource(e,t){let n=await readMigrationFileSnapshot({filePath:e.path,label:`TOOLS.md`});if(d(n.content)!==e.sha256)throw Error(`TOOLS.md changed during migration`);let r=E.lstatSync(e.path);if(!n.stat||r.dev!==n.stat.dev||r.ino!==n.stat.ino||r.dev!==e.stat.dev||r.ino!==e.stat.ino)throw Error(`TOOLS.md changed during migration`);E.unlinkSync(e.path),await p(t)}function archivePathForSource(e,t,n){let r=e.replace(/[^A-Za-z0-9._-]+/g,`-`);return D.join(a(n),`backups`,`tools-md-migration`,`${r}-${t.sha256}.md`)}async function archiveSource(e){let t=archivePathForSource(e.agentId,e.source,e.env),n=D.dirname(t);await O.mkdir(n,{recursive:!0,mode:448});let r=`${t}.doctor-writing-${process.pid}-${Date.now()}`;try{{await using t=await O.open(r,`wx`,384);await t.writeFile(e.source.content,`utf8`),await t.sync()}await h(r,t,L),await O.rm(r),await p(n)}catch(n){if(await O.rm(r,{force:!0}),n.code!==`EEXIST`)throw n;if(d(await O.readFile(t,`utf8`))!==e.source.sha256)throw Error(`TOOLS.md migration archive collision at ${t}`,{cause:n})}return t}async function collectToolsMdMigrationFindings(e){let t={checkId:`core/doctor/tools-md-migration`,severity:`warning`,fixHint:`Run ${u(`openclaw doctor --fix`)} to merge TOOLS.md into AGENTS.md.`},n=[];for(let r of resolveToolsMdMigrationWorkspaceTargets(e))try{let i=await readToolsMd(r.workspaceDir);if(i&&(n.push({...t,target:r.primaryAgentId,path:i.path,message:`Agent "${r.primaryAgentId}" still stores local tool notes in TOOLS.md.`,requirement:`legacy-tools-md`}),shouldMergeToolsMd(i.content))){let a=D.join(r.workspaceDir,b),o=(await readMigrationFileSnapshot({filePath:a,label:`AGENTS.md`,allowMissing:!0})).content,s=mergeToolsMdIntoAgentsMd(o,i.content).length;for(let i of describeToolsMdMergedBootstrapLimits({cfg:e,agentIds:r.agentIds,mergedChars:s}))n.push({...t,target:i.agentId,path:a,message:i.message,requirement:`tools-md-merged-bootstrap-limit`})}}catch(e){n.push({...t,target:r.primaryAgentId,path:D.join(r.workspaceDir,y),message:`Agent "${r.primaryAgentId}" TOOLS.md cannot be migrated: ${c(e)}`,severity:`error`,requirement:`tools-md-migration-blocked`})}return n}async function maybeMigrateToolsMd(e){let t=e.env??process.env,n=[],r=[];for(let a of resolveToolsMdMigrationWorkspaceTargets(e.cfg))try{let r=await readToolsMd(a.workspaceDir);if(!r)continue;if(!e.shouldRepair){C(`${i(r.path)} will be archived and merged into AGENTS.md when customized.`,`TOOLS.md migration preview`);continue}let o=shouldMergeToolsMd(r.content);await archiveSource({agentId:a.primaryAgentId,source:r,env:t});let s=D.join(a.workspaceDir,b);await recoverInterruptedAgentsWrite(s);let c=(await readMigrationFileSnapshot({filePath:s,label:`AGENTS.md`,allowMissing:!0})).content,l=o?mergeToolsMdIntoAgentsMd(c,r.content):rewriteLegacyAgentsToolsGuidance(c);if(l!==c&&(await writeAgentsAtomically({agentsPath:s,expected:c,content:l,importedSource:o&&!c.includes(r.content)?r:void 0}),(await readMigrationFileSnapshot({filePath:s,label:`AGENTS.md`})).content!==l))throw Error(`AGENTS.md changed after TOOLS.md migration was written`);await p(a.workspaceDir),await removeToolsSource(r,a.workspaceDir),n.push(o?`Merged ${i(r.path)} into AGENTS.md and archived the original.`:`Removed untouched ${i(r.path)} after archiving it.`)}catch(e){r.push(`Agent "${a.primaryAgentId}" TOOLS.md was not migrated: ${c(e)}`)}return n.length>0&&C(n.join(`
`),`TOOLS.md migration`),r.length>0&&C(r.join(`
`),`Doctor warnings`),{changes:n,warnings:r}}var I,L;e((()=>{t(),f(),w(),S(),l(),o(),m(),s(),r(),k(),N(),F(),I=`### Local notes (migrated from TOOLS.md)`,L={strategy:`link-or-copy`,durability:`degrade`}}))();export{collectToolsMdMigrationFindings,maybeMigrateToolsMd};