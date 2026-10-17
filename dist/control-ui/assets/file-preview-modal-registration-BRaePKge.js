import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Eu as t,Tu as n,ju as r,wu as i}from"./control-ui-core-CTSdBcaH.js";import{Mi as a,Wr as o,Xi as s,Zi as c,ji as l,na as u,ra as d}from"./control-ui-core-vFnxmx94.js";import{$ as f,Y as p,at as m,mt as h,nt as g,r as _,t as v,ut as y}from"./lit-runtime-TNZj1e-P.js";import{ii as b}from"./ui-CnRtCcYL.js";import{Ft as x,It as S,bt as ee,in as te,on as ne,vt as re}from"./control-ui-boot-shared-DeF_v3ER.js";import{_t as ie,gt as ae,ht as oe,mt as se}from"./control-ui-boot-chat-CHJjvSiu.js";function C(e){if(e&&typeof e==`object`)switch(e[D]){case T:case E:return!0}return!1}function w(e){if(e&&typeof e==`object`)switch(e[D]){case ce:case T:case de:case E:return!0}return!1}var ce,le,T,ue,de,E,D,O,fe,pe,k,A,me,he;function j(){return(j=e((()=>{ce=Symbol.for(`yaml.alias`),le=Symbol.for(`yaml.document`),T=Symbol.for(`yaml.map`),ue=Symbol.for(`yaml.pair`),de=Symbol.for(`yaml.scalar`),E=Symbol.for(`yaml.seq`),D=Symbol.for(`yaml.node.type`),O=e=>!!e&&typeof e==`object`&&e[D]===ce,fe=e=>!!e&&typeof e==`object`&&e[D]===le,pe=e=>!!e&&typeof e==`object`&&e[D]===T,k=e=>!!e&&typeof e==`object`&&e[D]===ue,A=e=>!!e&&typeof e==`object`&&e[D]===de,me=e=>!!e&&typeof e==`object`&&e[D]===E,he=e=>(A(e)||C(e))&&!!e.anchor})))()}function M(e,t){let n=ge(t);fe(e)?N(null,e.contents,n,Object.freeze([e]))===F&&(e.contents=null):N(null,e,n,Object.freeze([]))}function N(e,t,n,r){let i=_e(e,t,n,r);if(w(i)||k(i))return ve(e,r,i),N(e,i,n,r);if(typeof i!=`symbol`){if(C(t)){r=Object.freeze(r.concat(t));for(let e=0;e<t.items.length;++e){let i=N(e,t.items[e],n,r);if(typeof i==`number`)e=i-1;else if(i===P)return P;else i===F&&(t.items.splice(e,1),--e)}}else if(k(t)){r=Object.freeze(r.concat(t));let e=N(`key`,t.key,n,r);if(e===P)return P;e===F&&(t.key=null);let i=N(`value`,t.value,n,r);if(i===P)return P;i===F&&(t.value=null)}}return i}function ge(e){return typeof e==`object`&&(e.Collection||e.Node||e.Value)?Object.assign({Alias:e.Node,Map:e.Node,Scalar:e.Node,Seq:e.Node},e.Value&&{Map:e.Value,Scalar:e.Value,Seq:e.Value},e.Collection&&{Map:e.Collection,Seq:e.Collection},e):e}function _e(e,t,n,r){if(typeof n==`function`)return n(e,t,r);if(pe(t))return n.Map?.(e,t,r);if(me(t))return n.Seq?.(e,t,r);if(k(t))return n.Pair?.(e,t,r);if(A(t))return n.Scalar?.(e,t,r);if(O(t))return n.Alias?.(e,t,r)}function ve(e,t,n){let r=t[t.length-1];if(C(r))r.items[e]=n;else if(k(r))e===`key`?r.key=n:r.value=n;else if(fe(r))r.contents=n;else{let e=O(r)?`alias`:`scalar`;throw Error(`Cannot replace node with ${e} parent`)}}var P,ye,F;function be(){return(be=e((()=>{j(),P=Symbol(`break visit`),ye=Symbol(`skip children`),F=Symbol(`remove node`),M.BREAK=P,M.SKIP=ye,M.REMOVE=F})))()}var xe,Se,Ce;function we(){return(we=e((()=>{j(),be(),xe={"!":`%21`,",":`%2C`,"[":`%5B`,"]":`%5D`,"{":`%7B`,"}":`%7D`},Se=e=>e.replace(/[!,[\]{}]/g,e=>xe[e]),Ce=class e{constructor(t,n){this.docStart=null,this.docEnd=!1,this.yaml=Object.assign({},e.defaultYaml,t),this.tags=Object.assign({},e.defaultTags,n)}clone(){let t=new e(this.yaml,this.tags);return t.docStart=this.docStart,t}atDocument(){let t=new e(this.yaml,this.tags);switch(this.yaml.version){case`1.1`:this.atNextDocument=!0;break;case`1.2`:this.atNextDocument=!1,this.yaml={explicit:e.defaultYaml.explicit,version:`1.2`},this.tags=Object.assign({},e.defaultTags)}return t}add(t,n){this.atNextDocument&&=(this.yaml={explicit:e.defaultYaml.explicit,version:`1.1`},this.tags=Object.assign({},e.defaultTags),!1);let r=t.trim().split(/[ \t]+/),i=r.shift();switch(i){case`%TAG`:{if(r.length!==2&&(n(0,`%TAG directive should contain exactly two parts`),r.length<2))return!1;let[e,t]=r;return this.tags[e]=t,!0}case`%YAML`:{if(this.yaml.explicit=!0,r.length!==1)return n(0,`%YAML directive should contain exactly one part`),!1;let[e]=r;if(e===`1.1`||e===`1.2`)return this.yaml.version=e,!0;{let t=/^\d+\.\d+$/.test(e);return n(6,`Unsupported YAML version ${e}`,t),!1}}default:return n(0,`Unknown directive ${i}`,!0),!1}}tagName(e,t){if(e===`!`)return`!`;if(e[0]!==`!`)return t(`Not a valid tag: ${e}`),null;if(e[1]===`<`){let n=e.slice(2,-1);return n===`!`||n===`!!`?(t(`Verbatim tags aren't resolved, so ${e} is invalid.`),null):(e[e.length-1]!==`>`&&t(`Verbatim tags must end with a >`),n)}let[,n,r]=e.match(/^(.*!)([^!]*)$/s);r||t(`The ${e} tag has no suffix`);let i=this.tags[n];if(i)try{return i+decodeURIComponent(r)}catch(e){return t(String(e)),null}return n===`!`?e:(t(`Could not resolve tag: ${e}`),null)}tagString(e){for(let[t,n]of Object.entries(this.tags))if(e.startsWith(n))return t+Se(e.substring(n.length));return e[0]===`!`?e:`!<${e}>`}toString(e){let t=this.yaml.explicit?[`%YAML ${this.yaml.version||`1.2`}`]:[],n=Object.entries(this.tags),r;if(e&&n.length>0&&w(e.contents)){let t={};M(e.contents,(e,n)=>{w(n)&&n.tag&&(t[n.tag]=!0)}),r=Object.keys(t)}else r=[];for(let[i,a]of n)(i!==`!!`||a!==`tag:yaml.org,2002:`)&&(!e||r.some(e=>e.startsWith(a)))&&t.push(`%TAG ${i} ${a}`);return t.join(`
`)}},Ce.defaultYaml={explicit:!1,version:`1.2`},Ce.defaultTags={"!!":`tag:yaml.org,2002:`}})))()}function Te(e){if(/[\x00-\x19\s,[\]{}]/.test(e)){let t=`Anchor must not contain whitespace or control characters: ${JSON.stringify(e)}`;throw Error(t)}return!0}function Ee(){return(Ee=e((()=>{be()})))()}function De(e,t,n,r){if(r&&typeof r==`object`){if(Array.isArray(r))for(let t=0,n=r.length;t<n;++t){let n=r[t],i=De(e,r,String(t),n);i===void 0?delete r[t]:i!==n&&(r[t]=i)}else if(r instanceof Map)for(let t of Array.from(r.keys())){let n=r.get(t),i=De(e,r,t,n);i===void 0?r.delete(t):i!==n&&r.set(t,i)}else if(r instanceof Set)for(let t of Array.from(r)){let n=De(e,r,t,t);n===void 0?r.delete(t):n!==t&&(r.delete(t),r.add(n))}else for(let[t,n]of Object.entries(r)){let i=De(e,r,t,n);i===void 0?delete r[t]:i!==n&&(r[t]=i)}}return e.call(t,n,r)}function I(e,t,n){if(Array.isArray(e))return e.map((e,t)=>I(e,String(t),n));if(e&&typeof e.toJSON==`function`){if(!n||!he(e))return e.toJSON(t,n);let r={aliasCount:0,count:1,res:void 0};n.anchors.set(e,r),n.onCreate=e=>{r.res=e,delete n.onCreate};let i=e.toJSON(t,n);return n.onCreate&&n.onCreate(i),i}return typeof e==`bigint`&&!n?.keep?Number(e):e}function L(){return(L=e((()=>{j()})))()}var Oe;function ke(){return(ke=e((()=>{j(),L(),Oe=class{constructor(e){Object.defineProperty(this,D,{value:e})}clone(){let e=Object.create(Object.getPrototypeOf(this),Object.getOwnPropertyDescriptors(this));return this.range&&(e.range=this.range.slice()),e}toJS(e,{mapAsMap:t,maxAliasCount:n,onAnchor:r,reviver:i}={}){if(!fe(e))throw TypeError(`A document argument is required`);let a={anchors:new Map,doc:e,keep:!0,mapAsMap:t===!0,mapKeyWarned:!1,maxAliasCount:typeof n==`number`?n:100},o=I(this,``,a);if(typeof r==`function`)for(let{count:e,res:t}of a.anchors.values())r(t,e);return typeof i==`function`?De(i,{"":o},``,o):o}}})))()}function Ae(e,t,n){if(O(t)){let r=t.resolve(e),i=n&&r&&n.get(r);return i?i.count*i.aliasCount:0}if(C(t)){let r=0;for(let i of t.items){let t=Ae(e,i,n);t>r&&(r=t)}return r}if(k(t)){let r=Ae(e,t.key,n),i=Ae(e,t.value,n);return Math.max(r,i)}return 1}var je;function Me(){return(Me=e((()=>{Ee(),be(),j(),ke(),L(),je=class extends Oe{constructor(e){super(ce),this.source=e,Object.defineProperty(this,"tag",{set(){throw Error(`Alias nodes cannot have tags`)}})}resolve(e,t){if(t?.maxAliasCount===0)throw ReferenceError(`Alias resolution is disabled`);let n;t?.aliasResolveCache?n=t.aliasResolveCache:(n=[],M(e,{Node:(e,t)=>{(O(t)||he(t))&&n.push(t)}}),t&&(t.aliasResolveCache=n));let r;for(let e of n){if(e===this)break;e.anchor===this.source&&(r=e)}if(r&&t){let{anchors:e,doc:n,maxAliasCount:i}=t,a=e.get(r);if(a||=(I(r,null,t),e.get(r)),a?.res===void 0)throw ReferenceError(`This should not happen: Alias anchor was not resolved?`);if(i>=0&&(a.count+=1,a.aliasCount===0&&(a.aliasCount=Ae(n,r,e)),a.count*a.aliasCount>i))throw ReferenceError(`Excessive alias count indicates a resource exhaustion attack`)}return r}toJSON(e,t){if(!t)return{source:this.source};let n=this.resolve(t.doc,t);if(!n){let e=`Unresolved alias (the anchor must be set before the alias): ${this.source}`;throw ReferenceError(e)}return t.anchors.get(n).res}toString(e,t,n){let r=`*${this.source}`;if(e){if(Te(this.source),e.options.verifyAliasOrder&&!e.anchors.has(this.source)){let e=`Unresolved alias (the anchor must be set before the alias): ${this.source}`;throw Error(e)}if(e.implicitKey)return`${r} `}return r}}})))()}var Ne,R;function z(){return(z=e((()=>{j(),ke(),L(),Ne=e=>!e||typeof e!=`function`&&typeof e!=`object`,R=class extends Oe{constructor(e){super(de),this.value=e}toJSON(e,t){return t?.keep?this.value:I(this.value,e,t)}toString(){return String(this.value)}},R.BLOCK_FOLDED=`BLOCK_FOLDED`,R.BLOCK_LITERAL=`BLOCK_LITERAL`,R.PLAIN=`PLAIN`,R.QUOTE_DOUBLE=`QUOTE_DOUBLE`,R.QUOTE_SINGLE=`QUOTE_SINGLE`})))()}function Pe(e,t,n){if(t){let e=n.filter(e=>e.tag===t),r=e.find(e=>!e.format)??e[0];if(!r)throw Error(`Tag ${t} not found`);return r}return n.find(t=>t.identify?.(e)&&!t.format)}function Fe(e,t,n){if(fe(e)&&(e=e.contents),w(e))return e;if(k(e)){let t=n.schema[T].createNode?.(n.schema,null,n);return t.items.push(e),t}(e instanceof String||e instanceof Number||e instanceof Boolean||typeof BigInt<`u`&&e instanceof BigInt)&&(e=e.valueOf());let{aliasDuplicateObjects:r,onAnchor:i,onTagObj:a,schema:o,sourceObjects:s}=n,c;if(r&&e&&typeof e==`object`){if(c=s.get(e),c)return c.anchor??(c.anchor=i(e)),new je(c.anchor);c={anchor:null,node:null},s.set(e,c)}t?.startsWith(`!!`)&&(t=Ie+t.slice(2));let l=Pe(e,t,o.tags);if(!l){if(e&&typeof e.toJSON==`function`&&(e=e.toJSON()),!e||typeof e!=`object`){let t=new R(e);return c&&(c.node=t),t}l=e instanceof Map?o[T]:Symbol.iterator in Object(e)?o[E]:o[T]}a&&(a(l),delete n.onTagObj);let u=l?.createNode?l.createNode(n.schema,e,n):typeof l?.nodeClass?.from==`function`?l.nodeClass.from(n.schema,e,n):new R(e);return t?u.tag=t:l.default||(u.tag=l.tag),c&&(c.node=u),u}var Ie;function Le(){return(Le=e((()=>{Me(),j(),z(),Ie=`tag:yaml.org,2002:`})))()}function Re(e,t,n){let r=n;for(let e=t.length-1;e>=0;--e){let n=t[e];if(typeof n==`number`&&Number.isInteger(n)&&n>=0){let e=[];e[n]=r,r=e}else r=new Map([[n,r]])}return Fe(r,void 0,{aliasDuplicateObjects:!1,keepUndefined:!1,onAnchor:()=>{throw Error(`This should not happen, please report a bug.`)},schema:e,sourceObjects:new Map})}var ze,Be;function Ve(){return(Ve=e((()=>{Le(),j(),ke(),ze=e=>e==null||typeof e==`object`&&!!e[Symbol.iterator]().next().done,Be=class extends Oe{constructor(e,t){super(e),Object.defineProperty(this,"schema",{value:t,configurable:!0,enumerable:!1,writable:!0})}clone(e){let t=Object.create(Object.getPrototypeOf(this),Object.getOwnPropertyDescriptors(this));return e&&(t.schema=e),t.items=t.items.map(t=>w(t)||k(t)?t.clone(e):t),this.range&&(t.range=this.range.slice()),t}addIn(e,t){if(ze(e))this.add(t);else{let[n,...r]=e,i=this.get(n,!0);if(C(i))i.addIn(r,t);else if(i===void 0&&this.schema)this.set(n,Re(this.schema,r,t));else throw Error(`Expected YAML collection at ${n}. Remaining path: ${r}`)}}deleteIn(e){let[t,...n]=e;if(n.length===0)return this.delete(t);let r=this.get(t,!0);if(C(r))return r.deleteIn(n);throw Error(`Expected YAML collection at ${t}. Remaining path: ${n}`)}getIn(e,t){let[n,...r]=e,i=this.get(n,!0);return r.length===0?!t&&A(i)?i.value:i:C(i)?i.getIn(r,t):void 0}hasAllNullValues(e){return this.items.every(t=>{if(!k(t))return!1;let n=t.value;return n==null||e&&A(n)&&n.value==null&&!n.commentBefore&&!n.comment&&!n.tag})}hasIn(e){let[t,...n]=e;if(n.length===0)return this.has(t);let r=this.get(t,!0);return C(r)?r.hasIn(n):!1}setIn(e,t){let[n,...r]=e;if(r.length===0)this.set(n,t);else{let e=this.get(n,!0);if(C(e))e.setIn(r,t);else if(e===void 0&&this.schema)this.set(n,Re(this.schema,r,t));else throw Error(`Expected YAML collection at ${n}. Remaining path: ${r}`)}}}})))()}function B(e,t){return/^\n+$/.test(e)?e.substring(1):t?e.replace(/^(?! *$)/gm,t):e}var He,V;function Ue(){return(Ue=e((()=>{He=e=>e.replace(/^(?!$)(?: $)?/gm,`#`),V=(e,t,n)=>e.endsWith(`
`)?B(n,t):n.includes(`
`)?`
`+B(n,t):(e.endsWith(` `)?``:` `)+n})))()}function We(e,t,n=`flow`,{indentAtStart:r,lineWidth:i=80,minContentWidth:a=20,onFold:o,onOverflow:s}={}){if(!i||i<0)return e;i<a&&(a=0);let c=Math.max(1+a,1+i-t.length);if(e.length<=c)return e;let l=[],u={},d=i-t.length;typeof r==`number`&&(r>i-Math.max(2,a)?l.push(0):d=i-r);let f,p,m=!1,h=-1,g=-1,_=-1;n===`block`&&(h=Ge(e,h,t.length),h!==-1&&(d=h+c));for(let r;r=e[h+=1];){if(n===`quoted`&&r===`\\`){switch(g=h,e[h+1]){case`x`:h+=3;break;case`u`:h+=5;break;case`U`:h+=9;break;default:h+=1}_=h}if(r===`
`)n===`block`&&(h=Ge(e,h,t.length)),d=h+t.length+c,f=void 0;else{if(r===` `&&p&&p!==` `&&p!==`
`&&p!==`	`){let t=e[h+1];t&&t!==` `&&t!==`
`&&t!==`	`&&(f=h)}if(h>=d){if(f)l.push(f),d=f+c,f=void 0;else if(n===`quoted`){for(;p===` `||p===`	`;)p=r,r=e[h+=1],m=!0;let t=h>_+1?h-2:g-1;if(u[t])return e;l.push(t),u[t]=!0,d=t+c,f=void 0}else m=!0}}p=r}if(m&&s&&s(),l.length===0)return e;o&&o();let v=e.slice(0,l[0]);for(let r=0;r<l.length;++r){let i=l[r],a=l[r+1]||e.length;i===0?v=`\n${t}${e.slice(0,a)}`:(n===`quoted`&&u[i]&&(v+=`${e[i]}\\`),v+=`\n${t}${e.slice(i+1,a)}`)}return v}function Ge(e,t,n){let r=t,i=t+1,a=e[i];for(;a===` `||a===`	`;)if(t<i+n)a=e[++t];else{do a=e[++t];while(a&&a!==`
`);r=t,i=t+1,a=e[i]}return r}var Ke,qe,Je;function Ye(){return(Ye=e((()=>{Ke=`flow`,qe=`block`,Je=`quoted`})))()}function Xe(e,t,n){if(!t||t<0)return!1;let r=t-n,i=e.length;if(i<=r)return!1;for(let t=0,n=0;t<i;++t)if(e[t]===`
`){if(t-n>r)return!0;if(n=t+1,i-n<=r)return!1}return!0}function Ze(e,t){let n=JSON.stringify(e);if(t.options.doubleQuotedAsJSON)return n;let{implicitKey:r}=t,i=t.options.doubleQuotedMinMultiLineLength,a=t.indent||(rt(e)?`  `:``),o=``,s=0;for(let e=0,t=n[e];t;t=n[++e])if(t===` `&&n[e+1]===`\\`&&n[e+2]===`n`&&(o+=n.slice(s,e)+`\\ `,e+=1,s=e,t=`\\`),t===`\\`)switch(n[e+1]){case`u`:{o+=n.slice(s,e);let t=n.substr(e+2,4);switch(t){case`0000`:o+=`\\0`;break;case`0007`:o+=`\\a`;break;case`000b`:o+=`\\v`;break;case`001b`:o+=`\\e`;break;case`0085`:o+=`\\N`;break;case`00a0`:o+=`\\_`;break;case`2028`:o+=`\\L`;break;case`2029`:o+=`\\P`;break;default:t.substr(0,2)===`00`?o+=`\\x`+t.substr(2):o+=n.substr(e,6)}e+=5,s=e+1}break;case`n`:if(r||n[e+2]===`"`||n.length<i)e+=1;else{for(o+=n.slice(s,e)+`

`;n[e+2]===`\\`&&n[e+3]===`n`&&n[e+4]!==`"`;)o+=`
`,e+=2;o+=a,n[e+2]===` `&&(o+=`\\`),e+=1,s=e+1}break;default:e+=1}return o=s?o+n.slice(s):n,r?o:We(o,a,Je,nt(t,!1))}function Qe(e,t){if(t.options.singleQuote===!1||t.implicitKey&&e.includes(`
`)||/[ \t]\n|\n[ \t]/.test(e))return Ze(e,t);let n=t.indent||(rt(e)?`  `:``),r=`'`+e.replace(/'/g,`''`).replace(/\n+/g,`$&\n${n}`)+`'`;return t.implicitKey?r:We(r,n,Ke,nt(t,!1))}function H(e,t){let{singleQuote:n}=t.options,r;if(n===!1)r=Ze;else{let t=e.includes(`"`),i=e.includes(`'`);r=t&&!i?Qe:i&&!t?Ze:n?Qe:Ze}return r(e,t)}function $e({comment:e,type:t,value:n},r,i,a){let{blockQuote:o,commentString:s,lineWidth:c}=r.options;if(!o||/\n[\t ]+$/.test(n))return H(n,r);let l=r.indent||(r.forceBlockIndent||rt(n)?`  `:``),u=o===`literal`?!0:o===`folded`||t===R.BLOCK_FOLDED?!1:t===R.BLOCK_LITERAL||!Xe(n,c,l.length);if(!n)return u?`|
`:`>
`;let d,f;for(f=n.length;f>0;--f){let e=n[f-1];if(e!==`
`&&e!==`	`&&e!==` `)break}let p=n.substring(f),m=p.indexOf(`
`);m===-1?d=`-`:n===p||m!==p.length-1?(d=`+`,a&&a()):d=``,p&&=(n=n.slice(0,-p.length),p[p.length-1]===`
`&&(p=p.slice(0,-1)),p.replace(it,`$&${l}`));let h=!1,g,_=-1;for(g=0;g<n.length;++g){let e=n[g];if(e===` `)h=!0;else if(e===`
`)_=g;else break}let v=n.substring(0,_<g?_+1:g);v&&=(n=n.substring(v.length),v.replace(/\n+/g,`$&${l}`));let y=(h?l?`2`:`1`:``)+d;if(e&&(y+=` `+s(e.replace(/ ?[\r\n]+/g,` `)),i&&i()),!u){let e=n.replace(/\n+/g,`
$&`).replace(/(?:^|\n)([\t ].*)(?:([\n\t ]*)\n(?![\n\t ]))?/g,`$1$2`).replace(/\n+/g,`$&${l}`),i=!1,a=nt(r,!0);o!==`folded`&&t!==R.BLOCK_FOLDED&&(a.onOverflow=()=>{i=!0});let s=We(`${v}${e}${p}`,l,qe,a);if(!i)return`>${y}\n${l}${s}`}return n=n.replace(/\n+/g,`$&${l}`),`|${y}\n${l}${v}${n}${p}`}function et(e,t,n,r){let{type:i,value:a}=e,{actualString:o,implicitKey:s,indent:c,indentStep:l,inFlow:u}=t;if(s&&a.includes(`
`)||u&&/[[\]{},]/.test(a))return H(a,t);if(/^[\n\t ,[\]{}#&*!|>'"%@`]|^[?-]$|^[?-][ \t]|[\n:][ \t]|[ \t]\n|[\n\t ]#|[\n\t :]$/.test(a))return s||u||!a.includes(`
`)?H(a,t):$e(e,t,n,r);if(!s&&!u&&i!==R.PLAIN&&a.includes(`
`))return $e(e,t,n,r);if(rt(a)){if(c===``)return t.forceBlockIndent=!0,$e(e,t,n,r);if(s&&c===l)return H(a,t)}let d=a.replace(/\n+/g,`$&\n${c}`);if(o){let e=e=>e.default&&e.tag!==`tag:yaml.org,2002:str`&&e.test?.test(d),{compat:n,tags:r}=t.doc.schema;if(r.some(e)||n?.some(e))return H(a,t)}return s?d:We(d,c,Ke,nt(t,!1))}function tt(e,t,n,r){let{implicitKey:i,inFlow:a}=t,o=typeof e.value==`string`?e:Object.assign({},e,{value:String(e.value)}),{type:s}=e;s!==R.QUOTE_DOUBLE&&/[\x00-\x08\x0b-\x1f\x7f-\x9f\u{D800}-\u{DFFF}]/u.test(o.value)&&(s=R.QUOTE_DOUBLE);let c=e=>{switch(e){case R.BLOCK_FOLDED:case R.BLOCK_LITERAL:return i||a?H(o.value,t):$e(o,t,n,r);case R.QUOTE_DOUBLE:return Ze(o.value,t);case R.QUOTE_SINGLE:return Qe(o.value,t);case R.PLAIN:return et(o,t,n,r);default:return null}},l=c(s);if(l===null){let{defaultKeyType:e,defaultStringType:n}=t.options,r=i&&e||n;if(l=c(r),l===null)throw Error(`Unsupported default string type ${r}`)}return l}var nt,rt,it;function at(){return(at=e((()=>{z(),Ye(),nt=(e,t)=>({indentAtStart:t?e.indent.length:e.indentAtStart,lineWidth:e.options.lineWidth,minContentWidth:e.options.minContentWidth}),rt=e=>/^(%|---|\.\.\.)/m.test(e);try{it=RegExp(`(^|(?<!
))
+(?!
|$)`,`g`)}catch{it=/\n+(?!\n|$)/g}})))()}function ot(e,t){let n=Object.assign({blockQuote:!0,commentString:He,defaultKeyType:null,defaultStringType:`PLAIN`,directives:null,doubleQuotedAsJSON:!1,doubleQuotedMinMultiLineLength:40,falseStr:`false`,flowCollectionPadding:!0,indentSeq:!0,lineWidth:80,minContentWidth:20,nullStr:`null`,simpleKeys:!1,singleQuote:null,trailingComma:!1,trueStr:`true`,verifyAliasOrder:!0},e.schema.toStringOptions,t),r;switch(n.collectionStyle){case`block`:r=!1;break;case`flow`:r=!0;break;default:r=null}return{anchors:new Set,doc:e,flowCollectionPadding:n.flowCollectionPadding?` `:``,indent:``,indentStep:typeof n.indent==`number`?` `.repeat(n.indent):`  `,inFlow:r,options:n}}function st(e,t){if(t.tag){let n=e.filter(e=>e.tag===t.tag);if(n.length>0)return n.find(e=>e.format===t.format)??n[0]}let n,r;if(A(t)){r=t.value;let i=e.filter(e=>e.identify?.(r));if(i.length>1){let e=i.filter(e=>e.test);e.length>0&&(i=e)}n=i.find(e=>e.format===t.format)??i.find(e=>!e.format)}else r=t,n=e.find(e=>e.nodeClass&&r instanceof e.nodeClass);if(!n){let e=r?.constructor?.name??(r===null?`null`:typeof r);throw Error(`Tag not resolved for ${e} value`)}return n}function ct(e,t,{anchors:n,doc:r}){if(!r.directives)return``;let i=[],a=(A(e)||C(e))&&e.anchor;a&&Te(a)&&(n.add(a),i.push(`&${a}`));let o=e.tag??(t.default?null:t.tag);return o&&i.push(r.directives.tagString(o)),i.join(` `)}function lt(e,t,n,r){if(k(e))return e.toString(t,n,r);if(O(e)){if(t.doc.directives)return e.toString(t);if(t.resolvedAliases?.has(e))throw TypeError(`Cannot stringify circular structure without alias nodes`);t.resolvedAliases?t.resolvedAliases.add(e):t.resolvedAliases=new Set([e]),e=e.resolve(t.doc)}let i,a=w(e)?e:t.doc.createNode(e,{onTagObj:e=>i=e});i??=st(t.doc.schema.tags,a);let o=ct(a,i,t);o.length>0&&(t.indentAtStart=(t.indentAtStart??0)+o.length+1);let s=typeof i.stringify==`function`?i.stringify(a,t,n,r):A(a)?tt(a,t,n,r):a.toString(t,n,r);return o?A(a)||s[0]===`{`||s[0]===`[`?`${o} ${s}`:`${o}\n${t.indent}${s}`:s}function ut(){return(ut=e((()=>{Ee(),j(),Ue(),at()})))()}function dt({key:e,value:t},n,r,i){let{allNullValues:a,doc:o,indent:s,indentStep:c,options:{commentString:l,indentSeq:u,simpleKeys:d}}=n,f=w(e)&&e.comment||null;if(d){if(f)throw Error(`With simple keys, key nodes cannot have comments`);if(C(e)||!w(e)&&typeof e==`object`)throw Error(`With simple keys, collection cannot be used as a key value`)}let p=!d&&(!e||f&&t==null&&!n.inFlow||C(e)||(A(e)?e.type===R.BLOCK_FOLDED||e.type===R.BLOCK_LITERAL:typeof e==`object`));n=Object.assign({},n,{allNullValues:!1,implicitKey:!p&&(d||!a),indent:s+c});let m=!1,h=!1,g=lt(e,n,()=>m=!0,()=>h=!0);if(!p&&!n.inFlow&&g.length>1024){if(d)throw Error(`With simple keys, single line scalar must not span more than 1024 characters`);p=!0}if(n.inFlow){if(a||t==null)return m&&r&&r(),g===``?`?`:p?`? ${g}`:g}else if(a&&!d||t==null&&p)return g=`? ${g}`,f&&!m?g+=V(g,n.indent,l(f)):h&&i&&i(),g;m&&(f=null),p?(f&&(g+=V(g,n.indent,l(f))),g=`? ${g}\n${s}:`):(g=`${g}:`,f&&(g+=V(g,n.indent,l(f))));let _,v,y;w(t)?(_=!!t.spaceBefore,v=t.commentBefore,y=t.comment):(_=!1,v=null,y=null,t&&typeof t==`object`&&(t=o.createNode(t))),n.implicitKey=!1,!p&&!f&&A(t)&&(n.indentAtStart=g.length+1),h=!1,!u&&c.length>=2&&!n.inFlow&&!p&&me(t)&&!t.flow&&!t.tag&&!t.anchor&&(n.indent=n.indent.substring(2));let b=!1,x=lt(t,n,()=>b=!0,()=>h=!0),S=` `;if(f||_||v){if(S=_?`
`:``,v){let e=l(v);S+=`\n${B(e,n.indent)}`}x===``&&!n.inFlow?S===`
`&&y&&(S=`

`):S+=`\n${n.indent}`}else if(!p&&C(t)){let e=x[0],r=x.indexOf(`
`),i=r!==-1,a=n.inFlow??t.flow??t.items.length===0;if(i||!a){let t=!1;if(i&&(e===`&`||e===`!`)){let n=x.indexOf(` `);e===`&`&&n!==-1&&n<r&&x[n+1]===`!`&&(n=x.indexOf(` `,n+1)),(n===-1||r<n)&&(t=!0)}t||(S=`\n${n.indent}`)}}else(x===``||x[0]===`
`)&&(S=``);return g+=S+x,n.inFlow?b&&r&&r():y&&!b?g+=V(g,n.indent,l(y)):h&&i&&i(),g}function ft(){return(ft=e((()=>{j(),z(),ut(),Ue()})))()}function pt(e,t){(e===`debug`||e===`warn`)&&console.warn(t)}function mt(e,t,n){let r=gt(e,n);if(me(r))for(let n of r.items)ht(e,t,n);else if(Array.isArray(r))for(let n of r)ht(e,t,n);else ht(e,t,r)}function ht(e,t,n){let r=gt(e,n);if(!pe(r))throw Error(`Merge sources must be maps or map aliases`);let i=r.toJSON(null,e,Map);for(let[e,n]of i)t instanceof Map?t.has(e)||t.set(e,n):t instanceof Set?t.add(e):Object.prototype.hasOwnProperty.call(t,e)||Object.defineProperty(t,e,{value:n,writable:!0,enumerable:!0,configurable:!0});return t}function gt(e,t){return e&&O(t)?t.resolve(e.doc,e):t}var _t,vt,yt;function bt(){return(bt=e((()=>{j(),z(),_t=`<<`,vt={identify:e=>e===_t||typeof e==`symbol`&&e.description===_t,default:`key`,tag:`tag:yaml.org,2002:merge`,test:/^<<$/,resolve:()=>Object.assign(new R(Symbol(_t)),{addToJSMap:mt}),stringify:()=>_t},yt=(e,t)=>(vt.identify(t)||A(t)&&(!t.type||t.type===R.PLAIN)&&vt.identify(t.value))&&e?.doc.schema.tags.some(e=>e.tag===vt.tag&&e.default)})))()}function xt(e,t,{key:n,value:r}){if(w(n)&&n.addToJSMap)n.addToJSMap(e,t,r);else if(yt(e,n))mt(e,t,r);else{let i=I(n,``,e);if(t instanceof Map)t.set(i,I(r,i,e));else if(t instanceof Set)t.add(i);else{let a=St(n,i,e),o=I(r,a,e);a in t?Object.defineProperty(t,a,{value:o,writable:!0,enumerable:!0,configurable:!0}):t[a]=o}}return t}function St(e,t,n){if(t===null)return``;if(typeof t!=`object`)return String(t);if(w(e)&&n?.doc){let t=ot(n.doc,{});t.anchors=new Set;for(let e of n.anchors.keys())t.anchors.add(e.anchor);t.inFlow=!0,t.inStringifyKey=!0;let r=e.toString(t);if(!n.mapKeyWarned){let e=JSON.stringify(r);e.length>40&&(e=e.substring(0,36)+`..."`),pt(n.doc.options.logLevel,`Keys with collection values will be stringified due to JS Object restrictions: ${e}. Set mapAsMap: true to use object keys.`),n.mapKeyWarned=!0}return r}return JSON.stringify(t)}function Ct(){return(Ct=e((()=>{bt(),ut(),j(),L()})))()}function wt(e,t,n){let r=Fe(e,void 0,n),i=Fe(t,void 0,n);return new U(r,i)}var U;function W(){return(W=e((()=>{Le(),ft(),Ct(),j(),U=class e{constructor(e,t=null){Object.defineProperty(this,D,{value:ue}),this.key=e,this.value=t}clone(t){let{key:n,value:r}=this;return w(n)&&(n=n.clone(t)),w(r)&&(r=r.clone(t)),new e(n,r)}toJSON(e,t){return xt(t,t?.mapAsMap?new Map:{},this)}toString(e,t,n){return e?.doc?dt(this,e,t,n):JSON.stringify(this)}}})))()}function Tt(e,t,n){return(t.inFlow??e.flow?Dt:Et)(e,t,n)}function Et({comment:e,items:t},n,{blockItemPrefix:r,flowChars:i,itemIndent:a,onChompKeep:o,onComment:s}){let{indent:c,options:{commentString:l}}=n,u=Object.assign({},n,{indent:a,type:null}),d=!1,f=[];for(let e=0;e<t.length;++e){let i=t[e],o=null;if(w(i))!d&&i.spaceBefore&&f.push(``),Ot(n,f,i.commentBefore,d),i.comment&&(o=i.comment);else if(k(i)){let e=w(i.key)?i.key:null;e&&(!d&&e.spaceBefore&&f.push(``),Ot(n,f,e.commentBefore,d))}d=!1;let s=lt(i,u,()=>o=null,()=>d=!0);o&&(s+=V(s,a,l(o))),d&&o&&(d=!1),f.push(r+s)}let p;if(f.length===0)p=i.start+i.end;else{p=f[0];for(let e=1;e<f.length;++e){let t=f[e];p+=t?`\n${c}${t}`:`
`}}return e?(p+=`
`+B(l(e),c),s&&s()):d&&o&&o(),p}function Dt({items:e},t,{flowChars:n,itemIndent:r}){let{indent:i,indentStep:a,flowCollectionPadding:o,options:{commentString:s}}=t;r+=a;let c=Object.assign({},t,{indent:r,inFlow:!0,type:null}),l=!1,u=0,d=[];for(let n=0;n<e.length;++n){let i=e[n],a=null;if(w(i))i.spaceBefore&&d.push(``),Ot(t,d,i.commentBefore,!1),i.comment&&(a=i.comment);else if(k(i)){let e=w(i.key)?i.key:null;e&&(e.spaceBefore&&d.push(``),Ot(t,d,e.commentBefore,!1),e.comment&&(l=!0));let n=w(i.value)?i.value:null;n?(n.comment&&(a=n.comment),n.commentBefore&&(l=!0)):i.value==null&&e?.comment&&(a=e.comment)}a&&(l=!0);let o=lt(i,c,()=>a=null);l||=d.length>u||o.includes(`
`),n<e.length-1?o+=`,`:t.options.trailingComma&&(t.options.lineWidth>0&&(l||=d.reduce((e,t)=>e+t.length+2,2)+(o.length+2)>t.options.lineWidth),l&&(o+=`,`)),a&&(o+=V(o,r,s(a))),d.push(o),u=d.length}let{start:f,end:p}=n;if(d.length===0)return f+p;if(!l){let e=d.reduce((e,t)=>e+t.length+2,2);l=t.options.lineWidth>0&&e>t.options.lineWidth}if(l){let e=f;for(let t of d)e+=t?`\n${a}${i}${t}`:`
`;return`${e}\n${i}${p}`}return`${f}${o}${d.join(` `)}${o}${p}`}function Ot({indent:e,options:{commentString:t}},n,r,i){if(r&&i&&(r=r.replace(/^\n+/,``)),r){let i=B(t(r),e);n.push(i.trimStart())}}function kt(){return(kt=e((()=>{j(),ut(),Ue()})))()}function G(e,t){let n=A(t)?t.value:t;for(let r of e)if(k(r)&&(r.key===t||r.key===n||A(r.key)&&r.key.value===n))return r}var K;function q(){return(q=e((()=>{kt(),Ct(),Ve(),j(),W(),z(),K=class extends Be{static get tagName(){return`tag:yaml.org,2002:map`}constructor(e){super(T,e),this.items=[]}static from(e,t,n){let{keepUndefined:r,replacer:i}=n,a=new this(e),o=(e,o)=>{if(typeof i==`function`)o=i.call(t,e,o);else if(Array.isArray(i)&&!i.includes(e))return;(o!==void 0||r)&&a.items.push(wt(e,o,n))};if(t instanceof Map)for(let[e,n]of t)o(e,n);else if(t&&typeof t==`object`)for(let e of Object.keys(t))o(e,t[e]);return typeof e.sortMapEntries==`function`&&a.items.sort(e.sortMapEntries),a}add(e,t){let n;n=k(e)?e:!e||typeof e!=`object`||!(`key`in e)?new U(e,e?.value):new U(e.key,e.value);let r=G(this.items,n.key),i=this.schema?.sortMapEntries;if(r){if(!t)throw Error(`Key ${n.key} already set`);A(r.value)&&Ne(n.value)?r.value.value=n.value:r.value=n.value}else if(i){let e=this.items.findIndex(e=>i(n,e)<0);e===-1?this.items.push(n):this.items.splice(e,0,n)}else this.items.push(n)}delete(e){let t=G(this.items,e);return t?this.items.splice(this.items.indexOf(t),1).length>0:!1}get(e,t){let n=G(this.items,e)?.value;return(!t&&A(n)?n.value:n)??void 0}has(e){return!!G(this.items,e)}set(e,t){this.add(new U(e,t),!0)}toJSON(e,t,n){let r=n?new n:t?.mapAsMap?new Map:{};t?.onCreate&&t.onCreate(r);for(let e of this.items)xt(t,r,e);return r}toString(e,t,n){if(!e)return JSON.stringify(this);for(let e of this.items)if(!k(e))throw Error(`Map items must all be pairs; found ${JSON.stringify(e)} instead`);return!e.allNullValues&&this.hasAllNullValues(!1)&&(e=Object.assign({},e,{allNullValues:!0})),Tt(this,e,{blockItemPrefix:``,flowChars:{start:`{`,end:`}`},itemIndent:e.indent||``,onChompKeep:n,onComment:t})}}})))()}var At;function J(){return(J=e((()=>{j(),q(),At={collection:`map`,default:!0,nodeClass:K,tag:`tag:yaml.org,2002:map`,resolve(e,t){return pe(e)||t(`Expected a mapping for this tag`),e},createNode:(e,t,n)=>K.from(e,t,n)}})))()}function jt(e){let t=A(e)?e.value:e;return t&&typeof t==`string`&&(t=Number(t)),typeof t==`number`&&Number.isInteger(t)&&t>=0?t:null}var Y;function X(){return(X=e((()=>{Le(),kt(),Ve(),j(),z(),L(),Y=class extends Be{static get tagName(){return`tag:yaml.org,2002:seq`}constructor(e){super(E,e),this.items=[]}add(e){this.items.push(e)}delete(e){let t=jt(e);return typeof t==`number`&&this.items.splice(t,1).length>0}get(e,t){let n=jt(e);if(typeof n!=`number`)return;let r=this.items[n];return!t&&A(r)?r.value:r}has(e){let t=jt(e);return typeof t==`number`&&t<this.items.length}set(e,t){let n=jt(e);if(typeof n!=`number`)throw Error(`Expected a valid index, not ${e}.`);let r=this.items[n];A(r)&&Ne(t)?r.value=t:this.items[n]=t}toJSON(e,t){let n=[];t?.onCreate&&t.onCreate(n);let r=0;for(let e of this.items)n.push(I(e,String(r++),t));return n}toString(e,t,n){return e?Tt(this,e,{blockItemPrefix:`- `,flowChars:{start:`[`,end:`]`},itemIndent:(e.indent||``)+`  `,onChompKeep:n,onComment:t}):JSON.stringify(this)}static from(e,t,n){let{replacer:r}=n,i=new this(e);if(t&&Symbol.iterator in Object(t)){let e=0;for(let a of t){if(typeof r==`function`){let n=t instanceof Set?a:String(e++);a=r.call(t,n,a)}i.items.push(Fe(a,void 0,n))}}return i}}})))()}var Mt;function Z(){return(Z=e((()=>{j(),X(),Mt={collection:`seq`,default:!0,nodeClass:Y,tag:`tag:yaml.org,2002:seq`,resolve(e,t){return me(e)||t(`Expected a sequence for this tag`),e},createNode:(e,t,n)=>Y.from(e,t,n)}})))()}function Nt(){return(Nt=e((()=>{at()})))()}function Pt(){return(Pt=e((()=>{z()})))()}function Ft(){return(Ft=e((()=>{z()})))()}function It(){return(It=e((()=>{z()})))()}function Lt(){return(Lt=e((()=>{J(),Pt(),Z(),Nt(),Ft(),It()})))()}function Rt(e){return typeof e==`bigint`||Number.isInteger(e)}var zt,Bt;function Vt(){return(Vt=e((()=>{z(),J(),Z(),zt=({value:e})=>JSON.stringify(e),Bt=[{identify:e=>typeof e==`string`,default:!0,tag:`tag:yaml.org,2002:str`,resolve:e=>e,stringify:zt},{identify:e=>e==null,createNode:()=>new R(null),default:!0,tag:`tag:yaml.org,2002:null`,test:/^null$/,resolve:()=>null,stringify:zt},{identify:e=>typeof e==`boolean`,default:!0,tag:`tag:yaml.org,2002:bool`,test:/^true$|^false$/,resolve:e=>e===`true`,stringify:zt},{identify:Rt,default:!0,tag:`tag:yaml.org,2002:int`,test:/^-?(?:0|[1-9][0-9]*)$/,resolve:(e,t,{intAsBigInt:n})=>n?BigInt(e):parseInt(e,10),stringify:({value:e})=>Rt(e)?e.toString():JSON.stringify(e)},{identify:e=>typeof e==`number`,default:!0,tag:`tag:yaml.org,2002:float`,test:/^-?(?:0|[1-9][0-9]*)(?:\.[0-9]*)?(?:[eE][-+]?[0-9]+)?$/,resolve:e=>parseFloat(e),stringify:zt}],[At,Mt].concat(Bt,{default:!0,tag:``,test:/^/,resolve(e,t){return t(`Unresolved plain scalar ${JSON.stringify(e)}`),e}})})))()}function Ht(){return(Ht=e((()=>{z(),at()})))()}function Ut(e,t,n){let{replacer:r}=n,i=new Y(e);i.tag=`tag:yaml.org,2002:pairs`;let a=0;if(t&&Symbol.iterator in Object(t))for(let e of t){typeof r==`function`&&(e=r.call(t,String(a++),e));let o,s;if(Array.isArray(e)){if(e.length===2)o=e[0],s=e[1];else throw TypeError(`Expected [key, value] tuple: ${e}`)}else if(e&&e instanceof Object){let t=Object.keys(e);if(t.length===1)o=t[0],s=e[o];else throw TypeError(`Expected tuple with one key, not ${t.length} keys`)}else o=e;i.items.push(wt(o,s,n))}return i}function Wt(){return(Wt=e((()=>{W(),z(),X()})))()}var Gt;function Kt(){return(Kt=e((()=>{j(),L(),q(),X(),Wt(),Gt=class e extends Y{constructor(){super(),this.add=K.prototype.add.bind(this),this.delete=K.prototype.delete.bind(this),this.get=K.prototype.get.bind(this),this.has=K.prototype.has.bind(this),this.set=K.prototype.set.bind(this),this.tag=e.tag}toJSON(e,t){if(!t)return super.toJSON(e);let n=new Map;t?.onCreate&&t.onCreate(n);for(let e of this.items){let r,i;if(k(e)?(r=I(e.key,``,t),i=I(e.value,r,t)):r=I(e,``,t),n.has(r))throw Error(`Ordered maps must not include duplicate keys`);n.set(r,i)}return n}static from(e,t,n){let r=Ut(e,t,n),i=new this;return i.items=r.items,i}},Gt.tag=`tag:yaml.org,2002:omap`})))()}function qt(){return(qt=e((()=>{z()})))()}function Jt(){return(Jt=e((()=>{z()})))()}var Yt;function Xt(){return(Xt=e((()=>{j(),W(),q(),Yt=class e extends K{constructor(t){super(t),this.tag=e.tag}add(e){let t;t=k(e)?e:e&&typeof e==`object`&&`key`in e&&`value`in e&&e.value===null?new U(e.key,null):new U(e,null),G(this.items,t.key)||this.items.push(t)}get(e,t){let n=G(this.items,e);return!t&&k(n)?A(n.key)?n.key.value:n.key:n}set(e,t){if(typeof t!=`boolean`)throw Error(`Expected boolean value for set(key, value) in a YAML set, not ${typeof t}`);let n=G(this.items,e);n&&!t?this.items.splice(this.items.indexOf(n),1):!n&&t&&this.items.push(new U(e))}toJSON(e,t){return super.toJSON(e,t,Set)}toString(e,t,n){if(!e)return JSON.stringify(this);if(this.hasAllNullValues(!0))return super.toString(Object.assign({},e,{allNullValues:!0}),t,n);throw Error(`Set items must all have null values`)}static from(e,t,n){let{replacer:r}=n,i=new this(e);if(t&&Symbol.iterator in Object(t))for(let e of t)typeof r==`function`&&(e=r.call(t,e,e)),i.items.push(wt(e,null,n));return i}},Yt.tag=`tag:yaml.org,2002:set`})))()}function Zt(){return(Zt=e((()=>{J(),Pt(),Z(),Nt(),Ht(),qt(),Jt(),bt(),Kt(),Wt(),Xt()})))()}function Qt(){return(Qt=e((()=>{J(),Pt(),Z(),Nt(),Ft(),It(),Lt(),Vt(),Ht(),bt(),Kt(),Wt(),Zt(),Xt()})))()}function $t(){return($t=e((()=>{J(),Z(),Nt(),Qt()})))()}function en(){return(en=e((()=>{ut()})))()}function tn(){return(tn=e((()=>{Me(),Ve(),W(),$t(),en(),Ee(),Le(),we()})))()}function nn(){return(nn=e((()=>{W(),q()})))()}function rn(){return(rn=e((()=>{X()})))()}function an(){return(an=e((()=>{W(),q(),X()})))()}function on(){return(on=e((()=>{z(),q(),X(),nn(),rn(),an()})))()}function sn(){return(sn=e((()=>{z()})))()}function cn(){return(cn=e((()=>{z()})))()}function ln(){return(ln=e((()=>{z(),sn(),cn()})))()}function un(){return(un=e((()=>{Me(),on(),ln()})))()}function dn(){return(dn=e((()=>{tn(),un()})))()}function fn(){return(fn=e((()=>{we(),tn(),dn()})))()}function pn(){return(pn=e((()=>{sn(),cn(),at()})))()}function Q(e,t){`type`in e&&e.type===`document`&&(e={start:e.start,value:e.value}),mn(Object.freeze([]),e,t)}function mn(e,t,n){let r=n(t,e);if(typeof r==`symbol`)return r;for(let i of[`key`,`value`]){let a=t[i];if(a&&`items`in a){for(let t=0;t<a.items.length;++t){let r=mn(Object.freeze(e.concat([[i,t]])),a.items[t],n);if(typeof r==`number`)t=r-1;else if(r===hn)return hn;else r===_n&&(a.items.splice(t,1),--t)}typeof r==`function`&&i===`key`&&(r=r(t,e))}}return typeof r==`function`?r(t,e):r}var hn,gn,_n;function vn(){return(vn=e((()=>{hn=Symbol(`break visit`),gn=Symbol(`skip children`),_n=Symbol(`remove item`),Q.BREAK=hn,Q.SKIP=gn,Q.REMOVE=_n,Q.itemAtPath=(e,t)=>{let n=e;for(let[e,r]of t){let t=n?.[e];if(t&&`items`in t)n=t.items[r];else return}return n},Q.parentCollection=(e,t)=>{let n=Q.itemAtPath(e,t.slice(0,-1)),r=t[t.length-1][0],i=n?.[r];if(i&&`items`in i)return i;throw Error(`Parent collection not found`)}})))()}function yn(){return(yn=e((()=>{pn(),vn()})))()}function bn(){return(bn=e((()=>{yn()})))()}function xn(){return(xn=e((()=>{yn(),bn()})))()}function Sn(){return(Sn=e((()=>{fn(),tn(),xn()})))()}function Cn(){return(Cn=e((()=>{fn(),tn(),$t(),Me(),W(),z(),q(),X(),yn(),bn(),xn(),Sn(),be()})))()}function wn(){return(wn=e((()=>{Cn()})))()}function Tn(e){return e.replace(/^\uFEFF/,``).replace(/\r\n/g,`
`).replace(/\r/g,`
`)}function En(e){let t=kn.exec(e);if(!t)return;let n=t[0].length,r=e.slice(n),i=On.exec(r);if(i)return{block:r.slice(0,i.index),body:r.slice(i.index+i[0].length)}}function Dn(e){let t=Tn(e);return(En(t)?.body??t).trim()}var On,kn;function An(){return(An=e((()=>{wn(),On=/(?:^|\n)---[^\S\n]*(?:\n|(?![\s\S]))/,kn=/^---[^\S\n]*\n/})))()}var jn;function Mn(){return(Mn=e((()=>{p(),jn=h`
  :host {
    display: contents;
  }

  .modal {
    width: 100%;
    height: min(780px, 86vh);
    background: var(--bg);
    border: 1px solid var(--border-strong);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-xl);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .head {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 20px;
    border-bottom: 1px solid var(--border);
    background: var(--bg);
  }

  .heading {
    flex: 1;
    min-width: 0;
    margin: 0;
    font-size: 16px;
    overflow-wrap: anywhere;
  }
  .close-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 auto;
    width: 32px;
    height: 32px;
    padding: 0;
    color: var(--muted);
    background: transparent;
    border: none;
    border-radius: var(--radius-md);
    cursor: var(--cursor-action);
  }
  .close-button:hover {
    color: var(--text-strong);
    background: var(--bg-elevated);
  }
  .close-button:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }
  .close-button svg {
    width: 18px;
    height: 18px;
  }
  .body.tree {
    grid-template-columns: minmax(180px, 260px) minmax(0, 1fr);
  }
  .tree .item {
    grid-template-columns: 16px minmax(0, 1fr);
  }
  .folder > summary {
    display: flex;
    gap: 8px;
    align-items: center;
    padding: 9px 10px;
    color: var(--muted);
    font-size: 12px;
  }
  .folder > summary svg {
    width: 16px;
    height: 16px;
  }
  .folder > div {
    padding-left: 12px;
  }
  .folder .item {
    width: 100%;
    padding: 9px 10px;
    gap: 8px;
  }
  .notice {
    margin: 0;
    padding: 12px 20px;
    color: var(--muted);
    border-bottom: 1px solid var(--border);
  }
  .markdown {
    font-size: 14px;
    line-height: 1.65;
    overflow-wrap: anywhere;
  }
  .markdown > :first-child {
    margin-top: 0;
  }
  .markdown h1 {
    font-size: 24px;
  }
  .markdown h2 {
    font-size: 20px;
  }
  .markdown h3 {
    font-size: 16px;
  }
  .markdown pre {
    white-space: pre-wrap;
    overflow-wrap: anywhere;
    background: var(--bg-elevated);
    padding: 12px;
    border-radius: var(--radius-md);
  }
  .markdown code {
    font-family: var(--mono);
  }
  .markdown a {
    color: var(--accent);
  }
  .markdown table {
    display: block;
    overflow: auto;
    max-width: 100%;
  }
  .markdown th,
  .markdown td {
    padding: 8px;
    border: 1px solid var(--border);
  }
  .search-icon {
    color: var(--muted);
    font-size: 18px;
  }

  .search {
    flex: 1;
    min-width: 0;
    background: transparent;
    border: none;
    outline: none;
    color: var(--text-strong);
    font: inherit;
    font-size: 18px;
    font-weight: 400;
    padding: 4px 0;
  }

  .search:focus,
  .search:focus-visible {
    outline: none;
    border: none;
    box-shadow: none;
  }

  .search::placeholder {
    color: var(--muted);
  }

  .state {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: var(--muted);
    padding: 5px 10px;
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    background: var(--bg-elevated);
  }

  .body {
    flex: 1;
    display: grid;
    grid-template-columns: 360px minmax(0, 1fr);
    min-height: 0;
  }

  .list {
    border-right: 1px solid var(--border);
    padding: 14px 10px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .list-section {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--muted);
    padding: 4px 12px 8px;
  }

  .item {
    display: grid;
    grid-template-columns: 16px 1fr auto;
    gap: 12px;
    align-items: center;
    padding: 12px 14px;
    border-radius: var(--radius-md);
    border: none;
    background: transparent;
    color: var(--text);
    font: inherit;
    outline: none;
    text-align: left;
  }

  .item:focus-visible {
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--accent) 55%, transparent);
  }

  .item:hover {
    background: var(--bg-elevated);
  }

  .item.is-active {
    background: var(--accent-subtle);
  }

  .item.is-active .item-name {
    color: var(--text-strong);
  }

  .item-icon {
    width: 16px;
    height: 16px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--muted);
    opacity: 0.85;
  }

  .item.is-active .item-icon {
    color: var(--accent);
    opacity: 1;
  }

  .item-icon svg,
  .chat-copy-btn svg {
    width: 16px;
    height: 16px;
    stroke: currentColor;
    fill: none;
    stroke-width: 1.5px;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .item-name {
    font-family: var(--mono);
    font-size: 14px;
    color: var(--text);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .item-meta {
    color: var(--muted);
    font-size: 12px;
  }

  .empty-list {
    color: var(--muted);
    font-size: 13px;
    padding: 12px;
  }

  .detail {
    display: flex;
    flex-direction: column;
    min-width: 0;
    min-height: 0;
  }

  .detail.empty {
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 24px;
  }

  .detail-head {
    padding: 20px 24px 14px;
    border-bottom: 1px solid var(--border);
  }

  .detail-title-row {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 10px;
  }

  .title {
    flex: 1;
    min-width: 0;
    margin: 0;
    font-family: var(--mono);
    font-size: 22px;
    color: var(--text-strong);
    font-weight: 700;
    letter-spacing: -0.01em;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .chat-copy-btn {
    width: 32px;
    height: 32px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 auto;
    padding: 0;
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    background: var(--bg-elevated);
    color: var(--muted);
  }

  .chat-copy-btn:hover {
    border-color: var(--border-strong);
    color: var(--text-strong);
  }

  .chat-copy-btn:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }

  .chat-copy-btn__icon {
    display: inline-flex;
    width: 16px;
    height: 16px;
    position: relative;
  }

  .chat-copy-btn__icon-copy,
  .chat-copy-btn__icon-check {
    position: absolute;
    inset: 0;
    transition: opacity 150ms ease;
  }

  .chat-copy-btn__icon-check,
  .chat-copy-btn[data-copy-state="copied"] .chat-copy-btn__icon-copy {
    opacity: 0;
  }

  .chat-copy-btn[data-copy-state="copied"] .chat-copy-btn__icon-check {
    opacity: 1;
  }

  .chat-copy-btn[data-copy-state="copying"] {
    opacity: 0;
    pointer-events: none;
  }

  .chat-copy-btn[data-copy-state="error"] {
    border-color: var(--danger-subtle);
    background: var(--danger-subtle);
    color: var(--danger);
  }

  .chat-copy-btn[data-copy-state="copied"] {
    border-color: var(--ok-subtle);
    background: var(--ok-subtle);
    color: var(--ok);
  }

  .chips {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }

  .chip {
    display: inline-flex;
    align-items: center;
    padding: 3px 10px;
    border-radius: 999px;
    font-size: 11.5px;
    background: var(--bg-elevated);
    border: 1px solid var(--border);
    color: var(--muted);
  }

  .chip.accent {
    background: var(--accent-subtle);
    border-color: color-mix(in srgb, var(--accent) 30%, transparent);
    color: var(--accent);
  }

  .chip.ok {
    background: color-mix(in srgb, var(--ok) 12%, transparent);
    border-color: color-mix(in srgb, var(--ok) 30%, transparent);
    color: var(--ok);
  }

  .detail-body {
    flex: 1;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 20px 24px 24px;
  }

  .code-content {
    min-width: 0;
  }

  .code-chunk {
    margin: 0;
    min-width: 0;
    font-family: var(--mono);
    font-size: 13px;
    line-height: 1.7;
    color: var(--text);
    white-space: pre-wrap;
    word-break: break-word;
    content-visibility: auto;
    contain-intrinsic-block-size: auto 1414px;
  }

  .foot {
    display: flex;
    align-items: center;
    gap: 18px;
    padding: 12px 20px;
    border-top: 1px solid var(--border);
    background: var(--bg);
    font-size: 12px;
    color: var(--muted);
  }

  .foot-group {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .kbd {
    font-family: var(--mono);
    font-size: 10.5px;
    padding: 2px 6px;
    border: 1px solid var(--border);
    border-radius: 4px;
    background: var(--bg-elevated);
    color: var(--text);
  }

  .spacer {
    flex: 1;
  }

  .button {
    height: 36px;
    padding: 0 14px;
    border-radius: var(--radius-md);
    border: 1px solid var(--border);
    background: var(--bg-elevated);
    color: var(--text);
    font-weight: 600;
  }

  .button:hover {
    border-color: var(--border-strong);
    color: var(--text-strong);
  }

  .empty-title {
    font-size: 16px;
    font-weight: 600;
    color: var(--text-strong);
    margin: 0 0 8px;
  }

  .empty-subtitle {
    margin: 0;
    font-size: 13px;
    color: var(--muted);
    max-width: 380px;
  }

  @media (max-width: 640px) {
    .head {
      padding: 12px;
    }

    .body,
    .body.tree {
      grid-template-columns: minmax(0, 1fr);
      grid-template-rows: minmax(0, min(180px, 30dvh)) minmax(0, 1fr);
    }

    .list {
      min-width: 0;
      border-right: 0;
      border-bottom: 1px solid var(--border);
      padding: 10px 8px;
    }

    .item {
      min-width: 0;
    }

    .foot {
      gap: 8px;
      padding: 10px 12px;
    }
  }
`})))()}function Nn(e){let t=e.split(`
`),n=[];for(let e=0;e<t.length;e+=Fn)n.push(t.slice(e,e+Fn).join(`
`));return n}function Pn(e){let t=e.split(`.`).pop()?.toLowerCase()??``,n={md:`Markdown`,txt:r(`filePreview.kind.text`),json:`JSON`,yaml:`YAML`,yml:`YAML`,ts:`TypeScript`,js:`JavaScript`,py:`Python`,sh:r(`filePreview.kind.shell`)};return Object.hasOwn(n,t)?n[t]:t?t.toUpperCase():r(`filePreview.kind.file`)}var $,Fn,In;function Ln(){return(Ln=e((()=>{p(),g(),v(),An(),t(),ae(),n(),te(),S(),Mn(),d(),l(),s(),re(),se(),o(),ie(),$=class extends i{constructor(...e){super(...e),this.files=[],this.activePath=``,this.query=``,this.label=``,this.listLabel=``,this.searchPlaceholder=``,this.contextLabel=``,this.readOnlyLabel=``,this.emptyTitle=``,this.emptySubtitle=``,this.copyLabel=``,this.layout=`files`,this.directories=[],this.loading=!1,this.fileLoading=!1,this.error=``,this.notice=``,this.filteredFiles=[],this.derivedInputsReady=!1,this.codeChunks=[],this.resetScrollAfterUpdate=!0,this.focusAfterUpdate=!1,this.handleDocumentLink=e=>{let t=e.target.closest(`a[href]`)?.getAttribute(`href`);if(!t||/^[a-z][a-z0-9+.-]*:|^\/\//iu.test(t))return;e.preventDefault();let n=new URL(this.activeFile?.path??`SKILL.md`,`https://skill.invalid/`),r=new URL(t,n),i;try{i=decodeURIComponent(r.pathname.slice(1))}catch{return}let a=this.files.find(e=>e.path===i);a&&this.emitSelect(a.path)},this.handleQueryInput=e=>{let t=e.target.value??``;this.dispatchEvent(new CustomEvent(`file-preview-query-change`,{bubbles:!0,composed:!0,detail:t}))},this.preventItemPointerFocus=e=>{this.layout===`files`&&e.preventDefault()},this.handleKeydown=e=>{switch(e.key){case`Escape`:e.preventDefault(),e.stopPropagation(),this.emitClose();return;case`ArrowDown`:this.moveSelection(1,e);return;case`ArrowUp`:this.moveSelection(-1,e)}},this.emitClose=()=>{this.dispatchEvent(new CustomEvent(`file-preview-close`,{bubbles:!0,composed:!0}))}}static{this.styles=[jn,a]}willUpdate(e){if(!(!this.derivedInputsReady||e.has(`activePath`)||e.has(`query`)||e.has(`files`)||e.has(`layout`)))return;this.derivedInputsReady=!0,this.filteredFiles=this.filterFiles();let t=this.resolveActiveFile(this.filteredFiles);this.resetScrollAfterUpdate||=e.has(`layout`)||e.has(`query`)||this.activeFile?.path!==t?.path||this.activeFile?.contents!==t?.contents||this.activeFile?.message!==t?.message,this.activeFile=t;let n=t?.contents;n!==this.codeSource&&(this.codeSource=n,this.codeChunks=n===void 0?[]:Nn(n))}render(){let e=this.filteredFiles,t=this.activeFile,n=e.length===this.files.length?r(`filePreview.fileCount`,{count:String(this.files.length)}):r(`filePreview.filteredFileCount`,{count:String(e.length),total:String(this.files.length)}),i=this.label||r(`filePreview.label`),a=this.listLabel||r(`filePreview.listLabel`),o=this.searchPlaceholder||r(`filePreview.searchPlaceholder`);return f`
      <openclaw-modal-dialog
        label=${i}
        style="--openclaw-modal-width: min(1100px, 92vw); --openclaw-modal-max-height: 86vh;"
        @modal-cancel=${this.emitClose}
        @keydown=${this.handleKeydown}
      >
        <div class="modal">
          <header class="head">
            ${this.layout===`document`?f`<h1 class="heading">${i}</h1>
                    <button
                      class="close-button"
                      type="button"
                      aria-label=${r(`common.close`)}
                      @click=${this.emitClose}
                    >
                      ${u.x}
                    </button>`:f`<span class="search-icon">⌕</span
                    ><input
                      class="search"
                      placeholder=${o}
                      .value=${this.query}
                      @input=${this.handleQueryInput}
                    /><span class="state">${n}</span>`}
          </header>
          ${this.notice?f`<p class="notice" role="status">${this.notice}</p>`:``}
          <div
            class="body ${this.layout===`document`?`tree`:``}"
            aria-busy=${this.loading||this.fileLoading}
          >
            <aside class="list">
              ${this.layout===`files`?f`<div class="list-section">${a} · ${e.length}</div>`:``}
              ${this.loading&&!this.error?oe(`file-list`,r(`common.loading`),!0):e.length===0?this.error?``:f`<div class="empty-list">${r(`filePreview.noMatches`)}</div>`:this.layout===`document`?this.renderFolder(``):e.map(e=>this.renderItem(e))}
            </aside>
            ${this.error?f`<section class="detail empty">
                    <p role="alert">${this.error}</p>
                    <button
                      class="button"
                      @click=${()=>this.dispatchEvent(new CustomEvent(`file-preview-retry`,{bubbles:!0,composed:!0}))}
                    >
                      ${r(`common.retry`)}
                    </button>
                  </section>`:this.loading||this.fileLoading?f`<section class="detail">
                      <div class="detail-body">
                        ${oe(`document`,r(`common.loading`),!0)}
                      </div>
                    </section>`:t?this.renderFile(t):this.renderEmpty()}
          </div>
          ${this.layout===`files`?f`<footer class="foot">
                  <span class="foot-group"
                    >${c([`↑`,`↓`],{className:`kbd`})}
                    ${r(`filePreview.navigate`)}</span
                  >
                  <span class="spacer"></span>
                  <button class="button" @click=${this.emitClose}>
                    ${r(`common.close`)} ${c(`esc`,{className:`kbd`})}
                  </button>
                </footer>`:``}
        </div>
      </openclaw-modal-dialog>
    `}renderItem(e){return f`<button
      class="item ${e.path===this.activeFile?.path?`is-active`:``}"
      data-path=${e.path}
      aria-current=${e.path===this.activeFile?.path?`true`:`false`}
      @pointerdown=${this.preventItemPointerFocus}
      @mousedown=${this.preventItemPointerFocus}
      @click=${()=>this.emitSelect(e.path)}
    >
      <span class="item-icon">${In[x(e.path)]}</span
      ><span class="item-name" title=${e.path}
        >${this.layout===`document`?e.path.split(`/`).pop():e.path}</span
      >${this.layout===`files`?f`<span class="item-meta">${e.size}</span>`:``}
    </button>`}renderFolder(e){let t=this.filteredFiles.filter(t=>t.path.startsWith(e)),n=t.filter(t=>!t.path.slice(e.length).includes(`/`)),r=new Set([...t.map(e=>e.path),...this.directories.map(e=>`${e}/`)].filter(t=>t.startsWith(e)&&t.slice(e.length).includes(`/`)).map(t=>t.slice(e.length).split(`/`)[0]));return f`${n.map(e=>this.renderItem(e))}${[...r].toSorted().map(t=>f`<details class="folder" open>
          <summary>${u.folder}<span>${t}</span></summary>
          <div>${this.renderFolder(`${e}${t}/`)}</div>
        </details>`)}`}renderFile(e){return f`
      <section class="detail">
        ${this.layout===`files`?f`<div class="detail-head">
                <div class="detail-title-row">
                  <h2 class="title">${e.path}</h2>
                  ${e.contents?ne(e.contents,this.copyLabel||r(`filePreview.copyFile`)):``}
                </div>
                <div class="chips">
                  <span class="chip accent">${Pn(e.path)}</span>
                  <span class="chip">${e.size}</span>
                  <span class="chip">${this.readOnlyLabel||r(`filePreview.readOnly`)}</span>
                  ${this.contextLabel?f`<span class="chip ok">${this.contextLabel}</span>`:``}
                </div>
              </div>`:``}
        <div class="detail-body">
          ${e.message?f`<p role="status">${e.message}</p>`:this.layout===`document`&&/\.md$/iu.test(e.path)?f`<article class="markdown" @click=${this.handleDocumentLink}>${_(ee(Dn(e.contents),{mode:`document`,remoteImages:!1,codeBlockChrome:`none`,fileLinks:!1}))}</article>`:f`<div class="code-content">${this.codeChunks.map((e,t)=>f`<pre class="code-chunk" data-chunk=${t}>${e}</pre>`)}</div>`}
        </div>
      </section>
    `}renderEmpty(){return f`
      <section class="detail empty">
        <p class="empty-title">${this.emptyTitle||r(`filePreview.emptyTitle`)}</p>
        <p class="empty-subtitle">${this.emptySubtitle||r(`filePreview.emptySubtitle`)}</p>
      </section>
    `}filterFiles(){let e=this.layout===`files`?this.query.trim().toLowerCase():``;return e?this.files.filter(t=>`${t.path}\n${t.contents}`.toLowerCase().includes(e)):this.files}resolveActiveFile(e){return e.find(e=>e.path===this.activePath)??e[0]}connectedCallback(){super.connectedCallback(),this.resetScrollAfterUpdate=!0,this.focusAfterUpdate=!0,this.requestUpdate()}updated(e){if(this.resetScrollAfterUpdate){this.resetScrollAfterUpdate=!1;let e=this.detailBody;e&&(e.scrollTop=0,e.scrollLeft=0)}(e.has(`activePath`)||e.has(`query`)||e.has(`files`))&&(this.scrollActiveFileIntoView(),this.layout===`document`&&e.has(`activePath`)&&this.focusModal()),this.focusAfterUpdate&&this.isConnected&&(this.focusAfterUpdate=!1,this.focusModal())}focusModal(){(this.searchInput??this.shadowRoot?.querySelector(`.item.is-active, .button`)??this.shadowRoot?.querySelector(`.close-button`))?.focus({preventScroll:!0})}moveSelection(e,t){t.preventDefault(),t.stopPropagation();let n=this.layout===`document`?[...this.shadowRoot?.querySelectorAll(`.item`)??[]].filter(e=>!e.closest(`details:not([open])`)).flatMap(e=>this.filteredFiles.filter(t=>t.path===e.dataset.path)):this.filterFiles();if(n.length===0)return;let r=this.resolveActiveFile(n),i=r?n.findIndex(e=>e.path===r.path):-1,a=n[Math.max(0,Math.min(n.length-1,i+e))];a&&a.path!==r?.path&&this.emitSelect(a.path)}scrollActiveFileIntoView(){this.updateComplete.then(()=>{this.isConnected&&this.shadowRoot?.querySelector(`.item.is-active`)?.scrollIntoView({block:`nearest`})}).catch(()=>{})}emitSelect(e){this.dispatchEvent(new CustomEvent(`file-preview-select`,{bubbles:!0,composed:!0,detail:e})),this.layout===`files`&&this.focusModal()}},b([y({attribute:!1})],$.prototype,`files`,void 0),b([y()],$.prototype,`activePath`,void 0),b([y()],$.prototype,`query`,void 0),b([y()],$.prototype,`label`,void 0),b([y()],$.prototype,`listLabel`,void 0),b([y()],$.prototype,`searchPlaceholder`,void 0),b([y()],$.prototype,`contextLabel`,void 0),b([y()],$.prototype,`readOnlyLabel`,void 0),b([y()],$.prototype,`emptyTitle`,void 0),b([y()],$.prototype,`emptySubtitle`,void 0),b([y()],$.prototype,`copyLabel`,void 0),b([y()],$.prototype,`layout`,void 0),b([y({attribute:!1})],$.prototype,`directories`,void 0),b([y({type:Boolean})],$.prototype,`loading`,void 0),b([y({type:Boolean})],$.prototype,`fileLoading`,void 0),b([y()],$.prototype,`error`,void 0),b([y()],$.prototype,`notice`,void 0),b([m(`.search`)],$.prototype,`searchInput`,void 0),b([m(`.detail-body`)],$.prototype,`detailBody`,void 0),Fn=64,In={code:u.fileCode,component:u.layoutGrid,data:u.braces,file:u.fileText,image:u.image,markdown:u.book,package:u.box,shell:u.terminal,skill:u.pencilSparkles}})))()}function Rn(){return(Rn=e((()=>{Ln(),customElements.get(`openclaw-file-preview-modal`)||customElements.define(`openclaw-file-preview-modal`,$)})))()}export{An as n,Dn as r,Rn as t};
//# sourceMappingURL=file-preview-modal-registration-BRaePKge.js.map