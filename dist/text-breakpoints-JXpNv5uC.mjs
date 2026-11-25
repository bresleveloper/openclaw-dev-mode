//!packages/markdown-core/src/text-breakpoints.ts
function scanParenAwareBreakpoints(e,t,n,r){let i=-1;let a=-1;if(!r){const r=e.slice(t,n);if(!r.includes(`(`)){const e=r.lastIndexOf(`
`);i=e<0?-1:t+e;const n=r.search(/[^\S\n][\S\n]*$/);a=n<0?-1:t+n;return{lastNewline:i,lastWhitespace:a}}}let o=0;for(let s=t;s<n;s++){const t=r?.(s);if(t!==void 0){s=t-1;continue}const n=e.charAt(s);if(n===`(`){o+=1;continue}if(n===`)`&&o>0){o-=1;continue}if(o!==0)continue;if(n===`
`)i=s;else if(/\s/.test(n))a=s}return{lastNewline:i,lastWhitespace:a}}export{scanParenAwareBreakpoints as t};