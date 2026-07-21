import{n as e,r as t,t as n}from"./decorate-CUyPCN2p.js";import{a as r,f as i,g as a,h as o,l as s,m as c,p as l}from"./lit-runtime-B2f-BITn.js";import{t as u}from"./string-coerce-BuYUxt7q.js";import{t as d}from"./string-normalization-BzUT2-1w.js";import{r as f}from"./i18n-Cb2Gon67.js";import{t as p}from"./preload-helper-DYl5dUZ5.js";import{d as m}from"./session-key-O2mAF18C.js";import{At as h,Dt as g,Er as _,Et as v,Fr as y,Ot as b,Pr as x,Tt as S,Yt as C,br as w,dt as T,ft as E,jt as D,kt as ee}from"./index-DMlQdn8s.js";import{t as O}from"./settings-workspace-BdKXKfXa.js";import{_ as te,a as ne,b as k,c as re,d as A,f as ie,g as j,h as ae,i as oe,l as se,m as ce,o as le,p as ue,r as de,s as fe,t as pe,u as me,v as he,y as ge}from"./display-DUm1hEc9.js";import{a as _e,n as ve,r as ye,t as be}from"./presenter-TTfHKEn1.js";import{c as xe,d as Se,g as Ce,i as we}from"./cron-BRAkk0dA.js";import{v as Te}from"./markdown-runtime-Y4RdJ3Nc.js";import{a as Ee,i as De,n as Oe,t as ke}from"./skills-shared-B2QdG3g1.js";function Ae(e,t){if(!e)return e;let n=e.files.some(e=>e.name===t.name)?e.files.map(e=>e.name===t.name?t:e):[...e.files,t];return{...e,files:n}}async function je(e,t,n,r){if(!e.client||!e.connected||e.agentFilesLoading)return!1;if(!r?.force&&Object.hasOwn(e.agentFileContents,n))return!0;e.agentFilesLoading=!0,e.agentFilesError=null;try{let i=await e.client.request(`agents.files.get`,{agentId:t,name:n});if(i?.file){let t=i.file.content??``,a=e.agentFileContents[n]??``,o=e.agentFileDrafts[n],s=r?.preserveDraft??!0;return e.agentFilesList=Ae(e.agentFilesList,i.file),e.agentFileContents={...e.agentFileContents,[n]:t},(!s||!Object.hasOwn(e.agentFileDrafts,n)||o===a)&&(e.agentFileDrafts={...e.agentFileDrafts,[n]:t}),!0}}catch(t){return e.agentFilesError=String(t),!1}finally{e.agentFilesLoading=!1}return!1}async function Me(e,t,n,r){if(!(!e.client||!e.connected||e.agentFileSaving)){e.agentFileSaving=!0,e.agentFilesError=null;try{let i=await e.client.request(`agents.files.set`,{agentId:t,name:n,content:r});i?.file&&(e.agentFilesList=Ae(e.agentFilesList,i.file),e.agentFileContents={...e.agentFileContents,[n]:r},e.agentFileDrafts={...e.agentFileDrafts,[n]:r})}catch(t){e.agentFilesError=String(t)}finally{e.agentFileSaving=!1}}}async function Ne(e,t){if(!(!e.client||!e.connected)&&!e.agentSkillsLoading){e.agentSkillsLoading=!0,e.agentSkillsError=null;try{let n=await C(e.client,t);n&&(e.agentSkillsReport=n,e.agentSkillsAgentId=t)}catch(t){e.agentSkillsError=String(t)}finally{e.agentSkillsLoading=!1}}}function Pe(e){let{agent:t,configForm:n,agentFilesList:r,configLoading:i,configSaving:s,configDirty:c,onConfigReload:l,onConfigSave:u,onModelChange:d,onModelFallbacksChange:p,onSelectPanel:m}=e,h=!!(e.defaultId&&t.id===e.defaultId),g=A(n,t.id),_=t.model,v=(r&&r.agentId===t.id?r.workspace:null)||g.entry?.workspace||g.defaults?.workspace||t.workspace||`default`,y=g.entry?.model?ae(g.entry?.model):g.defaults?.model?ae(g.defaults?.model):ae(_),b=ie(t.agentRuntime),x=ae(g.defaults?.model??_),S=j(g.entry?.model),C=j(g.defaults?.model)||(x===`-`?null:se(x))||(n?null:j(_)),w=S??C??null,T=h?w:S,E=ce(g.entry?.model)??ce(g.defaults?.model)??(n?null:ce(_))??[],D=Array.isArray(g.entry?.skills)?g.entry?.skills:null,ee=D?.length??null,O=!n||i||s,te=t.thinkingDefault??`-`,ne=e=>{let n=E.filter((t,n)=>n!==e);p(t.id,n)};return a`
    <section class="card">
      <div class="card-title">Overview</div>
      <div class="card-sub">Workspace paths and identity metadata.</div>

      <div class="agents-overview-grid" style="margin-top: 16px;">
        <div class="agent-kv">
          <div class="label">Workspace</div>
          <div>
            <openclaw-tooltip content="Open Files tab">
              <button
                type="button"
                class="workspace-link mono"
                @click=${()=>m(`files`)}
                aria-label="Open Files tab"
              >
                ${v}
              </button>
            </openclaw-tooltip>
          </div>
        </div>
        <div class="agent-kv">
          <div class="label">Primary Model</div>
          <div class="mono">${y}</div>
        </div>
        <div class="agent-kv">
          <div class="label">Runtime</div>
          <div class="mono">${b}</div>
        </div>
        <div class="agent-kv">
          <div class="label">${f(`agents.context.thinkingDefault`)}</div>
          <div class="mono">${te}</div>
        </div>
        <div class="agent-kv">
          <div class="label">Skills Filter</div>
          <div>${D?`${ee} selected`:`all skills`}</div>
        </div>
      </div>

      ${c?a`
            <div class="callout warn" style="margin-top: 16px">
              You have unsaved config changes.
            </div>
          `:o}

      <div class="agent-model-select" style="margin-top: 20px;">
        <div class="label">Model Selection</div>
        <div class="agent-model-fields">
          <label class="field">
            <span>Primary model${h?` (default)`:``}</span>
            <select
              .value=${T??``}
              ?disabled=${O}
              @change=${e=>d(t.id,e.target.value||null)}
            >
              ${h?a` <option value="" ?selected=${!T}>Not set</option> `:a`
                    <option value="" ?selected=${!T}>
                      ${C?`Inherit default (${C})`:`Inherit default`}
                    </option>
                  `}
              ${oe(n,w??void 0,e.modelCatalog,T)}
            </select>
          </label>
          <div class="field">
            <span>Fallbacks</span>
            <div
              class="agent-chip-input"
              @click=${e=>{let t=e.currentTarget.querySelector(`input`);t&&t.focus()}}
            >
              ${E.map((e,t)=>a`
                  <span class="chip">
                    ${e}
                    <button
                      type="button"
                      class="chip-remove"
                      ?disabled=${O}
                      @click=${()=>ne(t)}
                    >
                      &times;
                    </button>
                  </span>
                `)}
              <input
                ?disabled=${O}
                placeholder=${E.length===0?`provider/model`:``}
                @keydown=${e=>{let n=e.target;if(e.key===`Enter`||e.key===`,`){e.preventDefault();let r=me(n.value);r.length>0&&(p(t.id,[...E,...r]),n.value=``)}}}
                @blur=${e=>{let n=e.target,r=me(n.value);r.length>0&&(p(t.id,[...E,...r]),n.value=``)}}
              />
            </div>
          </div>
        </div>
        <div class="agent-model-actions">
          <button
            type="button"
            class="btn btn--sm"
            ?disabled=${i}
            @click=${l}
          >
            ${f(`common.reloadConfig`)}
          </button>
          <button
            type="button"
            class="btn btn--sm primary"
            ?disabled=${s||!c}
            @click=${u}
          >
            ${s?`Saving…`:`Save`}
          </button>
        </div>
      </div>
    </section>
  `}var Fe=Object.defineProperty,Ie=(e,t,n)=>t in e?Fe(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,M=(e,t,n)=>Ie(e,typeof t==`symbol`?t:t+``,n),Le={classPrefix:`cm-`,theme:`github`,linkTarget:`_blank`,sanitize:!1,plugins:[],customRenderers:{}};function Re(e){return{...Le,...e,plugins:e?.plugins??[],customRenderers:e?.customRenderers??{}}}function ze(e,t){return typeof t==`function`?t(e):e}function Be(e,t){let n=Re(t),r=n.classPrefix,i=e;for(let e of n.plugins)e.transformBlock&&(i=i.map(e.transformBlock));let a=`<div class="${r}preview">${i.map(e=>{for(let t of n.plugins)if(t.renderBlock){let r=t.renderBlock(e,()=>He(e,n));if(r!==null)return r}let t=n.customRenderers[e.type];return t?t(e):He(e,n)}).join(`
`)}</div>`;return a=ze(a,n.sanitize),a}async function Ve(e,t){let n=Re(t);for(let e of n.plugins)e.init&&await e.init();let r=Be(e,t);for(let e of n.plugins)e.postProcess&&(r=await e.postProcess(r));return r}function He(e,t){let n=t.classPrefix;switch(e.type){case`paragraph`:return`<p class="${n}paragraph">${N(e.content,t)}</p>`;case`heading`:return Ue(e,t);case`bulletList`:return We(e,t);case`numberedList`:return Ge(e,t);case`checkList`:return Ke(e,t);case`codeBlock`:return qe(e,t);case`blockquote`:return`<blockquote class="${n}blockquote">${N(e.content,t)}</blockquote>`;case`table`:return Je(e,t);case`image`:return Ye(e,t);case`divider`:return`<hr class="${n}divider" />`;case`callout`:return Xe(e,t);default:return`<div class="${n}unknown">${N(e.content,t)}</div>`}}function Ue(e,t){let n=t.classPrefix,r=e.props.level,i=`h${r}`;return`<${i} class="${n}heading ${n}h${r}">${N(e.content,t)}</${i}>`}function We(e,t){return`<ul class="${t.classPrefix}bullet-list">
${e.children.map(e=>`<li>${N(e.content,t)}</li>`).join(`
`)}
</ul>`}function Ge(e,t){return`<ol class="${t.classPrefix}numbered-list">
${e.children.map(e=>`<li>${N(e.content,t)}</li>`).join(`
`)}
</ol>`}function Ke(e,t){let n=t.classPrefix,r=e.props.checked;return`
<div class="${n}checklist-item">
  <input type="checkbox" ${r?`checked disabled`:`disabled`} />
  <span class="${r?`${n}checked`:``}">${N(e.content,t)}</span>
</div>`.trim()}function qe(e,t){let n=t.classPrefix,r=e.content.map(e=>e.text).join(``),i=e.props.language||``,a=P(r),o=i?` language-${i}`:``;return`<pre class="${n}code-block"${i?` data-language="${i}"`:``}><code class="${n}code${o}">${a}</code></pre>`}function Je(e,t){let n=t.classPrefix,{headers:r,rows:i,alignments:a}=e.props,o=e=>{let t=a?.[e];return t?` style="text-align: ${t}"`:``};return`<table class="${n}table">
${r.length>0?`<thead><tr>${r.map((e,t)=>`<th${o(t)}>${P(e)}</th>`).join(``)}</tr></thead>`:``}
<tbody>
${i.map(e=>`<tr>${e.map((e,t)=>`<td${o(t)}>${P(e)}</td>`).join(``)}</tr>`).join(`
`)}
</tbody>
</table>`}function Ye(e,t){let n=t.classPrefix,{url:r,alt:i,title:a,width:o,height:s}=e.props,c=i?` alt="${P(i)}"`:` alt=""`,l=a?` title="${P(a)}"`:``,u=o?` width="${o}"`:``,d=s?` height="${s}"`:``;return`<figure class="${n}image">${`<img src="${P(r)}"${c}${l}${u}${d} />`}${i?`<figcaption>${P(i)}</figcaption>`:``}</figure>`}function Xe(e,t){let n=t.classPrefix,r=e.props.type;return`
<div class="${n}callout ${n}callout-${r}" role="alert">
  <strong class="${n}callout-title">${r}</strong>
  <div class="${n}callout-content">${N(e.content,t)}</div>
</div>`.trim()}function N(e,t){return e.map(e=>Ze(e,t)).join(``)}function Ze(e,t){let n=P(e.text),r=e.styles;if(r.code&&(n=`<code>${n}</code>`),r.highlight&&(n=`<mark>${n}</mark>`),r.strikethrough&&(n=`<del>${n}</del>`),r.underline&&(n=`<u>${n}</u>`),r.italic&&(n=`<em>${n}</em>`),r.bold&&(n=`<strong>${n}</strong>`),r.link){let e=t.linkTarget===`_blank`?` target="_blank" rel="noopener noreferrer"`:``,i=r.link.title?` title="${P(r.link.title)}"`:``;n=`<a href="${P(r.link.url)}"${i}${e}>${n}</a>`}return n}function P(e){return e.replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`).replace(/'/g,`&#039;`)}function Qe(e){return[...[1,2,3,4,5,6].map(t=>({tag:`h${t}`,classes:[`${e}heading`,`${e}h${t}`]})),{tag:`p`,classes:[`${e}paragraph`]},{tag:`ul`,classes:[`${e}bullet-list`]},{tag:`ol`,classes:[`${e}numbered-list`]},{tag:`pre`,classes:[`${e}code-block`]},{tag:`blockquote`,classes:[`${e}blockquote`]},{tag:`hr`,classes:[`${e}divider`]},{tag:`table`,classes:[`${e}table`]},{tag:`figure`,classes:[`${e}image`]}]}function $e(e,t){let n=t.join(` `),r=/\bclass\s*=\s*"([^"]*)"/i,i=e.match(r);return i?e.replace(r,`class="${n} ${i[1]}"`):e.endsWith(`/>`)?e.slice(0,-2)+` class="${n}" />`:e.slice(0,-1)+` class="${n}">`}function et(e,t){return e.replace(/(?<!<figure[^>]*>\s*)(<img\s[^>]*\/?>)(?!\s*<\/figure>)/gi,`<figure class="${t}image">$1</figure>`)}function tt(e,t){let n=t?.classPrefix??`cm-`,r=t?.wrapperClass??`${n}preview`,i=Qe(n),a=e;for(let{tag:e,classes:t}of i){let n=RegExp(`<${e}(\\s[^>]*)?>|<${e}\\s*\\/?>`,`gi`);a=a.replace(n,e=>$e(e,t))}return a=et(a,n),a=`<div class="${r}">${a}</div>`,typeof t?.sanitize==`function`&&(a=t.sanitize(a)),a}async function nt(e){try{return(await p(()=>import(`./preview-BBw3vauN.js`),[],import.meta.url)).parse(e)}catch{throw Error(`@create-markdown/core is required to parse markdown in <markdown-preview>. Install it, or provide pre-parsed blocks via the blocks attribute / setBlocks().`)}}M(class extends HTMLElement{constructor(){super(),M(this,`_shadow`,null),M(this,`plugins`,[]),M(this,`defaultTheme`,`github`),M(this,`styleElement`),M(this,`contentElement`);let e=this.constructor._shadowMode;e!==`none`&&(this._shadow=this.attachShadow({mode:e})),this.styleElement=document.createElement(`style`),this.renderRoot.appendChild(this.styleElement),this.contentElement=document.createElement(`div`),this.contentElement.className=`markdown-preview-content`,this.renderRoot.appendChild(this.contentElement),this.updateStyles()}static get observedAttributes(){return[`theme`,`link-target`,`async`]}get renderRoot(){return this._shadow??this}connectedCallback(){this.render()}attributeChangedCallback(e,t,n){this.render()}setPlugins(e){this.plugins=e,this.render()}setDefaultTheme(e){this.defaultTheme=e,this.render()}getMarkdown(){let e=this.getAttribute(`blocks`);if(e)try{return JSON.parse(e).map(e=>e.content.map(e=>e.text).join(``)).join(`

`)}catch{return``}return this.textContent||``}setMarkdown(e){this.textContent=e,this.render()}setBlocks(e){this.setAttribute(`blocks`,JSON.stringify(e)),this.render()}getOptions(){return{theme:this.getAttribute(`theme`)||this.defaultTheme,linkTarget:this.getAttribute(`link-target`)||`_blank`,plugins:this.plugins}}async getBlocks(){let e=this.getAttribute(`blocks`);if(e)try{return JSON.parse(e)}catch{return console.warn(`Invalid blocks JSON in markdown-preview element`),[]}return nt(this.textContent||``)}async render(){let e=await this.getBlocks(),t=this.getOptions(),n=this.hasAttribute(`async`)||this.plugins.length>0;try{let r;r=n?await Ve(e,t):Be(e,t),this.contentElement.innerHTML=r}catch(e){console.error(`Error rendering markdown preview:`,e),this.contentElement.innerHTML=`<div class="error">Error rendering content</div>`}}updateStyles(){let e=this.plugins.filter(e=>e.getCSS).map(e=>e.getCSS()).join(`

`),t=this._shadow?`:host { display: block; }`:`markdown-preview { display: block; }`;this.styleElement.textContent=`
${t}

.markdown-preview-content {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif;
  font-size: 16px;
  line-height: 1.6;
}

.error {
  color: #cf222e;
  padding: 1rem;
  background: #ffebe9;
  border-radius: 6px;
}

${e}
    `.trim()}},`_shadowMode`,`open`);function rt(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}var F=rt();function it(e){F=e}var I={exec:()=>null};function L(e){let t=[];return n=>{let r=Math.max(0,Math.min(3,n-1)),i=t[r];return i||(i=e(r),t[r]=i),i}}function R(e,t=``){let n=typeof e==`string`?e:e.source,r={replace:(e,t)=>{let i=typeof t==`string`?t:t.source;return i=i.replace(z.caret,`$1`),n=n.replace(e,i),r},getRegex:()=>new RegExp(n,t)};return r}var at=((e=``)=>{try{return!!RegExp(`(?<=1)(?<!1)`+e)}catch{return!1}})(),z={codeRemoveIndent:/^(?: {1,4}| {0,3}\t)/gm,outputLinkReplace:/\\([\[\]])/g,indentCodeCompensation:/^(\s+)(?:```)/,beginningSpace:/^\s+/,endingHash:/#$/,startingSpaceChar:/^ /,endingSpaceChar:/ $/,nonSpaceChar:/[^ ]/,newLineCharGlobal:/\n/g,tabCharGlobal:/\t/g,multipleSpaceGlobal:/\s+/g,blankLine:/^[ \t]*$/,doubleBlankLine:/\n[ \t]*\n[ \t]*$/,blockquoteStart:/^ {0,3}>/,blockquoteSetextReplace:/\n {0,3}((?:=+|-+) *)(?=\n|$)/g,blockquoteSetextReplace2:/^ {0,3}>[ \t]?/gm,listReplaceNesting:/^ {1,4}(?=( {4})*[^ ])/g,listIsTask:/^\[[ xX]\] +\S/,listReplaceTask:/^\[[ xX]\] +/,listTaskCheckbox:/\[[ xX]\]/,anyLine:/\n.*\n/,hrefBrackets:/^<(.*)>$/,tableDelimiter:/[:|]/,tableAlignChars:/^\||\| *$/g,tableRowBlankLine:/\n[ \t]*$/,tableAlignRight:/^ *-+: *$/,tableAlignCenter:/^ *:-+: *$/,tableAlignLeft:/^ *:-+ *$/,startATag:/^<a /i,endATag:/^<\/a>/i,startPreScriptTag:/^<(pre|code|kbd|script)(\s|>)/i,endPreScriptTag:/^<\/(pre|code|kbd|script)(\s|>)/i,startAngleBracket:/^</,endAngleBracket:/>$/,pedanticHrefTitle:/^([^'"]*[^\s])\s+(['"])(.*)\2/,unicodeAlphaNumeric:/[\p{L}\p{N}]/u,escapeTest:/[&<>"']/,escapeReplace:/[&<>"']/g,escapeTestNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,escapeReplaceNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,caret:/(^|[^\[])\^/g,percentDecode:/%25/g,findPipe:/\|/g,splitPipe:/ \|/,slashPipe:/\\\|/g,carriageReturn:/\r\n|\r/g,spaceLine:/^ +$/gm,notSpaceStart:/^\S*/,endingNewline:/\n$/,listItemRegex:e=>RegExp(`^( {0,3}${e})((?:[	 ][^\\n]*)?(?:\\n|$))`),nextBulletRegex:L(e=>RegExp(`^ {0,${e}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`)),hrRegex:L(e=>RegExp(`^ {0,${e}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`)),fencesBeginRegex:L(e=>RegExp(`^ {0,${e}}(?:\`\`\`|~~~)`)),headingBeginRegex:L(e=>RegExp(`^ {0,${e}}#`)),htmlBeginRegex:L(e=>RegExp(`^ {0,${e}}<(?:[a-z].*>|!--)`,`i`)),blockquoteBeginRegex:L(e=>RegExp(`^ {0,${e}}>`))},ot=/^(?:[ \t]*(?:\n|$))+/,st=/^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,ct=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,B=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,lt=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,ut=/ {0,3}(?:[*+-]|\d{1,9}[.)])/,dt=/^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,ft=R(dt).replace(/bull/g,ut).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/\|table/g,``).getRegex(),pt=R(dt).replace(/bull/g,ut).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/table/g,/ {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(),mt=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,ht=/^[^\n]+/,gt=/(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/,_t=R(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace(`label`,gt).replace(`title`,/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(),vt=R(/^(bull)([ \t][^\n]*?)?(?:\n|$)/).replace(/bull/g,ut).getRegex(),V=`address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul`,yt=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,bt=R(`^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))`,`i`).replace(`comment`,yt).replace(`tag`,V).replace(`attribute`,/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),xt=R(mt).replace(`hr`,B).replace(`heading`,` {0,3}#{1,6}(?:\\s|$)`).replace(`|lheading`,``).replace(`|table`,``).replace(`blockquote`,` {0,3}>`).replace(`fences`," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace(`list`,` {0,3}(?:[*+-]|1[.)])[ \\t]+[^ \\t\\n]`).replace(`html`,`</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)`).replace(`tag`,V).getRegex(),St={blockquote:R(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace(`paragraph`,xt).getRegex(),code:st,def:_t,fences:ct,heading:lt,hr:B,html:bt,lheading:ft,list:vt,newline:ot,paragraph:xt,table:I,text:ht},Ct=R(`^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)`).replace(`hr`,B).replace(`heading`,` {0,3}#{1,6}(?:\\s|$)`).replace(`blockquote`,` {0,3}>`).replace(`code`,`(?: {4}| {0,3}	)[^\\n]`).replace(`fences`," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace(`list`,` {0,3}(?:[*+-]|1[.)])[ \\t]`).replace(`html`,`</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)`).replace(`tag`,V).getRegex(),wt={...St,lheading:pt,table:Ct,paragraph:R(mt).replace(`hr`,B).replace(`heading`,` {0,3}#{1,6}(?:\\s|$)`).replace(`|lheading`,``).replace(`table`,Ct).replace(`blockquote`,` {0,3}>`).replace(`fences`," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace(`list`,` {0,3}(?:[*+-]|1[.)])[ \\t]+[^ \\t\\n]`).replace(`html`,`</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)`).replace(`tag`,V).getRegex()},Tt={...St,html:R(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace(`comment`,yt).replace(/tag/g,`(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b`).getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:I,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:R(mt).replace(`hr`,B).replace(`heading`,` *#{1,6} *[^
]`).replace(`lheading`,ft).replace(`|table`,``).replace(`blockquote`,` {0,3}>`).replace(`|fences`,``).replace(`|list`,``).replace(`|html`,``).replace(`|tag`,``).getRegex()},Et=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,Dt=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,Ot=/^( {2,}|\\)\n(?!\s*$)/,kt=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,H=/[\p{P}\p{S}]/u,U=/[\s\p{P}\p{S}]/u,At=/[^\s\p{P}\p{S}]/u,jt=R(/^((?![*_])punctSpace)/,`u`).replace(/punctSpace/g,U).getRegex(),Mt=/(?!~)[\p{P}\p{S}]/u,Nt=/(?!~)[\s\p{P}\p{S}]/u,Pt=/(?:[^\s\p{P}\p{S}]|~)/u,Ft=R(/link|precode-code|html/,`g`).replace(`link`,/\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace(`precode-`,at?"(?<!`)()":"(^^|[^`])").replace(`code`,/(?<b>`+)[^`]+\k<b>(?!`)/).replace(`html`,/<(?! )[^<>]*?>/).getRegex(),It=/^(?:\*+(?:((?!\*)punct)|([^\s*]))?)|^_+(?:((?!_)punct)|([^\s_]))?/,Lt=R(It,`u`).replace(/punct/g,H).getRegex(),Rt=R(It,`u`).replace(/punct/g,Mt).getRegex(),zt=`^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)`,Bt=R(zt,`gu`).replace(/notPunctSpace/g,At).replace(/punctSpace/g,U).replace(/punct/g,H).getRegex(),Vt=R(zt,`gu`).replace(/notPunctSpace/g,Pt).replace(/punctSpace/g,Nt).replace(/punct/g,Mt).getRegex(),Ht=R(`^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)`,`gu`).replace(/notPunctSpace/g,At).replace(/punctSpace/g,U).replace(/punct/g,H).getRegex(),Ut=R(/^~~?(?:((?!~)punct)|[^\s~])/,`u`).replace(/punct/g,H).getRegex(),Wt=R(`^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)`,`gu`).replace(/notPunctSpace/g,At).replace(/punctSpace/g,U).replace(/punct/g,H).getRegex(),Gt=R(/\\(punct)/,`gu`).replace(/punct/g,H).getRegex(),Kt=R(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace(`scheme`,/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace(`email`,/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),qt=R(yt).replace(`(?:-->|$)`,`-->`).getRegex(),Jt=R(`^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>`).replace(`comment`,qt).replace(`attribute`,/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),W=/(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\])|[^\[\]\\`])*?/,Yt=R(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/).replace(`label`,W).replace(`href`,/<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace(`title`,/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(),Xt=R(/^!?\[(label)\]\[(ref)\]/).replace(`label`,W).replace(`ref`,gt).getRegex(),Zt=R(/^!?\[(ref)\](?:\[\])?/).replace(`ref`,gt).getRegex(),Qt=R(`reflink|nolink(?!\\()`,`g`).replace(`reflink`,Xt).replace(`nolink`,Zt).getRegex(),$t=/[hH][tT][tT][pP][sS]?|[fF][tT][pP]/,en={_backpedal:I,anyPunctuation:Gt,autolink:Kt,blockSkip:Ft,br:Ot,code:Dt,del:I,delLDelim:I,delRDelim:I,emStrongLDelim:Lt,emStrongRDelimAst:Bt,emStrongRDelimUnd:Ht,escape:Et,link:Yt,nolink:Zt,punctuation:jt,reflink:Xt,reflinkSearch:Qt,tag:Jt,text:kt,url:I},tn={...en,link:R(/^!?\[(label)\]\((.*?)\)/).replace(`label`,W).getRegex(),reflink:R(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace(`label`,W).getRegex()},nn={...en,emStrongRDelimAst:Vt,emStrongLDelim:Rt,delLDelim:Ut,delRDelim:Wt,url:R(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace(`protocol`,$t).replace(`email`,/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,text:R(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace(`protocol`,$t).getRegex()},rn={...nn,br:R(Ot).replace(`{2,}`,`*`).getRegex(),text:R(nn.text).replace(`\\b_`,`\\b_| {2,}\\n`).replace(/\{2,\}/g,`*`).getRegex()},an={normal:St,gfm:wt,pedantic:Tt},G={normal:en,gfm:nn,breaks:rn,pedantic:tn},on={"&":`&amp;`,"<":`&lt;`,">":`&gt;`,'"':`&quot;`,"'":`&#39;`},sn=e=>on[e];function K(e,t){if(t){if(z.escapeTest.test(e))return e.replace(z.escapeReplace,sn)}else if(z.escapeTestNoEncode.test(e))return e.replace(z.escapeReplaceNoEncode,sn);return e}function cn(e){try{e=encodeURI(e).replace(z.percentDecode,`%`)}catch{return null}return e}function ln(e,t){let n=e.replace(z.findPipe,(e,t,n)=>{let r=!1,i=t;for(;--i>=0&&n[i]===`\\`;)r=!r;return r?`|`:` |`}).split(z.splitPipe),r=0;if(n[0].trim()||n.shift(),n.length>0&&!n.at(-1)?.trim()&&n.pop(),t)if(n.length>t)n.splice(t);else for(;n.length<t;)n.push(``);for(;r<n.length;r++)n[r]=n[r].trim().replace(z.slashPipe,`|`);return n}function q(e,t,n){let r=e.length;if(r===0)return``;let i=0;for(;i<r;){let a=e.charAt(r-i-1);if(a===t&&!n)i++;else if(a!==t&&n)i++;else break}return e.slice(0,r-i)}function un(e){let t=e.split(`
`),n=t.length-1;for(;n>=0&&z.blankLine.test(t[n]);)n--;return t.length-n<=2?e:t.slice(0,n+1).join(`
`)}function dn(e,t){if(e.indexOf(t[1])===-1)return-1;let n=0;for(let r=0;r<e.length;r++)if(e[r]===`\\`)r++;else if(e[r]===t[0])n++;else if(e[r]===t[1]&&(n--,n<0))return r;return n>0?-2:-1}function fn(e,t=0){let n=t,r=``;for(let t of e)if(t===`	`){let e=4-n%4;r+=` `.repeat(e),n+=e}else r+=t,n++;return r}function pn(e,t,n,r,i){let a=t.href,o=t.title||null,s=e[1].replace(i.other.outputLinkReplace,`$1`);r.state.inLink=!0;let c={type:e[0].charAt(0)===`!`?`image`:`link`,raw:n,href:a,title:o,text:s,tokens:r.inlineTokens(s)};return r.state.inLink=!1,c}function mn(e,t,n){let r=e.match(n.other.indentCodeCompensation);if(r===null)return t;let i=r[1];return t.split(`
`).map(e=>{let t=e.match(n.other.beginningSpace);if(t===null)return e;let[r]=t;return r.length>=i.length?e.slice(i.length):e}).join(`
`)}var hn=class{options;rules;lexer;constructor(e){this.options=e||F}space(e){let t=this.rules.block.newline.exec(e);if(t&&t[0].length>0)return{type:`space`,raw:t[0]}}code(e){let t=this.rules.block.code.exec(e);if(t){let e=this.options.pedantic?t[0]:un(t[0]);return{type:`code`,raw:e,codeBlockStyle:`indented`,text:e.replace(this.rules.other.codeRemoveIndent,``)}}}fences(e){let t=this.rules.block.fences.exec(e);if(t){let e=t[0],n=mn(e,t[3]||``,this.rules);return{type:`code`,raw:e,lang:t[2]?t[2].trim().replace(this.rules.inline.anyPunctuation,`$1`):t[2],text:n}}}heading(e){let t=this.rules.block.heading.exec(e);if(t){let e=t[2].trim();if(this.rules.other.endingHash.test(e)){let t=q(e,`#`);(this.options.pedantic||!t||this.rules.other.endingSpaceChar.test(t))&&(e=t.trim())}return{type:`heading`,raw:q(t[0],`
`),depth:t[1].length,text:e,tokens:this.lexer.inline(e)}}}hr(e){let t=this.rules.block.hr.exec(e);if(t)return{type:`hr`,raw:q(t[0],`
`)}}blockquote(e){let t=this.rules.block.blockquote.exec(e);if(t){let e=q(t[0],`
`).split(`
`),n=``,r=``,i=[];for(;e.length>0;){let t=!1,a=[],o;for(o=0;o<e.length;o++)if(this.rules.other.blockquoteStart.test(e[o]))a.push(e[o]),t=!0;else if(!t)a.push(e[o]);else break;e=e.slice(o);let s=a.join(`
`),c=s.replace(this.rules.other.blockquoteSetextReplace,`
    $1`).replace(this.rules.other.blockquoteSetextReplace2,``);n=n?`${n}
${s}`:s,r=r?`${r}
${c}`:c;let l=this.lexer.state.top;if(this.lexer.state.top=!0,this.lexer.blockTokens(c,i,!0),this.lexer.state.top=l,e.length===0)break;let u=i.at(-1);if(u?.type===`code`)break;if(u?.type===`blockquote`){let t=u,a=t.raw+`
`+e.join(`
`),o=this.blockquote(a);i[i.length-1]=o,n=n.substring(0,n.length-t.raw.length)+o.raw,r=r.substring(0,r.length-t.text.length)+o.text;break}else if(u?.type===`list`){let t=u,a=t.raw+`
`+e.join(`
`),o=this.list(a);i[i.length-1]=o,n=n.substring(0,n.length-u.raw.length)+o.raw,r=r.substring(0,r.length-t.raw.length)+o.raw,e=a.substring(i.at(-1).raw.length).split(`
`);continue}}return{type:`blockquote`,raw:n,tokens:i,text:r}}}list(e){let t=this.rules.block.list.exec(e);if(t){let n=t[1].trim(),r=n.length>1,i={type:`list`,raw:``,ordered:r,start:r?+n.slice(0,-1):``,loose:!1,items:[]};n=r?`\\d{1,9}\\${n.slice(-1)}`:`\\${n}`,this.options.pedantic&&(n=r?n:`[*+-]`);let a=this.rules.other.listItemRegex(n),o=!1;for(;e;){let n=!1,r=``,s=``;if(!(t=a.exec(e))||this.rules.block.hr.test(e))break;r=t[0],e=e.substring(r.length);let c=fn(t[2].split(`
`,1)[0],t[1].length),l=e.split(`
`,1)[0],u=!c.trim(),d=0;if(this.options.pedantic?(d=2,s=c.trimStart()):u?d=t[1].length+1:(d=c.search(this.rules.other.nonSpaceChar),d=d>4?1:d,s=c.slice(d),d+=t[1].length),u&&this.rules.other.blankLine.test(l)&&(r+=l+`
`,e=e.substring(l.length+1),n=!0),!n){let t=this.rules.other.nextBulletRegex(d),n=this.rules.other.hrRegex(d),i=this.rules.other.fencesBeginRegex(d),a=this.rules.other.headingBeginRegex(d),o=this.rules.other.htmlBeginRegex(d),f=this.rules.other.blockquoteBeginRegex(d);for(;e;){let p=e.split(`
`,1)[0],m;if(l=p,this.options.pedantic?(l=l.replace(this.rules.other.listReplaceNesting,`  `),m=l):m=l.replace(this.rules.other.tabCharGlobal,`    `),i.test(l)||a.test(l)||o.test(l)||f.test(l)||t.test(l)||n.test(l))break;if(m.search(this.rules.other.nonSpaceChar)>=d||!l.trim())s+=`
`+m.slice(d);else{if(u||c.replace(this.rules.other.tabCharGlobal,`    `).search(this.rules.other.nonSpaceChar)>=4||i.test(c)||a.test(c)||n.test(c))break;s+=`
`+l}u=!l.trim(),r+=p+`
`,e=e.substring(p.length+1),c=m.slice(d)}}i.loose||(o?i.loose=!0:this.rules.other.doubleBlankLine.test(r)&&(o=!0)),i.items.push({type:`list_item`,raw:r,task:!!this.options.gfm&&this.rules.other.listIsTask.test(s),loose:!1,text:s,tokens:[]}),i.raw+=r}let s=i.items.at(-1);if(s)s.raw=s.raw.trimEnd(),s.text=s.text.trimEnd();else return;i.raw=i.raw.trimEnd();for(let e of i.items){this.lexer.state.top=!1,e.tokens=this.lexer.blockTokens(e.text,[]);let t=e.tokens[0];if(e.task&&(t?.type===`text`||t?.type===`paragraph`)){e.text=e.text.replace(this.rules.other.listReplaceTask,``),t.raw=t.raw.replace(this.rules.other.listReplaceTask,``),t.text=t.text.replace(this.rules.other.listReplaceTask,``);for(let e=this.lexer.inlineQueue.length-1;e>=0;e--)if(this.rules.other.listIsTask.test(this.lexer.inlineQueue[e].src)){this.lexer.inlineQueue[e].src=this.lexer.inlineQueue[e].src.replace(this.rules.other.listReplaceTask,``);break}let n=this.rules.other.listTaskCheckbox.exec(e.raw);if(n){let t={type:`checkbox`,raw:n[0]+` `,checked:n[0]!==`[ ]`};e.checked=t.checked,i.loose?e.tokens[0]&&[`paragraph`,`text`].includes(e.tokens[0].type)&&`tokens`in e.tokens[0]&&e.tokens[0].tokens?(e.tokens[0].raw=t.raw+e.tokens[0].raw,e.tokens[0].text=t.raw+e.tokens[0].text,e.tokens[0].tokens.unshift(t)):e.tokens.unshift({type:`paragraph`,raw:t.raw,text:t.raw,tokens:[t]}):e.tokens.unshift(t)}}else e.task&&=!1;if(!i.loose){let t=e.tokens.filter(e=>e.type===`space`);i.loose=t.length>0&&t.some(e=>this.rules.other.anyLine.test(e.raw))}}if(i.loose)for(let e of i.items){e.loose=!0;for(let t of e.tokens)t.type===`text`&&(t.type=`paragraph`)}return i}}html(e){let t=this.rules.block.html.exec(e);if(t){let e=un(t[0]);return{type:`html`,block:!0,raw:e,pre:t[1]===`pre`||t[1]===`script`||t[1]===`style`,text:e}}}def(e){let t=this.rules.block.def.exec(e);if(t){let e=t[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal,` `),n=t[2]?t[2].replace(this.rules.other.hrefBrackets,`$1`).replace(this.rules.inline.anyPunctuation,`$1`):``,r=t[3]?t[3].substring(1,t[3].length-1).replace(this.rules.inline.anyPunctuation,`$1`):t[3];return{type:`def`,tag:e,raw:q(t[0],`
`),href:n,title:r}}}table(e){let t=this.rules.block.table.exec(e);if(!t||!this.rules.other.tableDelimiter.test(t[2]))return;let n=ln(t[1]),r=t[2].replace(this.rules.other.tableAlignChars,``).split(`|`),i=t[3]?.trim()?t[3].replace(this.rules.other.tableRowBlankLine,``).split(`
`):[],a={type:`table`,raw:q(t[0],`
`),header:[],align:[],rows:[]};if(n.length===r.length){for(let e of r)this.rules.other.tableAlignRight.test(e)?a.align.push(`right`):this.rules.other.tableAlignCenter.test(e)?a.align.push(`center`):this.rules.other.tableAlignLeft.test(e)?a.align.push(`left`):a.align.push(null);for(let e=0;e<n.length;e++)a.header.push({text:n[e],tokens:this.lexer.inline(n[e]),header:!0,align:a.align[e]});for(let e of i)a.rows.push(ln(e,a.header.length).map((e,t)=>({text:e,tokens:this.lexer.inline(e),header:!1,align:a.align[t]})));return a}}lheading(e){let t=this.rules.block.lheading.exec(e);if(t){let e=t[1].trim();return{type:`heading`,raw:q(t[0],`
`),depth:t[2].charAt(0)===`=`?1:2,text:e,tokens:this.lexer.inline(e)}}}paragraph(e){let t=this.rules.block.paragraph.exec(e);if(t){let e=t[1].charAt(t[1].length-1)===`
`?t[1].slice(0,-1):t[1];return{type:`paragraph`,raw:t[0],text:e,tokens:this.lexer.inline(e)}}}text(e){let t=this.rules.block.text.exec(e);if(t)return{type:`text`,raw:t[0],text:t[0],tokens:this.lexer.inline(t[0])}}escape(e){let t=this.rules.inline.escape.exec(e);if(t)return{type:`escape`,raw:t[0],text:t[1]}}tag(e){let t=this.rules.inline.tag.exec(e);if(t)return!this.lexer.state.inLink&&this.rules.other.startATag.test(t[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&this.rules.other.endATag.test(t[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&this.rules.other.startPreScriptTag.test(t[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&this.rules.other.endPreScriptTag.test(t[0])&&(this.lexer.state.inRawBlock=!1),{type:`html`,raw:t[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:t[0]}}link(e){let t=this.rules.inline.link.exec(e);if(t){let e=t[2].trim();if(!this.options.pedantic&&this.rules.other.startAngleBracket.test(e)){if(!this.rules.other.endAngleBracket.test(e))return;let t=q(e.slice(0,-1),`\\`);if((e.length-t.length)%2==0)return}else{let e=dn(t[2],`()`);if(e===-2)return;if(e>-1){let n=(t[0].indexOf(`!`)===0?5:4)+t[1].length+e;t[2]=t[2].substring(0,e),t[0]=t[0].substring(0,n).trim(),t[3]=``}}let n=t[2],r=``;if(this.options.pedantic){let e=this.rules.other.pedanticHrefTitle.exec(n);e&&(n=e[1],r=e[3])}else r=t[3]?t[3].slice(1,-1):``;return n=n.trim(),this.rules.other.startAngleBracket.test(n)&&(n=this.options.pedantic&&!this.rules.other.endAngleBracket.test(e)?n.slice(1):n.slice(1,-1)),pn(t,{href:n&&n.replace(this.rules.inline.anyPunctuation,`$1`),title:r&&r.replace(this.rules.inline.anyPunctuation,`$1`)},t[0],this.lexer,this.rules)}}reflink(e,t){let n;if((n=this.rules.inline.reflink.exec(e))||(n=this.rules.inline.nolink.exec(e))){let e=t[(n[2]||n[1]).replace(this.rules.other.multipleSpaceGlobal,` `).toLowerCase()];if(!e){let e=n[0].charAt(0);return{type:`text`,raw:e,text:e}}return pn(n,e,n[0],this.lexer,this.rules)}}emStrong(e,t,n=``){let r=this.rules.inline.emStrongLDelim.exec(e);if(!(!r||!r[1]&&!r[2]&&!r[3]&&!r[4]||r[4]&&n.match(this.rules.other.unicodeAlphaNumeric))&&(!(r[1]||r[3])||!n||this.rules.inline.punctuation.exec(n))){let n=[...r[0]].length-1,i,a,o=n,s=0,c=r[0][0]===`*`?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd;for(c.lastIndex=0,t=t.slice(-1*e.length+n);(r=c.exec(t))!==null;){if(i=r[1]||r[2]||r[3]||r[4]||r[5]||r[6],!i)continue;if(a=[...i].length,r[3]||r[4]){o+=a;continue}else if((r[5]||r[6])&&n%3&&!((n+a)%3)){s+=a;continue}if(o-=a,o>0)continue;a=Math.min(a,a+o+s);let t=[...r[0]][0].length,c=e.slice(0,n+r.index+t+a);if(Math.min(n,a)%2){let e=c.slice(1,-1);return{type:`em`,raw:c,text:e,tokens:this.lexer.inlineTokens(e)}}let l=c.slice(2,-2);return{type:`strong`,raw:c,text:l,tokens:this.lexer.inlineTokens(l)}}}}codespan(e){let t=this.rules.inline.code.exec(e);if(t){let e=t[2].replace(this.rules.other.newLineCharGlobal,` `),n=this.rules.other.nonSpaceChar.test(e),r=this.rules.other.startingSpaceChar.test(e)&&this.rules.other.endingSpaceChar.test(e);return n&&r&&(e=e.substring(1,e.length-1)),{type:`codespan`,raw:t[0],text:e}}}br(e){let t=this.rules.inline.br.exec(e);if(t)return{type:`br`,raw:t[0]}}del(e,t,n=``){let r=this.rules.inline.delLDelim.exec(e);if(r&&(!r[1]||!n||this.rules.inline.punctuation.exec(n))){let n=[...r[0]].length-1,i,a,o=n,s=this.rules.inline.delRDelim;for(s.lastIndex=0,t=t.slice(-1*e.length+n);(r=s.exec(t))!==null;){if(i=r[1]||r[2]||r[3]||r[4]||r[5]||r[6],!i||(a=[...i].length,a!==n))continue;if(r[3]||r[4]){o+=a;continue}if(o-=a,o>0)continue;a=Math.min(a,a+o);let t=[...r[0]][0].length,s=e.slice(0,n+r.index+t+a),c=s.slice(n,-n);return{type:`del`,raw:s,text:c,tokens:this.lexer.inlineTokens(c)}}}}autolink(e){let t=this.rules.inline.autolink.exec(e);if(t){let e,n;return t[2]===`@`?(e=t[1],n=`mailto:`+e):(e=t[1],n=e),{type:`link`,raw:t[0],text:e,href:n,tokens:[{type:`text`,raw:e,text:e}]}}}url(e){let t;if(t=this.rules.inline.url.exec(e)){let e,n;if(t[2]===`@`)e=t[0],n=`mailto:`+e;else{let r;do r=t[0],t[0]=this.rules.inline._backpedal.exec(t[0])?.[0]??``;while(r!==t[0]);e=t[0],n=t[1]===`www.`?`http://`+t[0]:t[0]}return{type:`link`,raw:t[0],text:e,href:n,tokens:[{type:`text`,raw:e,text:e}]}}}inlineText(e){let t=this.rules.inline.text.exec(e);if(t){let e=this.lexer.state.inRawBlock;return{type:`text`,raw:t[0],text:t[0],escaped:e}}}},J=class e{tokens;options;state;inlineQueue;tokenizer;constructor(e){this.tokens=[],this.tokens.links=Object.create(null),this.options=e||F,this.options.tokenizer=this.options.tokenizer||new hn,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,top:!0};let t={other:z,block:an.normal,inline:G.normal};this.options.pedantic?(t.block=an.pedantic,t.inline=G.pedantic):this.options.gfm&&(t.block=an.gfm,this.options.breaks?t.inline=G.breaks:t.inline=G.gfm),this.tokenizer.rules=t}static get rules(){return{block:an,inline:G}}static lex(t,n){return new e(n).lex(t)}static lexInline(t,n){return new e(n).inlineTokens(t)}lex(e){e=e.replace(z.carriageReturn,`
`),this.blockTokens(e,this.tokens);for(let e=0;e<this.inlineQueue.length;e++){let t=this.inlineQueue[e];this.inlineTokens(t.src,t.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(e,t=[],n=!1){this.tokenizer.lexer=this,this.options.pedantic&&(e=e.replace(z.tabCharGlobal,`    `).replace(z.spaceLine,``));let r=1/0;for(;e;){if(e.length<r)r=e.length;else{this.infiniteLoopError(e.charCodeAt(0));break}let i;if(this.options.extensions?.block?.some(n=>(i=n.call({lexer:this},e,t))?(e=e.substring(i.raw.length),t.push(i),!0):!1))continue;if(i=this.tokenizer.space(e)){e=e.substring(i.raw.length);let n=t.at(-1);i.raw.length===1&&n!==void 0?n.raw+=`
`:t.push(i);continue}if(i=this.tokenizer.code(e)){e=e.substring(i.raw.length);let n=t.at(-1);n?.type===`paragraph`||n?.type===`text`?(n.raw+=(n.raw.endsWith(`
`)?``:`
`)+i.raw,n.text+=`
`+i.text,this.inlineQueue.at(-1).src=n.text):t.push(i);continue}if(i=this.tokenizer.fences(e)){e=e.substring(i.raw.length),t.push(i);continue}if(i=this.tokenizer.heading(e)){e=e.substring(i.raw.length),t.push(i);continue}if(i=this.tokenizer.hr(e)){e=e.substring(i.raw.length),t.push(i);continue}if(i=this.tokenizer.blockquote(e)){e=e.substring(i.raw.length),t.push(i);continue}if(i=this.tokenizer.list(e)){e=e.substring(i.raw.length),t.push(i);continue}if(i=this.tokenizer.html(e)){e=e.substring(i.raw.length),t.push(i);continue}if(i=this.tokenizer.def(e)){e=e.substring(i.raw.length);let n=t.at(-1);n?.type===`paragraph`||n?.type===`text`?(n.raw+=(n.raw.endsWith(`
`)?``:`
`)+i.raw,n.text+=`
`+i.raw,this.inlineQueue.at(-1).src=n.text):this.tokens.links[i.tag]||(this.tokens.links[i.tag]={href:i.href,title:i.title},t.push(i));continue}if(i=this.tokenizer.table(e)){e=e.substring(i.raw.length),t.push(i);continue}if(i=this.tokenizer.lheading(e)){e=e.substring(i.raw.length),t.push(i);continue}let a=e;if(this.options.extensions?.startBlock){let t=1/0,n=e.slice(1),r;this.options.extensions.startBlock.forEach(e=>{r=e.call({lexer:this},n),typeof r==`number`&&r>=0&&(t=Math.min(t,r))}),t<1/0&&t>=0&&(a=e.substring(0,t+1))}if(this.state.top&&(i=this.tokenizer.paragraph(a))){let r=t.at(-1);n&&r?.type===`paragraph`?(r.raw+=(r.raw.endsWith(`
`)?``:`
`)+i.raw,r.text+=`
`+i.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=r.text):t.push(i),n=a.length!==e.length,e=e.substring(i.raw.length);continue}if(i=this.tokenizer.text(e)){e=e.substring(i.raw.length);let n=t.at(-1);n?.type===`text`?(n.raw+=(n.raw.endsWith(`
`)?``:`
`)+i.raw,n.text+=`
`+i.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=n.text):t.push(i);continue}if(e){this.infiniteLoopError(e.charCodeAt(0));break}}return this.state.top=!0,t}inline(e,t=[]){return this.inlineQueue.push({src:e,tokens:t}),t}inlineTokens(e,t=[]){this.tokenizer.lexer=this;let n=e,r=null;if(this.tokens.links){let e=Object.keys(this.tokens.links);if(e.length>0)for(;(r=this.tokenizer.rules.inline.reflinkSearch.exec(n))!==null;)e.includes(r[0].slice(r[0].lastIndexOf(`[`)+1,-1))&&(n=n.slice(0,r.index)+`[`+`a`.repeat(r[0].length-2)+`]`+n.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex))}for(;(r=this.tokenizer.rules.inline.anyPunctuation.exec(n))!==null;)n=n.slice(0,r.index)+`++`+n.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);let i;for(;(r=this.tokenizer.rules.inline.blockSkip.exec(n))!==null;)i=r[2]?r[2].length:0,n=n.slice(0,r.index+i)+`[`+`a`.repeat(r[0].length-i-2)+`]`+n.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);n=this.options.hooks?.emStrongMask?.call({lexer:this},n)??n;let a=!1,o=``,s=1/0;for(;e;){if(e.length<s)s=e.length;else{this.infiniteLoopError(e.charCodeAt(0));break}a||(o=``),a=!1;let r;if(this.options.extensions?.inline?.some(n=>(r=n.call({lexer:this},e,t))?(e=e.substring(r.raw.length),t.push(r),!0):!1))continue;if(r=this.tokenizer.escape(e)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.tag(e)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.link(e)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.reflink(e,this.tokens.links)){e=e.substring(r.raw.length);let n=t.at(-1);r.type===`text`&&n?.type===`text`?(n.raw+=r.raw,n.text+=r.text):t.push(r);continue}if(r=this.tokenizer.emStrong(e,n,o)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.codespan(e)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.br(e)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.del(e,n,o)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.autolink(e)){e=e.substring(r.raw.length),t.push(r);continue}if(!this.state.inLink&&(r=this.tokenizer.url(e))){e=e.substring(r.raw.length),t.push(r);continue}let i=e;if(this.options.extensions?.startInline){let t=1/0,n=e.slice(1),r;this.options.extensions.startInline.forEach(e=>{r=e.call({lexer:this},n),typeof r==`number`&&r>=0&&(t=Math.min(t,r))}),t<1/0&&t>=0&&(i=e.substring(0,t+1))}if(r=this.tokenizer.inlineText(i)){e=e.substring(r.raw.length),r.raw.slice(-1)!==`_`&&(o=r.raw.slice(-1)),a=!0;let n=t.at(-1);n?.type===`text`?(n.raw+=r.raw,n.text+=r.text):t.push(r);continue}if(e){this.infiniteLoopError(e.charCodeAt(0));break}}return t}infiniteLoopError(e){let t=`Infinite loop on byte: `+e;if(this.options.silent)console.error(t);else throw Error(t)}},gn=class{options;parser;constructor(e){this.options=e||F}space(e){return``}code({text:e,lang:t,escaped:n}){let r=(t||``).match(z.notSpaceStart)?.[0],i=e.replace(z.endingNewline,``)+`
`;return r?`<pre><code class="language-`+K(r)+`">`+(n?i:K(i,!0))+`</code></pre>
`:`<pre><code>`+(n?i:K(i,!0))+`</code></pre>
`}blockquote({tokens:e}){return`<blockquote>
${this.parser.parse(e)}</blockquote>
`}html({text:e}){return e}def(e){return``}heading({tokens:e,depth:t}){return`<h${t}>${this.parser.parseInline(e)}</h${t}>
`}hr(e){return`<hr>
`}list(e){let t=e.ordered,n=e.start,r=``;for(let t=0;t<e.items.length;t++){let n=e.items[t];r+=this.listitem(n)}let i=t?`ol`:`ul`,a=t&&n!==1?` start="`+n+`"`:``;return`<`+i+a+`>
`+r+`</`+i+`>
`}listitem(e){return`<li>${this.parser.parse(e.tokens)}</li>
`}checkbox({checked:e}){return`<input `+(e?`checked="" `:``)+`disabled="" type="checkbox"> `}paragraph({tokens:e}){return`<p>${this.parser.parseInline(e)}</p>
`}table(e){let t=``,n=``;for(let t=0;t<e.header.length;t++)n+=this.tablecell(e.header[t]);t+=this.tablerow({text:n});let r=``;for(let t=0;t<e.rows.length;t++){let i=e.rows[t];n=``;for(let e=0;e<i.length;e++)n+=this.tablecell(i[e]);r+=this.tablerow({text:n})}return r&&=`<tbody>${r}</tbody>`,`<table>
<thead>
`+t+`</thead>
`+r+`</table>
`}tablerow({text:e}){return`<tr>
${e}</tr>
`}tablecell(e){let t=this.parser.parseInline(e.tokens),n=e.header?`th`:`td`;return(e.align?`<${n} align="${e.align}">`:`<${n}>`)+t+`</${n}>
`}strong({tokens:e}){return`<strong>${this.parser.parseInline(e)}</strong>`}em({tokens:e}){return`<em>${this.parser.parseInline(e)}</em>`}codespan({text:e}){return`<code>${K(e,!0)}</code>`}br(e){return`<br>`}del({tokens:e}){return`<del>${this.parser.parseInline(e)}</del>`}link({href:e,title:t,tokens:n}){let r=this.parser.parseInline(n),i=cn(e);if(i===null)return r;e=i;let a=`<a href="`+e+`"`;return t&&(a+=` title="`+K(t)+`"`),a+=`>`+r+`</a>`,a}image({href:e,title:t,text:n,tokens:r}){r&&(n=this.parser.parseInline(r,this.parser.textRenderer));let i=cn(e);if(i===null)return K(n);e=i;let a=`<img src="${e}" alt="${K(n)}"`;return t&&(a+=` title="${K(t)}"`),a+=`>`,a}text(e){return`tokens`in e&&e.tokens?this.parser.parseInline(e.tokens):`escaped`in e&&e.escaped?e.text:K(e.text)}},_n=class{strong({text:e}){return e}em({text:e}){return e}codespan({text:e}){return e}del({text:e}){return e}html({text:e}){return e}text({text:e}){return e}link({text:e}){return``+e}image({text:e}){return``+e}br(){return``}checkbox({raw:e}){return e}},Y=class e{options;renderer;textRenderer;constructor(e){this.options=e||F,this.options.renderer=this.options.renderer||new gn,this.renderer=this.options.renderer,this.renderer.options=this.options,this.renderer.parser=this,this.textRenderer=new _n}static parse(t,n){return new e(n).parse(t)}static parseInline(t,n){return new e(n).parseInline(t)}parse(e){this.renderer.parser=this;let t=``;for(let n=0;n<e.length;n++){let r=e[n];if(this.options.extensions?.renderers?.[r.type]){let e=r,n=this.options.extensions.renderers[e.type].call({parser:this},e);if(n!==!1||![`space`,`hr`,`heading`,`code`,`table`,`blockquote`,`list`,`html`,`def`,`paragraph`,`text`].includes(e.type)){t+=n||``;continue}}let i=r;switch(i.type){case`space`:t+=this.renderer.space(i);break;case`hr`:t+=this.renderer.hr(i);break;case`heading`:t+=this.renderer.heading(i);break;case`code`:t+=this.renderer.code(i);break;case`table`:t+=this.renderer.table(i);break;case`blockquote`:t+=this.renderer.blockquote(i);break;case`list`:t+=this.renderer.list(i);break;case`checkbox`:t+=this.renderer.checkbox(i);break;case`html`:t+=this.renderer.html(i);break;case`def`:t+=this.renderer.def(i);break;case`paragraph`:t+=this.renderer.paragraph(i);break;case`text`:t+=this.renderer.text(i);break;default:{let e=`Token with "`+i.type+`" type was not found.`;if(this.options.silent)return console.error(e),``;throw Error(e)}}}return t}parseInline(e,t=this.renderer){this.renderer.parser=this;let n=``;for(let r=0;r<e.length;r++){let i=e[r];if(this.options.extensions?.renderers?.[i.type]){let e=this.options.extensions.renderers[i.type].call({parser:this},i);if(e!==!1||![`escape`,`html`,`link`,`image`,`strong`,`em`,`codespan`,`br`,`del`,`text`].includes(i.type)){n+=e||``;continue}}let a=i;switch(a.type){case`escape`:n+=t.text(a);break;case`html`:n+=t.html(a);break;case`link`:n+=t.link(a);break;case`image`:n+=t.image(a);break;case`checkbox`:n+=t.checkbox(a);break;case`strong`:n+=t.strong(a);break;case`em`:n+=t.em(a);break;case`codespan`:n+=t.codespan(a);break;case`br`:n+=t.br(a);break;case`del`:n+=t.del(a);break;case`text`:n+=t.text(a);break;default:{let e=`Token with "`+a.type+`" type was not found.`;if(this.options.silent)return console.error(e),``;throw Error(e)}}}return n}},X=class{options;block;constructor(e){this.options=e||F}static passThroughHooks=new Set([`preprocess`,`postprocess`,`processAllTokens`,`emStrongMask`]);static passThroughHooksRespectAsync=new Set([`preprocess`,`postprocess`,`processAllTokens`]);preprocess(e){return e}postprocess(e){return e}processAllTokens(e){return e}emStrongMask(e){return e}provideLexer(e=this.block){return e?J.lex:J.lexInline}provideParser(e=this.block){return e?Y.parse:Y.parseInline}},Z=new class{defaults=rt();options=this.setOptions;parse=this.parseMarkdown(!0);parseInline=this.parseMarkdown(!1);Parser=Y;Renderer=gn;TextRenderer=_n;Lexer=J;Tokenizer=hn;Hooks=X;constructor(...e){this.use(...e)}walkTokens(e,t){let n=[];for(let r of e)switch(n=n.concat(t.call(this,r)),r.type){case`table`:{let e=r;for(let r of e.header)n=n.concat(this.walkTokens(r.tokens,t));for(let r of e.rows)for(let e of r)n=n.concat(this.walkTokens(e.tokens,t));break}case`list`:{let e=r;n=n.concat(this.walkTokens(e.items,t));break}default:{let e=r;this.defaults.extensions?.childTokens?.[e.type]?this.defaults.extensions.childTokens[e.type].forEach(r=>{let i=e[r].flat(1/0);n=n.concat(this.walkTokens(i,t))}):e.tokens&&(n=n.concat(this.walkTokens(e.tokens,t)))}}return n}use(...e){let t=this.defaults.extensions||{renderers:{},childTokens:{}};return e.forEach(e=>{let n={...e};if(n.async=this.defaults.async||n.async||!1,e.extensions&&(e.extensions.forEach(e=>{if(!e.name)throw Error(`extension name required`);if(`renderer`in e){let n=t.renderers[e.name];n?t.renderers[e.name]=function(...t){let r=e.renderer.apply(this,t);return r===!1&&(r=n.apply(this,t)),r}:t.renderers[e.name]=e.renderer}if(`tokenizer`in e){if(!e.level||e.level!==`block`&&e.level!==`inline`)throw Error(`extension level must be 'block' or 'inline'`);let n=t[e.level];n?n.unshift(e.tokenizer):t[e.level]=[e.tokenizer],e.start&&(e.level===`block`?t.startBlock?t.startBlock.push(e.start):t.startBlock=[e.start]:e.level===`inline`&&(t.startInline?t.startInline.push(e.start):t.startInline=[e.start]))}`childTokens`in e&&e.childTokens&&(t.childTokens[e.name]=e.childTokens)}),n.extensions=t),e.renderer){let t=this.defaults.renderer||new gn(this.defaults);for(let n in e.renderer){if(!(n in t))throw Error(`renderer '${n}' does not exist`);if([`options`,`parser`].includes(n))continue;let r=n,i=e.renderer[r],a=t[r];t[r]=(...e)=>{let n=i.apply(t,e);return n===!1&&(n=a.apply(t,e)),n||``}}n.renderer=t}if(e.tokenizer){let t=this.defaults.tokenizer||new hn(this.defaults);for(let n in e.tokenizer){if(!(n in t))throw Error(`tokenizer '${n}' does not exist`);if([`options`,`rules`,`lexer`].includes(n))continue;let r=n,i=e.tokenizer[r],a=t[r];t[r]=(...e)=>{let n=i.apply(t,e);return n===!1&&(n=a.apply(t,e)),n}}n.tokenizer=t}if(e.hooks){let t=this.defaults.hooks||new X;for(let n in e.hooks){if(!(n in t))throw Error(`hook '${n}' does not exist`);if([`options`,`block`].includes(n))continue;let r=n,i=e.hooks[r],a=t[r];X.passThroughHooks.has(n)?t[r]=e=>{if(this.defaults.async&&X.passThroughHooksRespectAsync.has(n))return(async()=>{let n=await i.call(t,e);return a.call(t,n)})();let r=i.call(t,e);return a.call(t,r)}:t[r]=(...e)=>{if(this.defaults.async)return(async()=>{let n=await i.apply(t,e);return n===!1&&(n=await a.apply(t,e)),n})();let n=i.apply(t,e);return n===!1&&(n=a.apply(t,e)),n}}n.hooks=t}if(e.walkTokens){let t=this.defaults.walkTokens,r=e.walkTokens;n.walkTokens=function(e){let n=[];return n.push(r.call(this,e)),t&&(n=n.concat(t.call(this,e))),n}}this.defaults={...this.defaults,...n}}),this}setOptions(e){return this.defaults={...this.defaults,...e},this}lexer(e,t){return J.lex(e,t??this.defaults)}parser(e,t){return Y.parse(e,t??this.defaults)}parseMarkdown(e){return(t,n)=>{let r={...n},i={...this.defaults,...r},a=this.onError(!!i.silent,!!i.async);if(this.defaults.async===!0&&r.async===!1)return a(Error(`marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise.`));if(typeof t>`u`||t===null)return a(Error(`marked(): input parameter is undefined or null`));if(typeof t!=`string`)return a(Error(`marked(): input parameter is of type `+Object.prototype.toString.call(t)+`, string expected`));if(i.hooks&&(i.hooks.options=i,i.hooks.block=e),i.async)return(async()=>{let n=i.hooks?await i.hooks.preprocess(t):t,r=await(i.hooks?await i.hooks.provideLexer(e):e?J.lex:J.lexInline)(n,i),a=i.hooks?await i.hooks.processAllTokens(r):r;i.walkTokens&&await Promise.all(this.walkTokens(a,i.walkTokens));let o=await(i.hooks?await i.hooks.provideParser(e):e?Y.parse:Y.parseInline)(a,i);return i.hooks?await i.hooks.postprocess(o):o})().catch(a);try{i.hooks&&(t=i.hooks.preprocess(t));let n=(i.hooks?i.hooks.provideLexer(e):e?J.lex:J.lexInline)(t,i);i.hooks&&(n=i.hooks.processAllTokens(n)),i.walkTokens&&this.walkTokens(n,i.walkTokens);let r=(i.hooks?i.hooks.provideParser(e):e?Y.parse:Y.parseInline)(n,i);return i.hooks&&(r=i.hooks.postprocess(r)),r}catch(e){return a(e)}}}onError(e,t){return n=>{if(n.message+=`
Please report this to https://github.com/markedjs/marked.`,e){let e=`<p>An error occurred:</p><pre>`+K(n.message+``,!0)+`</pre>`;return t?Promise.resolve(e):e}if(t)return Promise.reject(n);throw n}}};function Q(e,t){return Z.parse(e,t)}Q.options=Q.setOptions=function(e){return Z.setOptions(e),Q.defaults=Z.defaults,it(Q.defaults),Q},Q.getDefaults=rt,Q.defaults=F,Q.use=function(...e){return Z.use(...e),Q.defaults=Z.defaults,it(Q.defaults),Q},Q.walkTokens=function(e,t){return Z.walkTokens(e,t)},Q.parseInline=Z.parseInline,Q.Parser=Y,Q.parser=Y.parse,Q.Renderer=gn,Q.TextRenderer=_n,Q.Lexer=J,Q.lexer=J.lex,Q.Tokenizer=hn,Q.Hooks=X,Q.parse=Q,Q.options,Q.setOptions,Q.use,Q.walkTokens,Q.parseInline,Y.parse,J.lex;function vn(e){let t=e.trim();return t?t.split(/\s+/).length:0}function yn(e){return e.length===0?0:e.split(/\r?\n/).length}function bn(e){return e<=0?f(`agents.files.emptyDraft`):f(`agents.files.minRead`,{count:String(Math.max(1,Math.round(e/220)))})}function xn(e){let t=e.split(`.`).pop()?.trim().toLowerCase();return t===`md`||t===`markdown`?f(`agents.files.markdownPreview`):t?f(`agents.files.extensionPreview`,{ext:t.toUpperCase()}):f(`agents.files.preview`)}function Sn(e,t){let n=e.trim(),r=t?.trim();if(!n)return``;if(r&&n===r)return`.`;if(r&&n.startsWith(`${r}/`))return n.slice(r.length+1)||`.`;let i=n.split(/[\\/]+/);for(let e=i.length-1;e>=0;--e){let t=i[e];if(t)return t}return n}function Cn(e){return e.toLowerCase().replace(/[^a-z0-9]+/g,`-`).replace(/^-+|-+$/g,``)||`preview`}function wn(e,t){if(!(e instanceof HTMLElement))return;let n=f(t?`agents.files.collapsePreview`:`agents.files.expandPreview`);e.classList.toggle(`is-fullscreen`,t),e.setAttribute(`aria-pressed`,String(t)),e.setAttribute(`aria-label`,n),e.setAttribute(`title`,n)}function Tn(e,t,n){return a`
    <section class="card">
      <div class="card-title">${f(`agents.context.title`)}</div>
      <div class="card-sub">${t}</div>
      <div class="agents-overview-grid" style="margin-top: 16px;">
        <div class="agent-kv">
          <div class="label">${f(`agents.context.workspace`)}</div>
          <div>
            <button
              type="button"
              class="workspace-link mono"
              @click=${()=>n(`files`)}
            >
              ${e.workspace}
            </button>
          </div>
        </div>
        <div class="agent-kv">
          <div class="label">${f(`agents.context.primaryModel`)}</div>
          <div class="mono">${e.model}</div>
        </div>
        <div class="agent-kv">
          <div class="label">${f(`agents.context.runtime`)}</div>
          <div class="mono">${e.runtime}</div>
        </div>
        <div class="agent-kv">
          <div class="label">${f(`agents.context.identityName`)}</div>
          <div>${e.identityName}</div>
        </div>
        <div class="agent-kv">
          <div class="label">${f(`agents.context.identityAvatar`)}</div>
          <div>${e.identityAvatar}</div>
        </div>
        <div class="agent-kv">
          <div class="label">${f(`agents.context.skillsFilter`)}</div>
          <div>${e.skillsLabel}</div>
        </div>
        <div class="agent-kv">
          <div class="label">${f(`agents.context.default`)}</div>
          <div>${e.isDefault?f(`common.yes`):f(`common.no`)}</div>
        </div>
      </div>
    </section>
  `}function En(e,t){let n=e.channelMeta?.find(e=>e.id===t);return n?.label?n.label:e.channelLabels?.[t]??t}function Dn(e){if(!e)return[];let t=new Set;for(let n of e.channelOrder??[])t.add(n);for(let n of e.channelMeta??[])t.add(n.id);for(let n of Object.keys(e.channelAccounts??{}))t.add(n);let n=[],r=e.channelOrder?.length?e.channelOrder:Array.from(t);for(let e of r)t.has(e)&&(n.push(e),t.delete(e));for(let e of t)n.push(e);return n.map(t=>({id:t,label:En(e,t),accounts:e.channelAccounts?.[t]??[]}))}var On=[`groupPolicy`,`streamMode`,`dmPolicy`];function kn(e){let t=0,n=0,r=0;for(let i of e){let e=i.probe&&typeof i.probe==`object`&&`ok`in i.probe?!!i.probe.ok:!1;(i.connected===!0||i.running===!0||e)&&(t+=1),i.configured&&(n+=1),i.enabled&&(r+=1)}return{total:e.length,connected:t,configured:n,enabled:r}}function An(e){let t=Dn(e.snapshot),n=e.lastSuccess?w(e.lastSuccess):f(`common.never`);return a`
    <section class="grid grid-cols-2">
      ${Tn(e.context,f(`agents.context.configurationSubtitle`),e.onSelectPanel)}
      <section class="card">
        <div class="row" style="justify-content: space-between;">
          <div>
            <div class="card-title">${f(`agents.channels.title`)}</div>
            <div class="card-sub">${f(`agents.channels.subtitle`)}</div>
          </div>
          <button class="btn btn--sm" ?disabled=${e.loading} @click=${e.onRefresh}>
            ${e.loading?f(`common.refreshing`):f(`common.refresh`)}
          </button>
        </div>
        <div class="muted" style="margin-top: 8px;">
          ${f(`agents.channels.lastRefresh`,{time:n})}
        </div>
        ${e.error?a`<div class="callout danger" style="margin-top: 12px;">${e.error}</div>`:o}
        ${e.snapshot?o:a`
              <div class="callout info" style="margin-top: 12px">
                ${f(`agents.channels.loadHint`)}
              </div>
            `}
        ${t.length===0?a` <div class="muted" style="margin-top: 16px">${f(`agents.channels.empty`)}</div>`:a`
              <div class="list" style="margin-top: 16px;">
                ${t.map(t=>{let n=kn(t.accounts),r=n.total?f(`agents.channels.connectedCount`,{connected:String(n.connected),total:String(n.total)}):f(`agents.channels.noAccounts`),i=n.configured?f(`agents.channels.configuredCount`,{count:String(n.configured)}):f(`agents.channels.notConfigured`),s=n.total?f(`agents.channels.enabledCount`,{count:String(n.enabled)}):f(`common.disabled`),c=S({configForm:e.configForm,channelId:t.id,fields:On});return a`
                    <div class="list-item">
                      <div class="list-main">
                        <div class="list-title">${t.label}</div>
                        <div class="list-sub mono">${t.id}</div>
                      </div>
                      <div class="list-meta">
                        <div>${r}</div>
                        <div>${i}</div>
                        <div>${s}</div>
                        ${n.configured===0?a`
                              <div>
                                <a
                                  href="https://docs.openclaw.ai/channels"
                                  target="_blank"
                                  rel="noopener"
                                  style="color: var(--accent); font-size: 12px"
                                  >${f(`agents.channels.setupGuide`)}</a
                                >
                              </div>
                            `:o}
                        ${c.length>0?c.map(e=>a`<div>${e.label}: ${e.value}</div>`):o}
                      </div>
                    </div>
                  `})}
              </div>
            `}
      </section>
    </section>
  `}function jn(e){let t=e.jobs.filter(t=>t.agentId===e.agentId);return a`
    <section class="grid grid-cols-2">
      ${Tn(e.context,f(`agents.context.schedulingSubtitle`),e.onSelectPanel)}
      <section class="card">
        <div class="row" style="justify-content: space-between;">
          <div>
            <div class="card-title">${f(`agents.cronPanel.schedulerTitle`)}</div>
            <div class="card-sub">${f(`agents.cronPanel.schedulerSubtitle`)}</div>
          </div>
          <button class="btn btn--sm" ?disabled=${e.loading} @click=${e.onRefresh}>
            ${e.loading?f(`common.refreshing`):f(`common.refresh`)}
          </button>
        </div>
        <div class="stat-grid" style="margin-top: 16px;">
          <div class="stat">
            <div class="stat-label">${f(`common.enabled`)}</div>
            <div class="stat-value">
              ${e.status?e.status.enabled?f(`common.yes`):f(`common.no`):f(`common.na`)}
            </div>
          </div>
          <div class="stat">
            <div class="stat-label">${f(`agents.cronPanel.jobs`)}</div>
            <div class="stat-value">${e.status?.jobs??f(`common.na`)}</div>
          </div>
          <div class="stat">
            <div class="stat-label">${f(`agents.cronPanel.nextWake`)}</div>
            <div class="stat-value">${_e(e.status?.nextWakeAtMs??null)}</div>
          </div>
        </div>
        ${e.error?a`<div class="callout danger" style="margin-top: 12px;">${e.error}</div>`:o}
      </section>
    </section>
    <section class="card">
      <div class="card-title">${f(`agents.cronPanel.agentJobsTitle`)}</div>
      <div class="card-sub">${f(`agents.cronPanel.agentJobsSubtitle`)}</div>
      ${t.length===0?a` <div class="muted" style="margin-top: 16px">${f(`agents.cronPanel.noJobs`)}</div>`:a`
            <div class="list" style="margin-top: 16px;">
              ${t.map(t=>a`
                  <div class="list-item">
                    <div class="list-main">
                      <div class="list-title">${t.name}</div>
                      ${t.description?a`<div class="list-sub">${t.description}</div>`:o}
                      <div class="chip-row" style="margin-top: 6px;">
                        <span class="chip">${ve(t)}</span>
                        <span class="chip ${t.enabled?`chip-ok`:`chip-warn`}">
                          ${t.enabled?f(`common.enabled`):f(`common.disabled`)}
                        </span>
                        <span class="chip">${t.sessionTarget}</span>
                      </div>
                    </div>
                    <div class="list-meta">
                      <div class="mono">${ye(t)}</div>
                      <div class="muted">${be(t)}</div>
                      <button
                        class="btn btn--sm"
                        style="margin-top: 6px;"
                        ?disabled=${!t.enabled}
                        @click=${()=>e.onRunNow(t.id)}
                      >
                        ${f(`agents.cronPanel.runNow`)}
                      </button>
                    </div>
                  </div>
                `)}
            </div>
          `}
    </section>
  `}function Mn(e){let t=e.agentFilesList?.agentId===e.agentId?e.agentFilesList:null,n=t?.files??[],i=e.agentFileActive??null,s=i?n.find(e=>e.name===i)??null:null,c=i?e.agentFileContents[i]??``:``,l=i?e.agentFileDrafts[i]??c:``,u=i?l!==c:!1,d=s?tt(Q.parse(l,{gfm:!0,breaks:!0}),{sanitize:e=>Te.sanitize(e)}):``,p=ne(new TextEncoder().encode(l).length),m=vn(l),h=yn(l),g=s?Sn(s.path,t?.workspace):``,v=s?`agent-file-preview-title-${Cn(s.name)}`:``,y=s?.missing?f(`agents.files.willCreateOnSave`):f(u?`agents.files.liveDraftPreview`:`agents.files.savedPreview`),b=s?.missing?`is-missing`:u?`is-dirty`:`is-synced`,x=s?.updatedAtMs?f(`agents.files.updated`,{time:w(s.updatedAtMs)}):s?.missing?f(`agents.files.notCreatedYet`):f(`agents.files.updatedUnknown`);return a`
    <section class="card">
      <div class="row" style="justify-content: space-between;">
        <div>
          <div class="card-title">${f(`agents.files.coreFilesTitle`)}</div>
          <div class="card-sub">${f(`agents.files.coreFilesSubtitle`)}</div>
        </div>
        <button
          class="btn btn--sm"
          ?disabled=${e.agentFilesLoading}
          @click=${()=>e.onLoadFiles(e.agentId)}
        >
          ${e.agentFilesLoading?f(`common.loading`):f(`common.refresh`)}
        </button>
      </div>
      ${t?a`<div class="muted mono" style="margin-top: 8px;">
            ${f(`agents.files.workspace`)}: <span>${t.workspace}</span>
          </div>`:o}
      ${e.agentFilesError?a`<div class="callout danger" style="margin-top: 12px;">
            ${e.agentFilesError}
          </div>`:o}
      ${t?n.length===0?a` <div class="muted" style="margin-top: 16px">${f(`agents.files.empty`)}</div> `:a`
              <div class="agent-tabs" style="margin-top: 14px;">
                ${n.map(t=>{let n=i===t.name,r=t.name.replace(/\.md$/i,``);return a`
                    <button
                      class="agent-tab ${n?`active`:``} ${t.missing?`agent-tab--missing`:``}"
                      @click=${()=>e.onSelectFile(t.name)}
                    >
                      ${r}${t.missing?a` <span class="agent-tab-badge">${f(`agents.files.missing`)}</span> `:o}
                    </button>
                  `})}
              </div>
              ${s?a`
                    <div class="agent-file-header" style="margin-top: 14px;">
                      <div>
                        <div class="agent-file-sub mono">${s.path}</div>
                      </div>
                      <div class="agent-file-actions">
                        <button
                          class="btn btn--sm"
                          @click=${e=>{let t=e.currentTarget.closest(`.card`)?.querySelector(`dialog`);t&&t.showModal()}}
                        >
                          ${_.eye} ${f(`agents.files.preview`)}
                        </button>
                        <button
                          class="btn btn--sm"
                          ?disabled=${!u}
                          @click=${()=>e.onFileReset(s.name)}
                        >
                          ${f(`common.reset`)}
                        </button>
                        <button
                          class="btn btn--sm primary"
                          ?disabled=${e.agentFileSaving||!u}
                          @click=${()=>e.onFileSave(s.name)}
                        >
                          ${e.agentFileSaving?f(`common.saving`):f(`common.save`)}
                        </button>
                      </div>
                    </div>
                    ${s.missing?a`
                          <div class="callout info" style="margin-top: 10px">
                            ${f(`agents.files.missingHint`)}
                          </div>
                        `:o}
                    <label class="field agent-file-field" style="margin-top: 12px;">
                      <span>${f(`agents.files.content`)}</span>
                      <textarea
                        class="agent-file-textarea"
                        .value=${l}
                        @input=${t=>e.onFileDraftChange(s.name,t.target.value)}
                      ></textarea>
                    </label>
                    <dialog
                      class="md-preview-dialog"
                      aria-labelledby=${v}
                      @click=${e=>{let t=e.currentTarget;e.target===t&&t.close()}}
                      @close=${e=>{let t=e.currentTarget;t.querySelector(`.md-preview-dialog__panel`)?.classList.remove(`fullscreen`),wn(t.querySelector(`.md-preview-expand-btn`),!1)}}
                    >
                      <div class="md-preview-dialog__panel">
                        <div class="md-preview-dialog__header">
                          <div class="md-preview-dialog__header-main">
                            <div class="md-preview-dialog__eyebrow">
                              ${_.scrollText}
                              <span>${xn(s.name)}</span>
                            </div>
                            <div class="md-preview-dialog__title-wrap">
                              <div
                                id=${v}
                                class="md-preview-dialog__title"
                                translate="no"
                              >
                                ${s.name}
                              </div>
                              <div class="md-preview-dialog__path mono" translate="no">
                                ${g}
                              </div>
                            </div>
                          </div>
                          <div class="md-preview-dialog__actions">
                            <openclaw-tooltip .content=${f(`agents.files.expandPreview`)}>
                              <button
                                type="button"
                                class="btn btn--sm md-preview-icon-btn md-preview-expand-btn"
                                aria-label=${f(`agents.files.expandPreview`)}
                                aria-pressed="false"
                                @click=${e=>{let t=e.currentTarget,n=t.closest(`.md-preview-dialog__panel`);n&&wn(t,n.classList.toggle(`fullscreen`))}}
                              >
                                <span class="when-normal" aria-hidden="true">${_.maximize}</span
                                ><span class="when-fullscreen" aria-hidden="true"
                                  >${_.minimize}</span
                                >
                              </button>
                            </openclaw-tooltip>
                            <openclaw-tooltip .content=${f(`agents.files.editFile`)}>
                              <button
                                type="button"
                                class="btn btn--sm md-preview-icon-btn"
                                aria-label=${f(`agents.files.editFile`)}
                                @click=${e=>{e.currentTarget.closest(`dialog`)?.close(),document.querySelector(`.agent-file-textarea`)?.focus()}}
                              >
                                <span aria-hidden="true">${_.edit}</span>
                              </button>
                            </openclaw-tooltip>
                            <openclaw-tooltip .content=${f(`agents.files.closePreview`)}>
                              <button
                                type="button"
                                class="btn btn--sm md-preview-icon-btn"
                                aria-label=${f(`agents.files.closePreview`)}
                                @click=${e=>{e.currentTarget.closest(`dialog`)?.close()}}
                              >
                                <span aria-hidden="true">${_.x}</span>
                              </button>
                            </openclaw-tooltip>
                          </div>
                        </div>
                        <div class="md-preview-dialog__meta">
                          <div class="md-preview-dialog__chip ${b}">
                            <strong>${y}</strong>
                          </div>
                          <div class="md-preview-dialog__chip">
                            <strong>${bn(m)}</strong>
                            <span
                              >${f(`agents.files.words`,{count:String(m)})}</span
                            >
                          </div>
                          <div class="md-preview-dialog__chip">
                            <strong>${h}</strong>
                            <span>${f(`agents.files.lines`)}</span>
                          </div>
                          <div class="md-preview-dialog__chip">
                            <strong>${p}</strong>
                            <span>${x}</span>
                          </div>
                        </div>
                        <div class="md-preview-dialog__body">
                          <article class="md-preview-dialog__reader sidebar-markdown">
                            ${r(d)}
                          </article>
                        </div>
                      </div>
                    </dialog>
                  `:a` <div class="muted" style="margin-top: 16px">
                    ${f(`agents.files.selectFile`)}
                  </div>`}
            `:a`
            <div class="callout info" style="margin-top: 12px">${f(`agents.files.loadHint`)}</div>
          `}
    </section>
  `}function Nn(e){return e.length===0?o:a`
    <div class="agent-tool-badges">
      ${e.map(e=>a`<span class="agent-pill">${e}</span>`)}
    </div>
  `}function Pn(e,t){let n=t.source??e.source,r=t.pluginId??e.pluginId,i=[];return n===`plugin`&&r?i.push(`Plugin: ${r}`):n===`core`&&i.push(`Built-In`),t.optional&&i.push(`Optional`),i}function Fn(e){let t=Pn(e.section,e.tool);return e.activeEntry&&t.unshift(`Live Now`),t}function In(e){return e.denied?`Disabled by agent override.`:e.allowed&&e.baseAllowed?`Enabled by the current profile.`:e.allowed?`Enabled by agent override.`:`Not included in the current profile.`}function Ln(e,t){let n=t.source??e.source,r=t.pluginId??e.pluginId;return n===`plugin`&&r?`Plugin: ${r}`:`Built-In`}function Rn(e){return e.denied?`Override Off`:e.allowed&&e.baseAllowed?`Enabled`:e.allowed?`Override On`:`Profile Off`}function zn(e){return e.activeEntry?`Live Now`:e.runtimeSessionMatchesSelectedAgent?`Not Live`:`Other Agent`}function Bn(e){return`agent-tool-${k(e).replace(/[^a-z0-9_-]+/g,`-`)}`}function Vn(e,t,n=`${t}s`){return`${e} ${e===1?t:n}`}function Hn(e){return(e??[]).flatMap(e=>e.tools)}var Un=12;function Wn(e){let t=e.currentTarget;if(!(!(t instanceof HTMLDetailsElement)||t.open))for(let e of t.querySelectorAll(`.agent-tool-card[open]`))e.open=!1}function Gn(e,t){let n=document.getElementById(t);if(!(n instanceof HTMLDetailsElement))return;e.preventDefault();let r=n.closest(`.agent-tools-group`);r&&(r.open=!0),n.open=!0;let i=new URL(window.location.href);i.hash=t,window.history.replaceState(null,``,i),requestAnimationFrame(()=>{let e=typeof window.matchMedia==`function`&&window.matchMedia(`(prefers-reduced-motion: reduce)`).matches;n.scrollIntoView?.({block:`center`,behavior:e?`auto`:`smooth`}),n.querySelector(`summary`)?.focus()})}function Kn(e){let t=e?.notices??[];return t.length===0?o:a`
    <div class="agent-tools-notices">
      ${t.map(e=>a`
          <div
            class="callout ${e.severity===`warning`?`warning`:`info`}"
            style="margin-top: 12px"
          >
            ${e.message}
          </div>
        `)}
    </div>
  `}function qn(e){return e.source===`plugin`?e.pluginId?f(`agentTools.connectedSource`,{id:e.pluginId}):f(`agentTools.connected`):e.source===`channel`?e.channelId?f(`agentTools.channelSource`,{id:e.channelId}):f(`agentTools.channel`):e.source===`mcp`?`MCP`:f(`agentTools.builtIn`)}function Jn(e){let t=A(e.configForm,e.agentId),n=t.entry?.tools??{},r=t.globalTools??{},i=n.profile??r.profile??`full`,s=he(e.toolsCatalogResult),c=ge(e.toolsCatalogResult),l=n.profile?`agent override`:r.profile?`global default`:`default`,u=Array.isArray(n.allow)&&n.allow.length>0,d=Array.isArray(r.allow)&&r.allow.length>0,p=!!e.configForm&&!e.configLoading&&!e.configSaving&&!u&&!(e.toolsCatalogLoading&&!e.toolsCatalogResult&&!e.toolsCatalogError),m=u?[]:Array.isArray(n.alsoAllow)?n.alsoAllow:[],h=u?[]:Array.isArray(n.deny)?n.deny:[],g=u?{allow:n.allow??[],deny:n.deny??[]}:te(i)??void 0,_=c.flatMap(e=>e.tools.map(e=>e.id)),v=e=>{let t=le(e,g),n=fe(e,m),r=fe(e,h);return{allowed:(t||n)&&!r,baseAllowed:t,denied:r}},y=_.filter(e=>v(e).allowed).length,b=e.runtimeSessionMatchesSelectedAgent&&!e.toolsEffectiveError?Hn(e.toolsEffectiveResult?.groups):[],x=Array.from(new Map(b.map(e=>[k(e.id),e])).values()),S=x.slice(0,Un),C=Math.max(0,x.length-S.length),w=x.length,T=new Map(b.map(e=>[k(e.id),e])),E=new Set(T.keys()),D=e=>e.toSorted((e,t)=>{let n=k(e.id),r=k(t.id),i=+!!E.has(n),a=+!!E.has(r);if(i!==a)return a-i;let o=+!!v(e.id).allowed,s=+!!v(t.id).allowed;return o===s?e.label.localeCompare(t.label):s-o}),ee=(t,n)=>{let r=new Set(m.map(e=>k(e)).filter(e=>e.length>0)),i=new Set(h.map(e=>k(e)).filter(e=>e.length>0)),a=v(t).baseAllowed,o=k(t);n?(i.delete(o),a||r.add(o)):(r.delete(o),i.add(o)),e.onOverridesChange(e.agentId,[...r],[...i])},O=t=>{let n=new Set(m.map(e=>k(e)).filter(e=>e.length>0)),r=new Set(h.map(e=>k(e)).filter(e=>e.length>0));for(let e of _){let i=v(e).baseAllowed,a=k(e);t?(r.delete(a),i||n.add(a)):(n.delete(a),r.add(a))}e.onOverridesChange(e.agentId,[...n],[...r])};return a`
    <section class="card">
      <div class="agent-tools-header">
        <div class="agent-tools-header__intro">
          <div class="card-title">Tool Access</div>
          <div class="card-sub">
            Profile + per-tool overrides for this agent.
            <span class="mono">${y}/${_.length}</span> enabled.
          </div>
        </div>
        <div class="agent-tools-header__actions">
          <button class="btn btn--sm" ?disabled=${!p} @click=${()=>O(!0)}>
            Enable All
          </button>
          <button class="btn btn--sm" ?disabled=${!p} @click=${()=>O(!1)}>
            Disable All
          </button>
          <button
            class="btn btn--sm"
            ?disabled=${e.configLoading}
            @click=${e.onConfigReload}
          >
            ${f(`common.reloadConfig`)}
          </button>
          <button
            class="btn btn--sm primary"
            ?disabled=${e.configSaving||!e.configDirty}
            @click=${e.onConfigSave}
          >
            ${e.configSaving?`Saving…`:`Save`}
          </button>
        </div>
      </div>

      ${e.configForm?o:a`
            <div class="callout info" style="margin-top: 12px">
              Load the gateway config to adjust tool profiles.
            </div>
          `}
      ${u?a`
            <div class="callout info" style="margin-top: 12px">
              This agent is using an explicit allowlist in config. Tool overrides are managed in the
              Config tab.
            </div>
          `:o}
      ${d?a`
            <div class="callout info" style="margin-top: 12px">
              Global tools.allow is set. Agent overrides cannot enable tools that are globally
              blocked.
            </div>
          `:o}
      ${e.toolsCatalogLoading&&!e.toolsCatalogResult&&!e.toolsCatalogError?a`
            <div class="callout info" style="margin-top: 12px">Loading runtime tool catalog…</div>
          `:o}
      ${e.toolsCatalogError?a`
            <div class="callout info" style="margin-top: 12px">
              Could not load runtime tool catalog. Showing built-in fallback list instead.
            </div>
          `:o}

      <div class="agent-tools-overview">
        <div class="agent-tools-overview__primary">
          <div class="agent-tools-pane">
            <div class="label">Available Right Now</div>
            <div class="card-sub">
              What this agent can use in the current chat session.
              <span class="mono">${e.runtimeSessionKey||`no session`}</span>
            </div>
            ${Kn(e.toolsEffectiveResult)}
            ${e.runtimeSessionMatchesSelectedAgent?e.toolsEffectiveLoading&&!e.toolsEffectiveResult&&!e.toolsEffectiveError?a`
                    <div class="callout info" style="margin-top: 12px">
                      Loading available tools…
                    </div>
                  `:e.toolsEffectiveError?a`
                      <div class="callout info" style="margin-top: 12px">
                        Could not load available tools for this session.
                      </div>
                    `:(e.toolsEffectiveResult?.groups?.length??0)===0?a`
                        <div class="callout info" style="margin-top: 12px">
                          No tools are available for this session right now.
                        </div>
                      `:a`
                        <div class="agent-tools-runtime">
                          ${S.map(e=>{let t=Bn(e.id);return a`
                              <a
                                class="agent-tools-runtime-chip"
                                href="#${t}"
                                @click=${e=>Gn(e,t)}
                              >
                                <span class="mono" translate="no">${e.label}</span>
                                <span class="agent-tools-runtime-chip__meta"
                                  >${qn(e)}</span
                                >
                              </a>
                            `})}
                          ${C>0?a`
                                <span
                                  class="agent-tools-runtime-chip agent-tools-runtime-chip--more"
                                  title=${`${C} more live tools are available in the groups below.`}
                                >
                                  +${C} more live tools
                                </span>
                              `:o}
                        </div>
                      `:a`
                  <div class="callout info" style="margin-top: 12px">
                    Switch chat to this agent to view its live runtime tools.
                  </div>
                `}
          </div>

          <div class="agent-tools-pane">
            <div class="label">Quick Presets</div>
            <div class="agent-tools-buttons">
              ${s.map(t=>a`
                  <button
                    class="btn btn--sm ${i===t.id?`active`:``}"
                    ?disabled=${!p}
                    @click=${()=>e.onProfileChange(e.agentId,t.id,!0)}
                  >
                    ${t.label}
                  </button>
                `)}
              <button
                class="btn btn--sm"
                ?disabled=${!p}
                @click=${()=>e.onProfileChange(e.agentId,null,!1)}
              >
                Inherit
              </button>
            </div>
          </div>
        </div>

        <div class="agent-tools-facts">
          <div class="agent-tools-fact">
            <div class="label">Profile</div>
            <div class="mono">${i}</div>
          </div>
          <div class="agent-tools-fact">
            <div class="label">Source</div>
            <div>${l}</div>
          </div>
          <div class="agent-tools-fact">
            <div class="label">Enabled</div>
            <div class="mono">${y}/${_.length}</div>
          </div>
          <div class="agent-tools-fact">
            <div class="label">Live</div>
            <div class="mono">${w}</div>
          </div>
          <div class="agent-tools-fact">
            <div class="label">Status</div>
            <div class="mono">
              ${e.configSaving?`saving…`:e.configDirty?`unsaved`:`saved`}
            </div>
          </div>
        </div>
      </div>

      <div class="agent-tools-grid">
        ${c.map(t=>{let n=D(t.tools),r=t.tools.filter(e=>v(e.id).allowed).length,i=t.tools.filter(e=>E.has(k(e.id))).length,s=n.slice(0,4),c=Math.max(0,n.length-s.length);return a`
            <details class="agent-tools-group" @toggle=${Wn}>
              <summary class="agent-tools-group__summary">
                <span class="agent-tools-group__summary-main">
                  <span class="agent-tools-group__title">
                    ${t.label}
                    ${t.source===`plugin`&&t.pluginId?a`<span class="agent-pill">Plugin: ${t.pluginId}</span>`:o}
                  </span>
                  <span class="agent-tools-group__preview" aria-label="Tool preview">
                    ${s.map(e=>a`<span class="mono" translate="no" title=${e.label}
                          >${e.label}</span
                        >`)}
                    ${c>0?a`<span>+${c} more</span>`:o}
                  </span>
                </span>
                <span class="agent-tools-group__counts">
                  <span>${Vn(t.tools.length,`Tool`)}</span>
                  <span>${Vn(r,`Enabled Tool`)}</span>
                  ${i>0?a`<span>${Vn(i,`Live Tool`)}</span>`:o}
                </span>
              </summary>
              <div class="agent-tools-list agent-tools-list--stacked">
                ${n.map(n=>{let r=Bn(n.id),i=v(n.id),s=T.get(k(n.id))??null,c=n.defaultProfiles??[],l=Fn({section:t,tool:n,activeEntry:s}),u=Rn(i),d=zn({activeEntry:s,runtimeSessionMatchesSelectedAgent:e.runtimeSessionMatchesSelectedAgent});return a`
                    <details class="agent-tool-card" id=${r}>
                      <summary class="agent-tool-summary">
                        <div class="agent-tool-summary__main">
                          <div class="agent-tool-summary__title-row">
                            <span class="agent-tool-title mono" translate="no">${n.label}</span>
                          </div>
                          <div class="agent-tool-sub">${n.description}</div>
                        </div>
                        <dl class="agent-tool-summary__facts">
                          <div class="agent-tool-summary__fact">
                            <dt class="label">Access</dt>
                            <dd>${u}</dd>
                          </div>
                          <div class="agent-tool-summary__fact">
                            <dt class="label">Session</dt>
                            <dd>${d}</dd>
                          </div>
                        </dl>
                        <div class="agent-tool-summary__badges">
                          ${Nn(l)}
                        </div>
                        <label
                          class="cfg-toggle agent-tool-toggle"
                          @click=${e=>e.stopPropagation()}
                          @keydown=${e=>e.stopPropagation()}
                        >
                          <input
                            type="checkbox"
                            .checked=${i.allowed}
                            ?disabled=${!p}
                            aria-label=${`${i.allowed?`Disable`:`Enable`} ${n.label}`}
                            @change=${e=>ee(n.id,e.target.checked)}
                          />
                          <span class="cfg-toggle__track"></span>
                        </label>
                      </summary>
                      <div class="agent-tool-details">
                        <div class="agent-tool-details-strip">
                          <div class="agent-tool-detail agent-tool-detail--inline">
                            <div class="label">Access</div>
                            <div>${In(i)}</div>
                          </div>
                          <div class="agent-tool-detail agent-tool-detail--inline">
                            <div class="label">Source</div>
                            <div>${Ln(t,n)}</div>
                          </div>
                          ${c.length>0?a`
                                <div class="agent-tool-detail agent-tool-detail--inline">
                                  <div class="label">Default Presets</div>
                                  <div class="agent-tool-badges">
                                    ${c.map(e=>a`<span class="agent-pill">${e}</span>`)}
                                  </div>
                                </div>
                              `:o}
                          <div class="agent-tool-detail agent-tool-detail--inline">
                            <div class="label">Current Session</div>
                            <div>
                              ${s?`Available now via ${qn(s)}.`:e.runtimeSessionMatchesSelectedAgent?`Not available in this chat session right now.`:`Switch chat to this agent to inspect live availability.`}
                            </div>
                          </div>
                          <a class="agent-tool-jump" href="#${r}"> Link to This Tool </a>
                        </div>
                      </div>
                    </details>
                  `})}
              </div>
            </details>
          `})}
      </div>
    </section>
  `}function Yn(e){let t=!!e.configForm&&!e.configLoading&&!e.configSaving,n=A(e.configForm,e.agentId),r=Array.isArray(n.entry?.skills)?n.entry?.skills:void 0,i=new Set(d(r??[])),s=r!==void 0,c=!!(e.report&&e.activeAgentId===e.agentId),l=c?e.report?.skills??[]:[],p=u(e.filter),m=p?l.filter(e=>u([e.name,e.description,e.source].join(` `)).includes(p)):l,h=Ee(m),g=s?l.filter(e=>i.has(e.name)).length:l.length,_=l.length;return a`
    <section class="card">
      <div class="row" style="justify-content: space-between; flex-wrap: wrap;">
        <div style="min-width: 0;">
          <div class="card-title">Skills</div>
          <div class="card-sub">
            Per-agent skill allowlist and workspace skills.
            ${_>0?a`<span class="mono">${g}/${_}</span>`:o}
          </div>
        </div>
        <div class="row" style="gap: 8px; flex-wrap: wrap;">
          <div
            class="row"
            style="gap: 4px; border: 1px solid var(--border); border-radius: var(--radius-md); padding: 2px;"
          >
            <button
              class="btn btn--sm"
              ?disabled=${!t}
              @click=${()=>e.onClear(e.agentId)}
            >
              Enable All
            </button>
            <button
              class="btn btn--sm"
              ?disabled=${!t}
              @click=${()=>e.onDisableAll(e.agentId)}
            >
              Disable All
            </button>
            <button
              class="btn btn--sm"
              ?disabled=${!t||!s}
              @click=${()=>e.onClear(e.agentId)}
            >
              Reset
            </button>
          </div>
          <button
            class="btn btn--sm"
            ?disabled=${e.configLoading}
            @click=${e.onConfigReload}
          >
            ${f(`common.reloadConfig`)}
          </button>
          <button class="btn btn--sm" ?disabled=${e.loading} @click=${e.onRefresh}>
            ${e.loading?f(`common.loading`):f(`common.refresh`)}
          </button>
          <button
            class="btn btn--sm primary"
            ?disabled=${e.configSaving||!e.configDirty}
            @click=${e.onConfigSave}
          >
            ${e.configSaving?`Saving…`:`Save`}
          </button>
        </div>
      </div>

      ${e.configForm?o:a`
            <div class="callout info" style="margin-top: 12px">
              Load the gateway config to set per-agent skills.
            </div>
          `}
      ${s?a`
            <div class="callout info" style="margin-top: 12px">
              This agent uses a custom skill allowlist.
            </div>
          `:a`
            <div class="callout info" style="margin-top: 12px">
              All skills are enabled. Disabling any skill will create a per-agent allowlist.
            </div>
          `}
      ${!c&&!e.loading?a`
            <div class="callout info" style="margin-top: 12px">
              Load skills for this agent to view workspace-specific entries.
            </div>
          `:o}
      ${e.error?a`<div class="callout danger" style="margin-top: 12px;">${e.error}</div>`:o}

      <div class="filters" style="margin-top: 14px;">
        <label class="field" style="flex: 1;">
          <span>Filter</span>
          <input
            .value=${e.filter}
            @input=${t=>e.onFilterChange(t.target.value)}
            placeholder="Search skills"
            autocomplete="off"
            name="agent-skills-filter"
          />
        </label>
        <div class="muted">${m.length} shown</div>
      </div>

      ${m.length===0?a` <div class="muted" style="margin-top: 16px">No skills found.</div> `:a`
            <div class="agent-skills-groups" style="margin-top: 16px;">
              ${h.map(n=>Xn(n,{agentId:e.agentId,allowSet:i,usingAllowlist:s,editable:t,onToggle:e.onToggle}))}
            </div>
          `}
    </section>
  `}function Xn(e,t){return a`
    <details class="agent-skills-group" ?open=${!(e.id===`workspace`||e.id===`built-in`)}>
      <summary class="agent-skills-header">
        <span>${e.label}</span>
        <span class="muted">${e.skills.length}</span>
      </summary>
      <div class="list skills-grid">
        ${e.skills.map(e=>Zn(e,{agentId:t.agentId,allowSet:t.allowSet,usingAllowlist:t.usingAllowlist,editable:t.editable,onToggle:t.onToggle}))}
      </div>
    </details>
  `}function Zn(e,t){let n=t.usingAllowlist?t.allowSet.has(e.name):!0,r=ke(e),i=Oe(e);return a`
    <div class="list-item agent-skill-row">
      <div class="list-main">
        <div class="list-title">${e.emoji?`${e.emoji} `:``}${e.name}</div>
        <div class="list-sub">${e.description}</div>
        ${De({skill:e})}
        ${r.length>0?a`<div class="muted" style="margin-top: 6px;">Missing: ${r.join(`, `)}</div>`:o}
        ${i.length>0?a`<div class="muted" style="margin-top: 6px;">Reason: ${i.join(`, `)}</div>`:o}
      </div>
      <div class="list-meta">
        <label class="cfg-toggle">
          <input
            type="checkbox"
            .checked=${n}
            ?disabled=${!t.editable}
            @change=${n=>t.onToggle(t.agentId,e.name,n.target.checked)}
          />
          <span class="cfg-toggle__track"></span>
        </label>
      </div>
    </div>
  `}function Qn(e){let t=e.agentsList?.agents??[],n=e.agentsList?.defaultId??null,r=e.selectedAgentId??n??t[0]?.id??null,i=r?t.find(e=>e.id===r)??null:null,c=r&&e.agentSkills.agentId===r?e.agentSkills.report?.skills?.length??null:null,l=e.channels.snapshot?Object.keys(e.channels.snapshot.channelAccounts??{}).length:null,u=r?e.cron.jobs.filter(e=>e.agentId===r).length:null,d={files:e.agentFiles.list?.files?.length??null,skills:c,channels:l,cron:u||null};return a`
    <div class="agents-layout">
      <section class="agents-toolbar">
        <div class="agents-toolbar-row">
          <div class="agents-control-select">
            <select
              class="agents-select"
              .value=${r??``}
              ?disabled=${e.loading||t.length===0}
              @change=${t=>e.onSelectAgent(t.target.value)}
            >
              ${t.length===0?a` <option value="">${f(`agents.noAgents`)}</option> `:t.map(e=>a`
                      <option value=${e.id} ?selected=${e.id===r}>
                        ${re(e)}${pe(e.id,n)?` (${pe(e.id,n)})`:``}
                      </option>
                    `)}
            </select>
          </div>
          <div class="agents-toolbar-actions">
            ${i?a`
                  <button
                    type="button"
                    class="btn btn--sm btn--ghost"
                    @click=${()=>void navigator.clipboard.writeText(i.id)}
                  >
                    ${f(`agents.copyId`)}
                  </button>
                  <button
                    type="button"
                    class="btn btn--sm btn--ghost"
                    ?disabled=${!!(n&&i.id===n)}
                    @click=${()=>e.onSetDefault(i.id)}
                  >
                    ${n&&i.id===n?f(`agents.default`):f(`agents.setDefault`)}
                  </button>
                `:o}
            <button
              class="btn btn--sm agents-refresh-btn"
              ?disabled=${e.loading}
              @click=${e.onRefresh}
            >
              ${e.loading?f(`common.loading`):f(`common.refresh`)}
            </button>
          </div>
        </div>
        ${e.error?a`<div class="callout danger" style="margin-top: 8px;">${e.error}</div>`:o}
      </section>
      <section class="agents-main">
        ${i?a`
              ${$n(e.activePanel,t=>e.onSelectPanel(t),d)}
              ${e.activePanel===`overview`?s(i.id,Pe({agent:i,basePath:e.basePath,defaultId:n,configForm:e.config.form,agentFilesList:e.agentFiles.list,agentIdentity:e.agentIdentityById[i.id]??null,agentIdentityError:e.agentIdentityError,agentIdentityLoading:e.agentIdentityLoading,configLoading:e.config.loading,configSaving:e.config.saving,configDirty:e.config.dirty,modelCatalog:e.modelCatalog,onConfigReload:e.onConfigReload,onConfigSave:e.onConfigSave,onModelChange:e.onModelChange,onModelFallbacksChange:e.onModelFallbacksChange,onSelectPanel:e.onSelectPanel})):o}
              ${e.activePanel===`files`?Mn({agentId:i.id,agentFilesList:e.agentFiles.list,agentFilesLoading:e.agentFiles.loading,agentFilesError:e.agentFiles.error,agentFileActive:e.agentFiles.active,agentFileContents:e.agentFiles.contents,agentFileDrafts:e.agentFiles.drafts,agentFileSaving:e.agentFiles.saving,onLoadFiles:e.onLoadFiles,onSelectFile:e.onSelectFile,onFileDraftChange:e.onFileDraftChange,onFileReset:e.onFileReset,onFileSave:e.onFileSave}):o}
              ${e.activePanel===`tools`?Jn({agentId:i.id,configForm:e.config.form,configLoading:e.config.loading,configSaving:e.config.saving,configDirty:e.config.dirty,toolsCatalogLoading:e.toolsCatalog.loading,toolsCatalogError:e.toolsCatalog.error,toolsCatalogResult:e.toolsCatalog.result,toolsEffectiveLoading:e.toolsEffective.loading,toolsEffectiveError:e.toolsEffective.error,toolsEffectiveResult:e.toolsEffective.result,runtimeSessionKey:e.runtimeSessionKey,runtimeSessionMatchesSelectedAgent:e.runtimeSessionMatchesSelectedAgent,onProfileChange:e.onToolsProfileChange,onOverridesChange:e.onToolsOverridesChange,onConfigReload:e.onConfigReload,onConfigSave:e.onConfigSave}):o}
              ${e.activePanel===`skills`?Yn({agentId:i.id,report:e.agentSkills.report,loading:e.agentSkills.loading,error:e.agentSkills.error,activeAgentId:e.agentSkills.agentId,configForm:e.config.form,configLoading:e.config.loading,configSaving:e.config.saving,configDirty:e.config.dirty,filter:e.agentSkills.filter,onFilterChange:e.onSkillsFilterChange,onRefresh:e.onSkillsRefresh,onToggle:e.onAgentSkillToggle,onClear:e.onAgentSkillsClear,onDisableAll:e.onAgentSkillsDisableAll,onConfigReload:e.onConfigReload,onConfigSave:e.onConfigSave}):o}
              ${e.activePanel===`channels`?An({context:de(i,e.config.form,e.agentFiles.list,n,e.agentIdentityById[i.id]??null),configForm:e.config.form,snapshot:e.channels.snapshot,loading:e.channels.loading,error:e.channels.error,lastSuccess:e.channels.lastSuccess,onRefresh:e.onChannelsRefresh,onSelectPanel:e.onSelectPanel}):o}
              ${e.activePanel===`cron`?jn({context:de(i,e.config.form,e.agentFiles.list,n,e.agentIdentityById[i.id]??null),agentId:i.id,jobs:e.cron.jobs,status:e.cron.status,loading:e.cron.loading,error:e.cron.error,onRefresh:e.onCronRefresh,onRunNow:e.onCronRunNow,onSelectPanel:e.onSelectPanel}):o}
            `:a`
              <div class="card">
                <div class="card-title">${f(`agents.selectTitle`)}</div>
                <div class="card-sub">${f(`agents.selectSubtitle`)}</div>
              </div>
            `}
      </section>
    </div>
  `}function $n(e,t,n){return a`
    <div class="agent-tabs">
      ${[{id:`overview`,label:f(`agents.tabs.overview`)},{id:`files`,label:f(`agents.tabs.files`)},{id:`tools`,label:f(`agents.tabs.tools`)},{id:`skills`,label:f(`agents.tabs.skills`)},{id:`channels`,label:f(`agents.tabs.channels`)},{id:`cron`,label:f(`agents.tabs.cronJobs`)}].map(r=>a`
          <button
            class="agent-tab ${e===r.id?`active`:``}"
            type="button"
            @click=${()=>t(r.id)}
          >
            ${r.label}${n[r.id]==null?o:a`<span class="agent-tab-count">${n[r.id]}</span>`}
          </button>
        `)}
    </div>
  `}var $=class extends c{constructor(...e){super(...e),this.client=null,this.connected=!1,this.agentsLoading=!1,this.agentsError=null,this.agentsList=null,this.agentsSelectedId=null,this.agentsPanel=`files`,this.toolsCatalogLoading=!1,this.toolsCatalogLoadingAgentId=null,this.toolsCatalogError=null,this.toolsCatalogResult=null,this.toolsEffectiveLoading=!1,this.toolsEffectiveLoadingKey=null,this.toolsEffectiveResultKey=null,this.toolsEffectiveError=null,this.toolsEffectiveResult=null,this.chatModelCatalog=[],this.agentFilesLoading=!1,this.agentFilesError=null,this.agentFilesList=null,this.agentFileContents={},this.agentFileDrafts={},this.agentFileActive=null,this.agentFileSaving=!1,this.agentIdentityLoading=!1,this.agentIdentityError=null,this.agentSkillsLoading=!1,this.agentSkillsError=null,this.agentSkillsReport=null,this.agentSkillsAgentId=null,this.skillsFilter=``,this.cron=we(),this.routeDataInitialized=!1}createRenderRoot(){return this}get sessions(){return this.context.sessions}get sessionsResult(){return this.context.sessions.state.result}get sessionKey(){return this.context.gateway.snapshot.sessionKey}connectedCallback(){super.connectedCallback(),this.syncGatewayState(),this.syncAgentState(),this.stopGatewaySubscription=this.context.gateway.subscribe(e=>{let t=this.client;this.syncGatewayState(),t!==e.client&&this.resetForClientChange(),this.ensureInitialData()}),this.stopAgentsSubscription=this.context.agents.subscribe(()=>{this.syncAgentState(),this.ensureAgentIdentities(),this.loadActivePanelData(),this.requestUpdate()}),this.stopAgentIdentitySubscription=this.context.agentIdentity.subscribe(()=>this.requestUpdate()),this.stopChannelsSubscription=this.context.channels.subscribe(()=>this.requestUpdate()),this.stopConfigSubscription=this.context.runtimeConfig.subscribe(()=>this.requestUpdate()),this.stopSessionsSubscription=this.context.sessions.subscribe(()=>{h(this),this.requestUpdate()}),this.ensureInitialData()}willUpdate(e){e.has(`routeData`)&&(this.applyRouteData(),this.ensureInitialData())}disconnectedCallback(){this.stopGatewaySubscription?.(),this.stopGatewaySubscription=void 0,this.stopAgentsSubscription?.(),this.stopAgentsSubscription=void 0,this.stopAgentIdentitySubscription?.(),this.stopAgentIdentitySubscription=void 0,this.stopChannelsSubscription?.(),this.stopChannelsSubscription=void 0,this.stopConfigSubscription?.(),this.stopConfigSubscription=void 0,this.stopSessionsSubscription?.(),this.stopSessionsSubscription=void 0,super.disconnectedCallback()}syncGatewayState(){let e=this.context.gateway.snapshot;this.client=e.client,this.connected=e.connected,this.cron={...this.cron,client:e.client,connected:e.connected}}syncAgentState(){let e=this.context.agents.state;this.agentsLoading=e.agentsLoading,this.agentsError=e.agentsError,this.agentsList=e.agentsList,e.agentsList&&this.ensureSelectedAgentInList(e.agentsList),this.syncCurrentAgentFiles()}ensureSelectedAgentInList(e){let t=this.agentsSelectedId;(!t||!e.agents.some(e=>e.id===t))&&(this.agentsSelectedId=e.defaultId??e.agents[0]?.id??null)}syncCurrentAgentFiles(){let e=this.resolveSelectedAgentId();if(!e||this.agentsPanel!==`files`)return;let t=this.context.agents.files(e);t.list&&(this.agentFilesList=t.list,this.agentFilesError=t.error,this.agentFileActive&&!t.list.files.some(e=>e.name===this.agentFileActive)&&(this.agentFileActive=null))}resetForClientChange(){this.agentsLoading=!1,this.agentsError=null,this.agentsList=null,this.agentsSelectedId=null,this.resetSelectionState(),this.cron=we({client:this.client,connected:this.connected})}applyRouteData(){let e=this.routeData;e&&(this.routeDataInitialized=!0,this.agentsLoading=!1,this.agentsError=e.error,e.agentsList&&(this.agentsList=e.agentsList,this.agentsSelectedId=e.selectedAgentId??this.resolveSelectedAgentId()))}resolveSelectedAgentId(){return this.agentsSelectedId??this.agentsList?.defaultId??this.agentsList?.agents?.[0]?.id??null}chatAgentId(){return m(this.sessionKey)?.agentId??this.context.gateway.snapshot.assistantAgentId??this.agentsList?.defaultId??`main`}agentIdentityById(){return Object.fromEntries(this.context.agentIdentity.entries().map(e=>[e.agentId,e]))}ensureInitialData(){if(!(!this.connected||!this.client||!this.routeDataInitialized)){if(!this.context.runtimeConfig.state.configSnapshot&&!this.context.runtimeConfig.state.configLoading&&this.context.runtimeConfig.ensureLoaded(),!this.agentsList&&!this.agentsLoading){this.loadAgentsAndCommit();return}this.ensureAgentIdentities(),this.loadActivePanelData()}}ensureAgentIdentities(){let e=this.agentsList?.agents.map(e=>e.id).filter(e=>!this.context.agentIdentity.get(e))??[];e.length===0||this.agentIdentityLoading||(this.agentIdentityLoading=!0,this.agentIdentityError=null,this.context.agentIdentity.ensure(e).catch(e=>{this.agentIdentityError=String(e)}).finally(()=>{this.agentIdentityLoading=!1}))}loadActivePanelData(){let e=this.resolveSelectedAgentId();if(e){if(this.agentsPanel===`files`&&this.agentFilesList?.agentId!==e){this.loadAgentFiles(e);return}if(this.agentsPanel===`skills`&&this.agentSkillsAgentId!==e){Ne(this,e);return}if(this.agentsPanel===`tools`){this.toolsCatalogResult?.agentId!==e&&!this.toolsCatalogLoading&&v(this,e),this.loadEffectiveToolsForAgent(e);return}if(this.agentsPanel===`channels`&&!this.context.channels.state.channelsSnapshot){this.context.channels.refresh(!1);return}this.agentsPanel===`cron`&&!this.cron.cronLoading&&!this.cron.cronStatus&&this.refreshCron()}}async loadAgentsAndCommit(){await this.context.agents.ensureList(),this.syncAgentState(),this.ensureAgentIdentities(),this.loadActivePanelData()}async loadAgentFiles(e,t=!1){if(!(!this.client||!this.connected||this.agentFilesLoading)){if(this.context.agents.files(e).list&&!t){this.syncCurrentAgentFiles();return}this.agentFilesLoading=!0,this.agentFilesError=null;try{let n=t?await this.context.agents.refreshFiles(e):await this.context.agents.ensureFiles(e);if(this.resolveSelectedAgentId()!==e)return;this.agentFilesList=n??this.context.agents.files(e).list,this.agentFilesError=this.context.agents.files(e).error,this.agentFileActive&&!this.agentFilesList?.files.some(e=>e.name===this.agentFileActive)&&(this.agentFileActive=null)}finally{this.resolveSelectedAgentId()===e&&(this.agentFilesLoading=!1)}}}async refreshCron(){let e=this.cron;!e.connected||!e.client||(await Promise.all([Se(e),xe(e,{tableFilters:!0})]),this.cron===e&&(this.cron={...e,cronJobs:[...e.cronJobs]}))}resetSelectionState(){this.agentFilesList=null,this.agentFilesError=null,this.agentFileActive=null,this.agentFileContents={},this.agentFileDrafts={},this.agentFilesLoading=!1,this.agentSkillsReport=null,this.agentSkillsError=null,this.agentSkillsAgentId=null,this.toolsCatalogResult=null,this.toolsCatalogError=null,this.toolsCatalogLoading=!1,D(this)}findAgentIndex(e){return E(T(this.context.runtimeConfig.state),e)}ensureAgentIndex(e){return this.context.runtimeConfig.ensureAgentEntry(e)}toolsPath(e,t){let n=t?this.ensureAgentIndex(e):this.findAgentIndex(e);return n>=0?[`agents`,`list`,n,`tools`]:null}modelEntry(e){let t=T(this.context.runtimeConfig.state)?.agents?.list,n=Array.isArray(t)?t[e]?.model:void 0;return{path:[`agents`,`list`,e,`model`],existing:n}}loadEffectiveToolsForAgent(e){if(e!==this.chatAgentId()){D(this);return}let t=ee(this,{agentId:e,sessionKey:this.sessionKey});this.toolsEffectiveResultKey===t&&!this.toolsEffectiveError||g(this,{agentId:e,sessionKey:this.sessionKey})}selectAgent(e){this.agentsSelectedId!==e&&(this.agentsSelectedId=e,this.resetSelectionState(),this.context.agentIdentity.ensure([e]),this.loadActivePanelData())}selectPanel(e){this.agentsPanel=e,this.loadActivePanelData()}refreshAgents(){(async()=>{await this.context.agents.refreshList(),this.syncAgentState(),this.loadActivePanelData()})()}saveAgentConfig(){let e=this.agentsSelectedId;(async()=>{await this.context.runtimeConfig.save(),await this.context.agents.refreshList(),this.syncAgentState(),e&&this.agentsList?.agents.some(t=>t.id===e)&&(this.agentsSelectedId=e),this.ensureAgentIdentities(),this.loadActivePanelData()})()}reloadConfig(){this.context.runtimeConfig.refresh({discardPendingChanges:!0})}runCronJobNow(e){let t=this.cron.cronJobs.find(t=>t.id===e);t&&Ce(this.cron,t,`force`).finally(()=>{this.cron={...this.cron,cronJobs:[...this.cron.cronJobs]}})}render(){let e=this.context.runtimeConfig.state,t=this.resolveSelectedAgentId(),n=T(e);return a`
      <section class="content-header">
        <div>
          <div class="page-title">${y(`agents`)}</div>
          <div class="page-sub">${x(`agents`)}</div>
        </div>
      </section>
      ${O(this.context.basePath,Qn({basePath:this.context.basePath,loading:this.agentsLoading,error:this.agentsError,agentsList:this.agentsList,selectedAgentId:t,activePanel:this.agentsPanel,config:{form:n,loading:e.configLoading,saving:e.configSaving,dirty:e.configFormDirty},channels:{snapshot:this.context.channels.state.channelsSnapshot,loading:this.context.channels.state.channelsLoading,error:this.context.channels.state.channelsError,lastSuccess:this.context.channels.state.channelsLastSuccess},cron:{status:this.cron.cronStatus,jobs:this.cron.cronJobs,loading:this.cron.cronLoading,error:this.cron.cronError},agentFiles:{list:this.agentFilesList,loading:this.agentFilesLoading,error:this.agentFilesError,active:this.agentFileActive,contents:this.agentFileContents,drafts:this.agentFileDrafts,saving:this.agentFileSaving},agentIdentityLoading:this.agentIdentityLoading,agentIdentityError:this.agentIdentityError,agentIdentityById:this.agentIdentityById(),agentSkills:{report:this.agentSkillsReport,loading:this.agentSkillsLoading,error:this.agentSkillsError,agentId:this.agentSkillsAgentId,filter:this.skillsFilter},toolsCatalog:{loading:this.toolsCatalogLoading,error:this.toolsCatalogError,result:this.toolsCatalogResult},toolsEffective:{loading:this.toolsEffectiveLoading,error:this.toolsEffectiveError,result:this.toolsEffectiveResult},runtimeSessionKey:this.sessionKey,runtimeSessionMatchesSelectedAgent:t===this.chatAgentId(),modelCatalog:this.chatModelCatalog,onRefresh:()=>this.refreshAgents(),onSelectAgent:e=>this.selectAgent(e),onSelectPanel:e=>this.selectPanel(e),onLoadFiles:e=>void this.loadAgentFiles(e,!0),onSelectFile:e=>{this.agentFileActive=e,t&&je(this,t,e)},onFileDraftChange:(e,t)=>{this.agentFileDrafts={...this.agentFileDrafts,[e]:t}},onFileReset:e=>{this.agentFileDrafts={...this.agentFileDrafts,[e]:this.agentFileContents[e]??``}},onFileSave:e=>{t&&Me(this,t,e,this.agentFileDrafts[e]??this.agentFileContents[e]??``).then(()=>this.loadAgentFiles(t,!0))},onToolsProfileChange:(e,t,n)=>{let r=this.toolsPath(e,!!(t||n));r&&(t?this.context.runtimeConfig.patchForm([...r,`profile`],t):this.context.runtimeConfig.removeFormValue([...r,`profile`]),n&&this.context.runtimeConfig.removeFormValue([...r,`allow`]))},onToolsOverridesChange:(e,t,n)=>{let r=this.toolsPath(e,t.length>0||n.length>0);r&&(t.length?this.context.runtimeConfig.patchForm([...r,`alsoAllow`],t):this.context.runtimeConfig.removeFormValue([...r,`alsoAllow`]),n.length?this.context.runtimeConfig.patchForm([...r,`deny`],n):this.context.runtimeConfig.removeFormValue([...r,`deny`]))},onConfigReload:()=>this.reloadConfig(),onConfigSave:()=>this.saveAgentConfig(),onChannelsRefresh:()=>void this.context.channels.refresh(!1),onCronRefresh:()=>void this.refreshCron(),onCronRunNow:e=>this.runCronJobNow(e),onSkillsFilterChange:e=>this.skillsFilter=e,onSkillsRefresh:()=>{t&&Ne(this,t)},onAgentSkillToggle:(t,n,r)=>{let i=this.ensureAgentIndex(t);if(i<0||!n.trim())return;let a=T(e)?.agents?.list,o=Array.isArray(a)?a[i]:void 0,s=Array.isArray(o?.skills)?d(o.skills):this.agentSkillsReport?.skills?.map(e=>e.name).filter(Boolean)??[],c=new Set(s);r?c.add(n.trim()):c.delete(n.trim()),this.context.runtimeConfig.patchForm([`agents`,`list`,i,`skills`],[...c])},onAgentSkillsClear:e=>{let t=this.findAgentIndex(e);t>=0&&this.context.runtimeConfig.removeFormValue([`agents`,`list`,t,`skills`])},onAgentSkillsDisableAll:e=>{let t=this.ensureAgentIndex(e);t>=0&&this.context.runtimeConfig.patchForm([`agents`,`list`,t,`skills`],[])},onModelChange:(e,t)=>{let n=t?this.ensureAgentIndex(e):this.findAgentIndex(e);if(n<0)return;let r=this.modelEntry(n);if(!t)this.context.runtimeConfig.removeFormValue(r.path);else if(r.existing&&typeof r.existing==`object`){let e=r.existing.fallbacks;this.context.runtimeConfig.patchForm(r.path,{primary:t,...Array.isArray(e)?{fallbacks:e}:{}})}else this.context.runtimeConfig.patchForm(r.path,t);h(this)},onModelFallbacksChange:(e,t)=>{let r=d(t),i=A(n,e),a=j(i.entry?.model)??j(i.defaults?.model),o=ue(i.entry?.model,i.defaults?.model),s=r.length>0?a?this.ensureAgentIndex(e):-1:(o?.length??0)>0||this.findAgentIndex(e)>=0?this.ensureAgentIndex(e):-1;if(s<0)return;let c=this.modelEntry(s),l=typeof c.existing==`string`?c.existing.trim():c.existing&&typeof c.existing==`object`&&typeof c.existing.primary==`string`?c.existing.primary.trim():``;r.length===0?l||a?this.context.runtimeConfig.patchForm(c.path,l||a):this.context.runtimeConfig.removeFormValue(c.path):(l||a)&&this.context.runtimeConfig.patchForm(c.path,{primary:l||a,fallbacks:r})},onSetDefault:e=>{(async()=>{await this.context.runtimeConfig.ensureLoaded(),await b(this.context.runtimeConfig,e,()=>this.context.agents.refreshList())})()}}),`agents`,e=>this.context.navigate(e),e=>this.context.preload(e))}
    `}};n([t({context:e,subscribe:!1})],$.prototype,`context`,void 0),n([l({attribute:!1})],$.prototype,`routeData`,void 0),n([i()],$.prototype,`client`,void 0),n([i()],$.prototype,`connected`,void 0),n([i()],$.prototype,`agentsLoading`,void 0),n([i()],$.prototype,`agentsError`,void 0),n([i()],$.prototype,`agentsList`,void 0),n([i()],$.prototype,`agentsSelectedId`,void 0),n([i()],$.prototype,`agentsPanel`,void 0),n([i()],$.prototype,`toolsCatalogLoading`,void 0),n([i()],$.prototype,`toolsCatalogLoadingAgentId`,void 0),n([i()],$.prototype,`toolsCatalogError`,void 0),n([i()],$.prototype,`toolsCatalogResult`,void 0),n([i()],$.prototype,`toolsEffectiveLoading`,void 0),n([i()],$.prototype,`toolsEffectiveLoadingKey`,void 0),n([i()],$.prototype,`toolsEffectiveResultKey`,void 0),n([i()],$.prototype,`toolsEffectiveError`,void 0),n([i()],$.prototype,`toolsEffectiveResult`,void 0),n([i()],$.prototype,`chatModelCatalog`,void 0),n([i()],$.prototype,`agentFilesLoading`,void 0),n([i()],$.prototype,`agentFilesError`,void 0),n([i()],$.prototype,`agentFilesList`,void 0),n([i()],$.prototype,`agentFileContents`,void 0),n([i()],$.prototype,`agentFileDrafts`,void 0),n([i()],$.prototype,`agentFileActive`,void 0),n([i()],$.prototype,`agentFileSaving`,void 0),n([i()],$.prototype,`agentIdentityLoading`,void 0),n([i()],$.prototype,`agentIdentityError`,void 0),n([i()],$.prototype,`agentSkillsLoading`,void 0),n([i()],$.prototype,`agentSkillsError`,void 0),n([i()],$.prototype,`agentSkillsReport`,void 0),n([i()],$.prototype,`agentSkillsAgentId`,void 0),n([i()],$.prototype,`skillsFilter`,void 0),n([i()],$.prototype,`cron`,void 0),customElements.get(`openclaw-agents-page`)||customElements.define(`openclaw-agents-page`,$);
//# sourceMappingURL=agents-page-D2aTII8Q.js.map