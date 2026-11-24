(() => {
'use strict';
const select=document.getElementById('district-select');if(!select)return;
const panels=[...document.querySelectorAll('[data-panel]')],controls=[...document.querySelectorAll('[data-district]')],types=[...document.querySelectorAll('[data-map-type]')];
const groups={top:['jongno','jung','yongsan','mapo','gangnam'],shopping:['jung','gangnam','mapo','seongdong','songpa','seocho','yeongdeungpo'],food:['jongno','jung','mapo','yongsan','dongdaemun','gwangjin','dongjak'],sightseeing:['jongno','jung','yongsan','songpa','seongdong','seodaemun','eunpyeong','gangbuk','dobong','nowon','gangdong'],all:panels.map(p=>p.dataset.panel)};
const descriptions={top:'Five starting areas for a first Seoul visit: Jongno, Jung, Yongsan, Mapo and Gangnam.',shopping:'A curated starting list for shopping, boutiques and browsing.',food:'A curated starting list for markets, local food streets and neighbourhood eating.',sightseeing:'A curated starting list for palaces, museums, parks and outdoor sights.',all:'Every Seoul district, ready to explore.'};
// Freeze each tile's palette before moving the selected tile above its neighbours.
const shapes=[...document.querySelectorAll('.district-shape')];
shapes.forEach(g=>{const style=getComputedStyle(g);g.style.setProperty('--toy-top',style.getPropertyValue('--toy-top'));g.style.setProperty('--toy-side',style.getPropertyValue('--toy-side'));});
let active='top',selected='jongno';
function show(slug,update=false){if(!groups[active].includes(slug))slug=groups[active][0];selected=slug;panels.forEach(p=>p.hidden=p.dataset.panel!==slug);controls.forEach(c=>c.setAttribute('aria-pressed',String(c.dataset.district===slug)));select.value=slug;const tile=shapes.find(g=>g.dataset.district===slug);if(tile)tile.parentNode.appendChild(tile);if(update)history.replaceState(null,'','#'+slug);}
function filter(type){active=type;const allowed=new Set(groups[type]);types.forEach(t=>t.setAttribute('aria-pressed',String(t.dataset.mapType===type)));controls.forEach(c=>{const included=allowed.has(c.dataset.district);if(c.classList.contains('district-shape')){c.classList.toggle('is-muted',!included);c.setAttribute('aria-disabled',String(!included));c.setAttribute('tabindex',included?'0':'-1');}else c.hidden=!included;});[...select.options].forEach(o=>{o.hidden=!allowed.has(o.value);o.disabled=o.hidden;});document.getElementById('map-filter-status').textContent=groups[type].length+' districts · '+descriptions[type];show(selected);}
function choose(c){if(!groups[active].includes(c.dataset.district))return;show(c.dataset.district,true);if(window.matchMedia('(max-width:800px)').matches)document.querySelector('.district-results').scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth',block:'start'});}
controls.forEach(c=>{c.addEventListener('click',()=>choose(c));if(c.tagName.toLowerCase()==='g')c.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();choose(c);}});});
types.forEach(t=>t.addEventListener('click',()=>filter(t.dataset.mapType)));
select.addEventListener('change',()=>{show(select.value,true);});window.addEventListener('hashchange',()=>{const slug=location.hash.slice(1);if(groups.all.includes(slug)){if(!groups[active].includes(slug))filter('all');show(slug);}});
const initial=location.hash.slice(1);if(groups.all.includes(initial)){selected=initial;if(!groups.top.includes(initial))active='all';}filter(active);
})();
