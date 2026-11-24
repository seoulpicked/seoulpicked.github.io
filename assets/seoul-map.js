(() => {
 'use strict';
 const select=document.getElementById('district-select');if(!select)return;
 const panels=[...document.querySelectorAll('[data-panel]')],controls=[...document.querySelectorAll('[data-district]')];
 const valid=new Set(panels.map(p=>p.dataset.panel));
 function show(slug,update=false){if(!valid.has(slug))slug='jongno';panels.forEach(p=>p.hidden=p.dataset.panel!==slug);controls.forEach(c=>c.setAttribute('aria-pressed',String(c.dataset.district===slug)));select.value=slug;if(update)history.replaceState(null,'','#'+slug);}
 controls.forEach(c=>{c.addEventListener('click',()=>show(c.dataset.district,true));if(c.tagName.toLowerCase()==='g')c.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();show(c.dataset.district,true);}});});
 select.addEventListener('change',()=>show(select.value,true));window.addEventListener('hashchange',()=>show(location.hash.slice(1)));show(location.hash.slice(1));
})();