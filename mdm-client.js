/* Classroom control: runs on every student page. Reports "I am here" and obeys the teacher's panel. */
(function(){
  if (window.__mdmLoaded) return; window.__mdmLoaded = true;
  if (/\/manage(\.html)?\/?$/i.test(location.pathname)) return;
  function loadScript(src){ return new Promise(function(res,rej){ var s=document.createElement('script'); s.src=src; s.onload=res; s.onerror=rej; document.head.appendChild(s); }); }
  var id; try{ id = localStorage.getItem('mdmId'); if(!id){ id='pc-'+Math.random().toString(36).slice(2,8); localStorage.setItem('mdmId',id);} }catch(e){ id='pc-'+Math.random().toString(36).slice(2,8); }
  var store, label='', lockAll=null, lockMe=null;

  function who(){ try{ return (typeof studentName!=='undefined' && studentName) ? String(studentName) : ''; }catch(e){ return ''; } }
  function css(){
    if(document.getElementById('mdmCss')) return;
    var s=document.createElement('style'); s.id='mdmCss';
    s.textContent = '.mdm-ov{position:fixed;inset:0;z-index:2147483647;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:24px;font-family:"Trebuchet MS","Segoe UI",Arial,sans-serif;color:#fff}'+
    '.mdm-lock{background:linear-gradient(160deg,#1B2A41,#0B7A75);cursor:not-allowed}'+
    '.mdm-ov .big{font-size:clamp(70px,16vw,140px);line-height:1}.mdm-ov h1{margin:10px 0;font-size:clamp(28px,6vw,54px)}.mdm-ov p{font-size:clamp(18px,3vw,28px);max-width:760px;margin:6px 0}'+
    '.mdm-btn{border:none;border-radius:18px;background:#FF8A00;color:#fff;font-weight:900;font-size:clamp(18px,3vw,26px);padding:14px 30px;cursor:pointer;box-shadow:0 7px 0 #c26a00;font-family:inherit;margin-top:18px}'+
    '.mdm-btn:active{transform:translateY(5px);box-shadow:0 2px 0 #c26a00}'+
    '.mdm-card{position:fixed;left:50%;transform:translateX(-50%);z-index:2147483646;background:#fff;color:#1B2A41;border:5px solid #14B8A6;border-radius:24px;padding:16px 22px;max-width:min(680px,94vw);font-family:"Trebuchet MS","Segoe UI",Arial,sans-serif;box-shadow:0 14px 40px rgba(0,0,0,.4);text-align:center}'+
    '.mdm-card b{display:block;font-size:clamp(20px,3.4vw,30px);margin-bottom:4px}.mdm-card span{font-size:clamp(17px,2.8vw,24px);font-weight:700}'+
    '.mdm-top{top:14px}.mdm-bot{bottom:14px}'+
    '.mdm-dot{position:fixed;left:8px;bottom:8px;width:10px;height:10px;border-radius:50%;background:#22C55E;opacity:.55;z-index:2147483000;pointer-events:none}';
    document.head.appendChild(s);
  }
  function ding(){ try{ var a=new (window.AudioContext||window.webkitAudioContext)(); [660,880].forEach(function(f,i){ var o=a.createOscillator(),g=a.createGain(); o.type='triangle'; o.frequency.value=f; g.gain.setValueAtTime(.12,a.currentTime+i*.14); g.gain.exponentialRampToValueAtTime(.0001,a.currentTime+i*.14+.25); o.connect(g); g.connect(a.destination); o.start(a.currentTime+i*.14); o.stop(a.currentTime+i*.14+.26); }); }catch(e){} }
  function esc(t){ return String(t==null?'':t).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];}); }
  function card(html, pos, secs){
    css(); var d=document.createElement('div'); d.className='mdm-card '+(pos||'mdm-top'); d.innerHTML=html+'<div><button class="mdm-btn" style="margin-top:10px;padding:8px 22px;font-size:20px">OK</button></div>';
    d.querySelector('button').onclick=function(){ d.remove(); };
    document.body.appendChild(d); ding(); if(secs) setTimeout(function(){ d.remove(); }, secs*1000); return d;
  }

  /* ---- lock screen ---- */
  var lockEl=null, mo=null;
  function keyBlock(e){ if(lockEl){ e.preventDefault(); e.stopPropagation(); } }
  function applyLock(){
    var L = (lockMe && lockMe.locked) ? lockMe : ((lockAll && lockAll.locked) ? lockAll : null);
    if(L){
      css(); if(!lockEl){ lockEl=document.createElement('div'); lockEl.className='mdm-ov mdm-lock'; lockEl.id='mdmLock'; document.body.appendChild(lockEl);
        document.addEventListener('keydown',keyBlock,true); document.addEventListener('keyup',keyBlock,true);
        mo=new MutationObserver(function(){ if(lockEl && !document.body.contains(lockEl)) document.body.appendChild(lockEl); }); mo.observe(document.body,{childList:true});
        try{ document.activeElement && document.activeElement.blur(); }catch(e){} }
      lockEl.innerHTML='<div class="big">🔒</div><h1>This computer is locked</h1><p>'+esc(L.message||'Eyes on your teacher, please.')+'</p>';
    } else if(lockEl){ if(mo) mo.disconnect(); lockEl.remove(); lockEl=null; document.removeEventListener('keydown',keyBlock,true); document.removeEventListener('keyup',keyBlock,true); }
  }

  /* ---- commands ---- */
  function fixUrl(u){ u=String(u||'').trim(); if(!u) return ''; if(/^(javascript|data|vbscript):/i.test(u)) return ''; if(!/^https?:\/\//i.test(u)) u='https://'+u; return u; }
  function download(name,mime,b64){
    try{ var bin=atob(b64), arr=new Uint8Array(bin.length); for(var i=0;i<bin.length;i++) arr[i]=bin.charCodeAt(i);
      var url=URL.createObjectURL(new Blob([arr],{type:mime||'application/octet-stream'})); var a=document.createElement('a'); a.href=url; a.download=name||'file'; document.body.appendChild(a); a.click(); a.remove(); setTimeout(function(){URL.revokeObjectURL(url);},4000); return true; }catch(e){ return false; }
  }
  function run(c){
    var t=c.type;
    if(t==='message'){ card('<b>📢 Message from your teacher</b><span>'+esc(c.text)+'</span>','mdm-top',60); }
    else if(t==='open'){
      var url=fixUrl(c.url); if(!url) return;
      if(c.mode==='same'){ location.href=url; return; }
      var w=null; try{ w=window.open(url,'_blank'); }catch(e){}
      if(!w){ var d=card('<b>🔗 Your teacher sent you a link</b><span>'+esc(url)+'</span>','mdm-top'); var b=document.createElement('button'); b.className='mdm-btn'; b.textContent='Open it ▶'; b.style.marginTop='10px'; b.onclick=function(){ window.open(url,'_blank'); d.remove(); }; d.appendChild(b); }
    }
    else if(t==='file'){
      var ok=download(c.name,c.mime,c.b64);
      var d2=card('<b>📁 Your teacher sent you a file</b><span>'+esc(c.name)+(c.note?'<br>'+esc(c.note):'')+'</span>','mdm-bot');
      var b2=document.createElement('button'); b2.className='mdm-btn'; b2.textContent='Save again ⬇'; b2.style.marginTop='10px'; b2.onclick=function(){ download(c.name,c.mime,c.b64); }; d2.appendChild(b2);
    }
    else if(t==='shutdown'){
      css(); var o=document.createElement('div'); o.className='mdm-ov'; o.style.background='linear-gradient(160deg,#312E81,#1B2A41)';
      o.innerHTML='<div class="big">🖥️💤</div><h1>Time to shut down</h1><p>Save your work. Then shut down your computer properly.</p><p>'+esc(c.text||'')+'</p><button class="mdm-btn">OK, I will do it now</button>';
      o.querySelector('button').onclick=function(){ o.remove(); }; document.body.appendChild(o); ding();
    }
    else if(t==='home'){ location.href='/'; }
    else if(t==='reload'){ location.reload(); }
  }

  function beat(){
    try{ store.set('devices/'+id,{ user:who(), page:document.title||location.pathname, path:decodeURIComponent(location.pathname), lastSeen:store.serverTime(), visible:!document.hidden, screen:innerWidth+'x'+innerHeight },true); }catch(e){}
  }
  async function start(){
    try{
      if(!window.MDMStore) await loadScript('/mdm-store.js');
      store=window.MDMStore; await store.init(false);
      store.watchDoc('labels/'+id,function(d){ label=(d&&d.label)||''; var dot=document.getElementById('mdmDot'); if(dot) dot.title='Connected'+(label?' as '+label:''); });
      store.watchDoc('locks/all',function(d){ lockAll=d; applyLock(); });
      store.watchDoc('locks/'+id,function(d){ lockMe=d; applyLock(); });
      store.watchAdded('commands',function(c){
        if(!c) return; var tg=c.targets; if(!(tg==='all'||(Array.isArray(tg)&&tg.indexOf(id)>=0))) return;
        if(c.ts && Math.abs(Date.now()-c.ts)>10*60*1000) return; run(c);
      });
      css(); var dot=document.createElement('div'); dot.className='mdm-dot'; dot.id='mdmDot'; dot.title='Connected'; document.body.appendChild(dot);
      beat(); setInterval(beat,15000); document.addEventListener('visibilitychange',beat);
    }catch(e){ console.warn('Classroom control unavailable:',e&&e.message); }
  }
  window.__mdmId=id;
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start); else start();
})();
