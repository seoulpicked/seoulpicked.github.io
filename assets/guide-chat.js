---
---
(() => {
  'use strict';
  if (document.getElementById('sp-guide-launcher')) return;
  const guides = [
  {% for post in site.posts %}{title:{{ post.title | jsonify }},url:{{ post.url | relative_url | jsonify }},category:{{ post.category | jsonify }},description:{{ post.description | jsonify }},video:{{ post.youtube_id | default: '' | jsonify }},text:{{ post.content | markdownify | strip_html | normalize_whitespace | truncate: 1000 | jsonify }}}{% unless forloop.last %},{% endunless %}{% endfor %}
  ];
  const css = document.createElement('style');
  css.textContent = `
  #sp-guide-launcher,#sp-guide-panel{font-family:'DM Sans',Arial,sans-serif;box-sizing:border-box;font-size:16px;line-height:1.5}
  #sp-guide-launcher{position:fixed;right:20px;bottom:max(20px,env(safe-area-inset-bottom));z-index:1000;border:0;border-radius:28px;padding:14px 20px;background:#152a24;color:#fff;box-shadow:0 5px 24px #0003;cursor:pointer;font-weight:700;min-height:48px}
  #sp-guide-panel{position:fixed;right:20px;bottom:88px;z-index:1001;width:390px;max-width:calc(100vw - 24px);max-height:calc(100dvh - 110px);border:1px solid #ccd7ce;border-radius:18px;background:#fff;color:#17201e;box-shadow:0 12px 50px #0003;overflow:auto}
  #sp-guide-panel[hidden],#sp-guide-panel [hidden]{display:none!important}
  #sp-guide-panel *{box-sizing:border-box}#sp-guide-panel a{color:#275b43;text-decoration:underline;text-underline-offset:3px}
  .spg-head{position:sticky;top:0;display:flex;align-items:center;justify-content:space-between;padding:16px;background:#152a24;color:white;z-index:1}.spg-head h2{font-size:18px;margin:0;color:white}.spg-head p{font-size:13px;margin:2px 0 0;color:#d9ff65}
  .spg-close{border:0;background:transparent;color:white;font-size:28px;width:44px;height:44px;cursor:pointer}
  .spg-body{padding:16px}.spg-note{font-size:13px;color:#536258;margin:0 0 14px}.spg-choices{display:flex;flex-wrap:wrap;gap:8px;margin:12px 0}.spg-choices button,.spg-switch{font:inherit;font-size:14px;border:1px solid #becac0;border-radius:18px;background:#f0f5ed;padding:8px 12px;cursor:pointer;color:#17201e;min-height:40px}
  .spg-log{max-height:280px;overflow:auto;overscroll-behavior:contain}.spg-msg{padding:12px;border-radius:12px;background:#f0f5ed;margin:0 0 12px;white-space:pre-wrap;overflow-wrap:anywhere}.spg-user{background:#152a24;color:white;margin-left:25px}.spg-result{margin:12px 0}.spg-result a{font-weight:700}.spg-result p{font-size:14px;line-height:1.6;margin:4px 0}.spg-search{display:flex;gap:8px;margin-top:12px}.spg-search input{min-width:0;flex:1}
  #sp-guide-panel input:not([type=checkbox]),#sp-guide-panel select,#sp-guide-panel textarea{font:inherit;font-size:16px;padding:10px;border:1px solid #9eafa2;border-radius:8px;background:white;color:#17201e;width:100%}
  #sp-guide-panel button:focus-visible,#sp-guide-panel a:focus-visible,#sp-guide-panel input:focus-visible,#sp-guide-panel select:focus-visible,#sp-guide-panel textarea:focus-visible{outline:3px solid #8ebf32;outline-offset:2px}
  .spg-send{border:0;border-radius:9px;background:#152a24;color:white;font:inherit;font-weight:700;padding:10px 14px;min-height:44px;cursor:pointer}.spg-contact label{display:block;font-weight:700;font-size:14px;margin:12px 0 5px}.spg-contact textarea{min-height:110px;resize:vertical}.spg-contact .spg-consent{display:flex;gap:9px;font-size:13px;font-weight:400;align-items:flex-start;line-height:1.5}.spg-consent input{flex:none;margin-top:4px}.spg-honey{display:none!important}.spg-foot{margin-top:14px;font-size:13px;color:#536258}.spg-search .spg-send{flex:none}
  @media(max-width:520px){#sp-guide-launcher{right:12px;bottom:max(12px,env(safe-area-inset-bottom));font-size:14px}#sp-guide-panel{right:12px;bottom:78px;width:calc(100vw - 24px);max-height:calc(100dvh - 96px)}.spg-log{max-height:35dvh}}
  `;
  document.head.append(css);
  const launcher = document.createElement('button');
  launcher.id = 'sp-guide-launcher'; launcher.type = 'button';
  launcher.textContent = 'Guide & enquiries';
  launcher.setAttribute('aria-controls','sp-guide-panel'); launcher.setAttribute('aria-expanded','false');
  const panel = document.createElement('section'); panel.id = 'sp-guide-panel'; panel.hidden = true;
  panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','false');panel.setAttribute('aria-labelledby','spg-title');
  panel.innerHTML = `<header class="spg-head"><div><h2 id="spg-title">Seoul Picked Guide</h2><p>Explore Korea. Message our team.</p></div><button class="spg-close" type="button" aria-label="Close guide">×</button></header>
  <div class="spg-body"><div id="spg-chat"><p class="spg-note">A free guide finder, based on this website. No live prices or bookings. Your searches stay in this browser.</p>
  <div class="spg-log" role="log" aria-live="polite" aria-relevant="additions" aria-label="Guide conversation"></div>
  <div class="spg-choices"><button type="button" data-query="Korean food">Food</button><button type="button" data-query="free places Seoul">Free places</button><button type="button" data-query="Korean beauty">Beauty</button><button type="button" data-query="latest video">New video</button><button type="button" data-enquiry>Send an enquiry</button></div>
  <form class="spg-search"><label for="spg-question" hidden>Ask about our guides</label><input id="spg-question" name="question" aria-label="Ask about our guides" placeholder="Ask about food, places or videos…" maxlength="300" autocomplete="off" required><button class="spg-send" type="submit">Ask</button></form></div>
  <div id="spg-contact" hidden><button class="spg-switch" type="button" data-back>Back to guide</button><h3>Send our team a message</h3><p class="spg-note">Questions, requests and suggestions are emailed privately to Seoul Picked at wrpdla@naver.com. This is a contact form, not an instant human chat.</p>
  <form class="spg-contact" action="https://formsubmit.co/wrpdla@naver.com" method="POST" accept-charset="UTF-8">
  <input type="hidden" name="_subject" value="[Seoul Picked] Guide chatbot enquiry or request"><input type="hidden" name="_template" value="table"><input type="hidden" name="_next" value="https://seoulpicked.github.io/contact/thanks/"><input type="hidden" name="source" value="Website guide chatbot"><input type="hidden" name="page" id="spg-source-page"><input class="spg-honey" type="text" name="_honey" tabindex="-1" autocomplete="off" aria-hidden="true">
  <label for="spg-name">Your name *</label><input id="spg-name" name="name" autocomplete="name" required maxlength="100">
  <label for="spg-email">Your email *</label><input id="spg-email" type="email" name="email" autocomplete="email" required maxlength="254">
  <label for="spg-topic">Message type *</label><select id="spg-topic" name="topic" required><option value="">Choose a type</option><option>Question / enquiry</option><option>Request / suggestion</option><option>Story correction</option><option>Partnership / collaboration</option></select>
  <label for="spg-message">Your message *</label><textarea id="spg-message" name="message" required minlength="10" maxlength="5000" placeholder="Tell us your question or request. English and Korean are welcome."></textarea>
  <label class="spg-consent"><input type="checkbox" name="consent" value="I agree to enquiry processing as described in the privacy notice" required><span>I agree to send my name, email and message through FormSubmit to Seoul Picked to handle my enquiry. <a href="/privacy/">Privacy notice</a>.</span></label>
  <p class="spg-note">A spam check may appear after sending. Please do not include passwords or payment information.</p><button class="spg-send" type="submit">Send message</button></form></div>
  <p class="spg-foot"><a href="/contact/">Full contact form</a> · <a href="/videos/">All videos</a></p></div>`;
  document.body.append(launcher,panel);
  const find = s => panel.querySelector(s);
  const log = find('.spg-log'), input = find('#spg-question');
  function open(){panel.hidden=false;launcher.setAttribute('aria-expanded','true');(find('#spg-contact').hidden?input:find('#spg-name')).focus();}
  function close(){panel.hidden=true;launcher.setAttribute('aria-expanded','false');launcher.focus();}
  launcher.addEventListener('click',()=>panel.hidden?open():close());
  find('.spg-close').addEventListener('click',close);
  panel.addEventListener('keydown',e=>{if(e.key==='Escape')close();});
  function contact(show){find('#spg-chat').hidden=show;find('#spg-contact').hidden=!show;(show?find('#spg-name'):input).focus();}
  panel.querySelectorAll('[data-enquiry]').forEach(b=>b.addEventListener('click',()=>contact(true)));
  find('[data-back]').addEventListener('click',()=>contact(false));
  find('#spg-source-page').value=location.origin+location.pathname;
  function message(text,user=false){const d=document.createElement('div');d.className='spg-msg'+(user?' spg-user':'');d.textContent=text;log.append(d);while(log.children.length>20)log.firstElementChild.remove();log.scrollTop=log.scrollHeight;return d;}
  const stop=new Set('what where when how can could would should do does is are the a an to in on for of me you your i my please tell about find some with 서울 한국 어디 추천 알려줘'.split(' '));
  const aliases=[[/파전|pajeon|pancake|seafood/,'pajeon pancake seafood'],[/음식|간식|디저트|먹|food|snack|dessert/,'food snack dessert'],[/무료|공짜|free/,'free'],[/여행|야경|산책|travel|night|walk/,'travel night walk'],[/뷰티|화장품|스킨케어|beauty|skincare/,'style beauty skincare'],[/케이팝|케이팝|k.?pop/,'culture k-pop'],[/최신|새.?영상|latest video|new video/,'latestvideo']];
  function search(q){let normalized=q.normalize('NFKC').toLowerCase();for(const [pattern,words] of aliases)if(pattern.test(normalized))normalized+=' '+words;
    if(normalized.includes('latestvideo'))return guides.filter(g=>g.video==='6OsAEh6aZvc');
    const words=[...new Set((normalized.match(/[\p{L}\p{N}-]+/gu)||[]).filter(w=>w.length>1&&!stop.has(w)))];
    return guides.map(g=>{const title=(g.title||'').toLowerCase(),body=((g.description||'')+' '+(g.text||'')).toLowerCase();let score=0;for(const word of words){if(title.includes(word))score+=5;if((g.category||'').includes(word))score+=3;if(body.includes(word))score+=1;}return {g,score};}).filter(x=>x.score>=2).sort((a,b)=>b.score-a.score).slice(0,3).map(x=>x.g);
  }
  function answer(q){message(q,true);const ko=/[가-힣]/.test(q);
    if(/contact|enquir|inquir|request|suggestion|partnership|문의|요청|요구|제안|연락|이메일/i.test(q)){message(ko?'문의·요청 내용을 아래 양식에 작성하면 서울픽드 메일로 전달됩니다.':'Use the message form to email your question or request to our team.');contact(true);return;}
    if(/^(hi|hello|hey|안녕)[! .]*$/i.test(q)){message(ko?'음식, 여행, 뷰티 또는 영상에 대해 물어보세요. 문의·요청은 Send an enquiry를 눌러 보내실 수 있어요.':'Ask about food, places, beauty or videos. Choose Send an enquiry to message our team.');return;}
    const results=search(q);if(!results.length){message(ko?'관련 홈페이지 글을 찾지 못했어요. Send an enquiry로 질문이나 요청을 보내주세요.':'I couldn’t find a matching guide on this website. Try a place or food name, or choose Send an enquiry to ask our team.');return;}
    const box=message(ko?'관련 홈페이지 안내를 찾았어요. 자세한 내용은 원문을 확인해 주세요.':'Here’s what I found in our guides. Open a story for the details.');
    results.forEach(g=>{const d=document.createElement('div');d.className='spg-result';const a=document.createElement('a');a.href=g.url;a.textContent=g.title;const p=document.createElement('p');p.textContent=g.description||g.text.slice(0,220);d.append(a,p);box.append(d);});
    log.scrollTop=log.scrollHeight;
  }
  find('.spg-search').addEventListener('submit',e=>{e.preventDefault();const q=input.value.trim();if(q){input.value='';answer(q);}});
  panel.querySelectorAll('[data-query]').forEach(b=>b.addEventListener('click',()=>answer(b.dataset.query)));
  message('Hi! I can find Seoul Picked guides or help you email a question, request or suggestion. What would you like to explore?');
})();
