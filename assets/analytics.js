(() => {
  'use strict';
  const id='G-K42N6VMKG6', key='sp-analytics-consent-v1';
  let loaded=false;
  const read=()=>{try{return localStorage.getItem(key);}catch{return null;}};
  function start(){
    if(loaded)return;loaded=true;
    window.dataLayer=window.dataLayer||[];
    window.gtag=function(){window.dataLayer.push(arguments);};
    gtag('consent','default',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
    gtag('js',new Date());
    let ref='';try{const u=new URL(document.referrer);ref=u.origin+u.pathname;}catch{}
    gtag('config',id,{allow_google_signals:false,allow_ad_personalization_signals:false,page_location:location.origin+location.pathname,page_referrer:ref,cookie_expires:2592000});
    const s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id='+id;document.head.append(s);
  }
  const style=document.createElement('style');style.textContent='#sp-analytics-banner{position:fixed;left:12px;bottom:12px;width:350px;max-width:calc(100vw - 24px);padding:16px;border:1px solid #bdcabe;border-radius:12px;background:#fff;color:#17201e;box-shadow:0 4px 24px #0002;z-index:1002;font:14px/1.5 Arial,sans-serif;box-sizing:border-box}#sp-analytics-banner p{margin:0 0 12px}#sp-analytics-banner button{padding:10px 14px;margin-right:8px;min-height:44px;border:1px solid #152a24;border-radius:8px;background:white;color:#152a24;font:inherit;cursor:pointer}#sp-analytics-banner button[data-accept]{background:#152a24;color:white}@media(max-width:520px){#sp-analytics-banner{bottom:78px}}';document.head.append(style);
  const box=document.createElement('section');box.id='sp-analytics-banner';box.setAttribute('aria-label','Visitor statistics preferences');box.innerHTML='<p>Help us improve Seoul Picked? Allow optional Google Analytics cookies to measure visits, popular pages and traffic sources. <a href="/privacy/">Privacy notice</a>.</p><button type="button" data-accept>Allow statistics</button><button type="button" data-reject>No thanks</button>';
  function choose(value){try{localStorage.setItem(key,value);}catch{}if(value==='granted')start();else{window['ga-disable-'+id]=true;document.cookie.split(';').forEach(c=>{const n=c.split('=')[0].trim();if(n==='_ga'||n.startsWith('_ga_')){document.cookie=n+'=; Max-Age=0; path=/';document.cookie=n+'=; Max-Age=0; path=/; domain='+location.hostname;}});}box.remove();}
  box.querySelector('[data-accept]').onclick=()=>{window['ga-disable-'+id]=false;choose('granted');};box.querySelector('[data-reject]').onclick=()=>choose('denied');
  const settings=document.createElement('button');settings.type='button';settings.textContent='Statistics preferences';settings.style.cssText='display:block;margin:12px auto;padding:8px 12px;background:transparent;border:1px solid #becac0;border-radius:8px;cursor:pointer';settings.onclick=()=>document.body.append(box);document.body.append(settings);
  if(read()==='granted')start();else if(read()!=='denied')document.body.append(box);
})();
