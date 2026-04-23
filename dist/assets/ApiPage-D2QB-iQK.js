import{E as e,O as t,c as n,f as r,p as i,w as a}from"./ui-DJ0h09tD.js";import{t as o}from"./index-DrtVEmBi.js";var s=t(o()),c=r(),l=[{method:`GET`,path:`/v1/talent/{id}`,desc:`Retrieve verified talent profile`,response:`{
  "id": "jk_001",
  "name": "Jason Kidd",
  "status": "verified",
  "modules": [
    {
      "type": "biography",
      "version": "3.2",
      "signed_at": "2026-03-12",
      "hash": "0x7f3a..."
    }
  ]
}`},{method:`GET`,path:`/v1/talent/{id}/stats`,desc:`Career statistics with source citations`,response:`{
  "career_points": 17529,
  "career_assists": 12091,
  "citations": [
    {
      "source": "NBA.com",
      "verified": true
    }
  ]
}`},{method:`GET`,path:`/v1/talent`,desc:`List all talent with filtering`,response:`{
  "total": 5,
  "talent": [
    { "id": "jk_001", "name": "Jason Kidd" },
    { "id": "jr_002", "name": "JR Ryder" }
  ]
}`},{method:`POST`,path:`/v1/license/request`,desc:`Request data licensing access`,response:`{
  "request_id": "lic_2026_0042",
  "status": "pending_review",
  "estimated_review": "48h"
}`}];function u({viewport:t}){let[r,o]=(0,s.useState)(0),{isMobile:u,isTablet:d}=t,f=l[r],p=e=>{window.requestAnimationFrame(()=>{document.getElementById(`endpoint-tab-${e}`)?.focus()})},m=e=>{o(e),p(e)},h=(e,t)=>{let n=null;switch(e.key){case`ArrowDown`:n=(t+1)%l.length;break;case`ArrowUp`:n=(t-1+l.length)%l.length;break;case`Home`:n=0;break;case`End`:n=l.length-1;break;default:break}n!==null&&(e.preventDefault(),m(n))};return(0,c.jsxs)(`div`,{style:{maxWidth:1100,margin:`0 auto`,padding:u?`32px 16px`:`48px 24px`},children:[(0,c.jsx)(n,{sub:`Verified biographical data via REST API. Every response includes provenance and citation chains.`,children:`API Documentation`}),(0,c.jsx)(`div`,{style:{display:`flex`,gap:16,marginBottom:36,flexWrap:`wrap`},children:[{label:`API Calls / Month`,value:i.calls,color:a.cyan},{label:`Uptime`,value:i.uptime,color:a.green},{label:`Avg Latency`,value:i.latency,color:a.violet},{label:`Active Consumers`,value:i.consumers,color:a.orange}].map(t=>(0,c.jsxs)(`div`,{style:{flex:1,minWidth:140,padding:`18px 20px`,background:a.inkLight,borderRadius:a.radius,border:`1px solid ${a.border}`},children:[(0,c.jsx)(`div`,{style:{fontSize:11,color:a.muted,fontFamily:e.body,textTransform:`uppercase`,letterSpacing:`0.08em`,marginBottom:6},children:t.label}),(0,c.jsx)(`div`,{style:{fontSize:26,fontWeight:700,fontFamily:e.display,color:t.color},children:t.value})]},t.label))}),(0,c.jsxs)(`div`,{style:{display:`grid`,gridTemplateColumns:d?`1fr`:`280px 1fr`,gap:16,minHeight:400},children:[(0,c.jsxs)(`div`,{role:`tablist`,"aria-label":`API endpoints`,"aria-orientation":`vertical`,style:{background:a.inkLight,borderRadius:a.radius,border:`1px solid ${a.border}`,padding:8,overflow:`hidden`},children:[(0,c.jsx)(`div`,{style:{fontSize:11,fontWeight:700,color:a.muted,fontFamily:e.body,textTransform:`uppercase`,letterSpacing:`0.08em`,padding:`10px 12px`},children:`Endpoints`}),l.map((t,n)=>(0,c.jsxs)(`button`,{type:`button`,id:`endpoint-tab-${n}`,role:`tab`,"aria-selected":r===n,"aria-controls":`endpoint-panel-${n}`,tabIndex:r===n?0:-1,onClick:()=>o(n),onKeyDown:e=>h(e,n),style:{display:`flex`,alignItems:`center`,gap:8,width:`100%`,padding:`10px 12px`,border:`none`,borderRadius:a.radiusXs,background:r===n?a.inkMid:`transparent`,cursor:`pointer`,textAlign:`left`,transition:`all 0.15s`},children:[(0,c.jsx)(`span`,{style:{fontSize:10,fontWeight:700,fontFamily:e.mono,color:t.method===`GET`?a.green:a.orange,padding:`2px 6px`,borderRadius:4,background:t.method===`GET`?a.greenDim:a.orangeDim},children:t.method}),(0,c.jsx)(`span`,{style:{fontSize:12,fontFamily:e.mono,color:r===n?a.paper:a.muted,overflow:`hidden`,textOverflow:`ellipsis`,whiteSpace:u?`normal`:`nowrap`,wordBreak:`break-word`},children:t.path})]},t.path))]}),(0,c.jsxs)(`div`,{role:`tabpanel`,id:`endpoint-panel-${r}`,"aria-labelledby":`endpoint-tab-${r}`,tabIndex:0,style:{background:a.inkLight,borderRadius:a.radius,border:`1px solid ${a.border}`,overflow:`hidden`},children:[(0,c.jsxs)(`div`,{style:{padding:`14px 20px`,borderBottom:`1px solid ${a.border}`,display:`flex`,alignItems:`center`,gap:10,flexWrap:`wrap`},children:[(0,c.jsx)(`span`,{style:{fontSize:11,fontWeight:700,fontFamily:e.mono,color:f.method===`GET`?a.green:a.orange,padding:`3px 8px`,borderRadius:4,background:f.method===`GET`?a.greenDim:a.orangeDim},children:f.method}),(0,c.jsx)(`span`,{style:{fontSize:13,fontFamily:e.mono,color:a.paper},children:f.path})]}),(0,c.jsx)(`div`,{style:{padding:`12px 20px`,borderBottom:`1px solid ${a.border}`},children:(0,c.jsx)(`p`,{style:{fontSize:13,color:a.muted,fontFamily:e.body,margin:0},children:f.desc})}),(0,c.jsxs)(`div`,{style:{padding:20},children:[(0,c.jsx)(`div`,{style:{fontSize:11,color:a.muted,fontFamily:e.body,marginBottom:8,textTransform:`uppercase`,letterSpacing:`0.08em`},children:`Response`}),(0,c.jsx)(`pre`,{style:{fontSize:12,fontFamily:e.mono,color:a.cyan,background:a.ink,borderRadius:a.radiusSm,padding:16,margin:0,overflow:`auto`,lineHeight:1.6,border:`1px solid ${a.border}`},children:f.response})]})]})]})]})}export{u as default};