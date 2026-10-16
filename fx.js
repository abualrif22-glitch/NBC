/* Shared "flashy" effects for the Year 2 games: colour themes, floating background,
   sparkle + ripple on every tap, floating text, big level-complete celebrations. No sound. */
(function(){
  if(window.FX) return;
  var THEMES=[
    {bg:'linear-gradient(135deg,#FF7F50 0%,#FFD54F 100%)',c:'#FF7F50'},
    {bg:'linear-gradient(135deg,#4FC3F7 0%,#A78BFA 100%)',c:'#3B82F6'},
    {bg:'linear-gradient(135deg,#66BB6A 0%,#FFEE58 100%)',c:'#2E9E5B'},
    {bg:'linear-gradient(135deg,#F06292 0%,#FFB74D 100%)',c:'#E91E63'},
    {bg:'linear-gradient(135deg,#26C6DA 0%,#66BB6A 100%)',c:'#00A5BA'},
    {bg:'linear-gradient(135deg,#7E57C2 0%,#4FC3F7 100%)',c:'#7E57C2'},
    {bg:'linear-gradient(135deg,#FF8A65 0%,#F06292 100%)',c:'#F4511E'},
    {bg:'linear-gradient(135deg,#FFCA28 0%,#26C6DA 100%)',c:'#F59E0B'},
    {bg:'linear-gradient(135deg,#AB47BC 0%,#FF7043 100%)',c:'#AB47BC'}];
  var css=document.createElement('style');
  css.textContent=
  'html,body{background:var(--fxbg,linear-gradient(135deg,#7E57C2 0%,#4FC3F7 100%)) !important;background-attachment:fixed !important;}'+
  '.wrap{position:relative;z-index:2;}'+
  '.fx-rb{background:linear-gradient(90deg,#FF5252,#FF9800,#F9C700,#4CAF50,#2196F3,#9C27B0,#FF5252);background-size:200% 100%;-webkit-background-clip:text;background-clip:text;color:transparent !important;animation:fxrb 4s linear infinite;}'+
  '@keyframes fxrb{to{background-position:200% 0;}}'+
  '.fxsky{position:fixed;inset:0;pointer-events:none;z-index:1;overflow:hidden;}'+
  '.fxsky i{position:absolute;bottom:-80px;font-style:normal;opacity:.55;animation:fxrise linear infinite;}'+
  '@keyframes fxrise{to{transform:translateY(-120vh) rotate(25deg);}}'+
  '.fx-spk{position:fixed;z-index:20000;pointer-events:none;transform:translate(-50%,-50%);animation:fxspark .9s ease-out forwards;}'+
  '@keyframes fxspark{to{transform:translate(calc(-50% + var(--dx)),calc(-50% + var(--dy))) scale(.3) rotate(240deg);opacity:0;}}'+
  '.fx-rip{position:fixed;z-index:19990;width:20px;height:20px;border-radius:50%;border:5px solid #fff;box-shadow:0 0 0 3px var(--fxc,#FF5C8A);transform:translate(-50%,-50%);pointer-events:none;animation:fxrip .65s ease-out forwards;}'+
  '@keyframes fxrip{to{width:130px;height:130px;opacity:0;}}'+
  '.fx-ftx{position:fixed;z-index:20010;font-weight:900;font-size:30px;color:#fff;white-space:nowrap;text-shadow:0 3px 0 var(--fxc,#FF5C8A),0 0 10px rgba(0,0,0,.3);transform:translate(-50%,-50%);pointer-events:none;animation:fxftx 1s ease-out forwards;}'+
  '@keyframes fxftx{to{transform:translate(-50%,-150%) scale(1.3);opacity:0;}}'+
  '.fx-conf{position:fixed;top:-20px;font-size:28px;z-index:20000;pointer-events:none;animation:fxfall 2.2s linear forwards;}'+
  '@keyframes fxfall{to{transform:translateY(110vh) rotate(360deg);}}'+
  '.fx-bob{animation:fxbob 1.8s ease-in-out infinite;}@keyframes fxbob{50%{transform:translateY(-10px) rotate(4deg);}}'+
  '.fx-in{animation:fxin .6s cubic-bezier(.2,1.5,.4,1) both;}@keyframes fxin{from{transform:translateX(-120px) rotate(-25deg) scale(.4);opacity:0;}to{transform:none;opacity:1;}}'+
  '.fx-boom{animation:fxboom .55s ease;}@keyframes fxboom{40%{transform:scale(1.35) rotate(-6deg);}100%{transform:scale(1);}}'+
  '.fx-glow{animation:fxglow .7s ease;}@keyframes fxglow{40%{box-shadow:0 0 0 8px rgba(255,235,59,.9),0 0 40px 14px rgba(255,235,59,.8);transform:scale(1.06);}}'+
  '.fx-cele{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;background:radial-gradient(circle at 50% 40%,#7A5CFF,#2B2250);overflow:hidden;}'+
  '.fx-rays{position:absolute;width:260vmax;height:260vmax;left:50%;top:40%;margin:-130vmax 0 0 -130vmax;background:repeating-conic-gradient(rgba(255,255,255,.14) 0 10deg,transparent 10deg 20deg);animation:fxspin 18s linear infinite;}'+
  '@keyframes fxspin{to{transform:rotate(360deg);}}'+
  '.fx-cc{position:relative;text-align:center;color:#fff;max-width:560px;width:100%;font-family:"Segoe UI",Calibri,Arial,sans-serif;}'+
  '.fx-medal{font-size:min(30vw,160px);line-height:1;display:inline-block;animation:fxmedal 1.1s cubic-bezier(.2,1.6,.4,1) both,fxpulse 1.6s 1.1s ease-in-out infinite;}'+
  '@keyframes fxmedal{from{transform:scale(0) rotate(-300deg);}to{transform:scale(1) rotate(0);}}'+
  '@keyframes fxpulse{50%{transform:scale(1.12) rotate(-5deg);}}'+
  '.fx-title{font-size:clamp(30px,8vw,52px);margin:4px 0;font-weight:900;color:#FFEB3B;text-shadow:0 5px 0 rgba(0,0,0,.3);animation:fxdrop .6s .5s both;}'+
  '.fx-sub{font-size:26px;font-weight:800;animation:fxdrop .6s .8s both;}'+
  '@keyframes fxdrop{from{transform:translateY(-60px) scale(.5);opacity:0;}to{transform:none;opacity:1;}}'+
  '.fx-stars{font-size:clamp(50px,13vw,76px);letter-spacing:6px;margin:6px 0;}'+
  '.fx-stars span{display:inline-block;animation:fxstar .6s both;}.fx-stars .off{filter:grayscale(1) brightness(1.5);opacity:.4;}'+
  '@keyframes fxstar{from{transform:scale(0) rotate(-180deg);}to{transform:scale(1) rotate(0);}}'+
  '.fx-cheer{font-size:26px;font-weight:800;color:#FFEB3B;margin:6px 0;animation:fxdrop .6s 1.5s both;}'+
  '.fx-stk{font-size:22px;margin:4px 0 16px;font-weight:700;animation:fxdrop .6s 1.8s both;}'+
  '.fx-go{width:100%;max-width:340px;padding:16px;border:none;border-radius:16px;background:#FFEB3B;color:#2B2250;font-size:22px;font-weight:800;cursor:pointer;box-shadow:0 5px 0 #c9b300;animation:fxdrop .6s 2s both;}'+
  '.fx-go:active{transform:translateY(4px);box-shadow:none;}';
  document.head.appendChild(css);

  var root=document.documentElement;
  function rnd(a,b){return a+Math.random()*(b-a);}
  function el(tag,cls,html){var e=document.createElement(tag);if(cls)e.className=cls;if(html!==undefined)e.innerHTML=html;return e;}
  var SP=['✨','⭐','💫','🌟','💖','🎈'];
  var FX={
    theme:function(i){var t=THEMES[i%THEMES.length];root.style.setProperty('--fxbg',t.bg);root.style.setProperty('--fxc',t.c);return t;},
    burst:function(x,y,n,set){n=n||8;set=set||SP;for(var i=0;i<n;i++){var s=el('span','fx-spk',set[i%set.length]);var a=Math.random()*6.283,d=rnd(40,120);s.style.left=x+'px';s.style.top=y+'px';s.style.setProperty('--dx',Math.cos(a)*d+'px');s.style.setProperty('--dy',Math.sin(a)*d+'px');s.style.fontSize=rnd(16,32)+'px';document.body.appendChild(s);(function(q){setTimeout(function(){q.remove();},950);})(s);}},
    ripple:function(x,y){var r=el('div','fx-rip');r.style.left=x+'px';r.style.top=y+'px';document.body.appendChild(r);setTimeout(function(){r.remove();},700);},
    text:function(x,y,t){var f=el('div','fx-ftx',t);f.style.left=x+'px';f.style.top=y+'px';document.body.appendChild(f);setTimeout(function(){f.remove();},1000);},
    at:function(node,n,set,txt){if(!node)return;var b=node.getBoundingClientRect(),x=b.left+b.width/2,y=b.top+b.height/2;FX.burst(x,y,n||14,set);FX.ripple(x,y);if(txt)FX.text(x,y-30,txt);},
    confetti:function(n){var E=['🎉','⭐','🌟','🎈','✨','🎊','💖','🌈'];for(var i=0;i<n;i++){(function(i){var c=el('div','fx-conf',E[i%E.length]);c.style.left=Math.random()*100+'vw';c.style.animationDelay=(Math.random()*.8)+'s';document.body.appendChild(c);setTimeout(function(){c.remove();},3200);})(i);}},
    fireworks:function(ms){var t0=Date.now();var id=setInterval(function(){FX.burst(rnd(60,innerWidth-60),rnd(60,innerHeight*.65),14,['🎆','✨','⭐','🌟','💥','🎉']);FX.confetti(7);if(Date.now()-t0>ms)clearInterval(id);},380);return id;},
    /* opts: {title, sub, emoji(sticker), medal, stars 0-3, cheer, btn, onNext} */
    celebrate:function(o){
      var st=Math.max(0,Math.min(3,o.stars==null?3:o.stars));
      var stars=[0,1,2].map(function(i){return '<span class="'+(i<st?'':'off')+'" style="animation-delay:'+(1.0+i*.25)+'s">⭐</span>';}).join('');
      var ov=el('div','fx-cele','<div class="fx-rays"></div><div class="fx-cc"><div class="fx-medal">'+(o.medal||'🏅')+'</div><div class="fx-title">'+o.title+'</div>'+(o.sub?'<div class="fx-sub">'+o.sub+'</div>':'')+'<div class="fx-stars">'+stars+'</div><div class="fx-cheer">'+(o.cheer||'Fantastic!')+'</div>'+(o.emoji?'<div class="fx-stk">New sticker: <span style="font-size:34px">'+o.emoji+'</span></div>':'')+'<button class="fx-go">'+(o.btn||'Next ▶')+'</button></div>');
      document.body.appendChild(ov);FX.confetti(40);var fw=FX.fireworks(o.long?5000:3600);
      ov.querySelector('button').onclick=function(){clearInterval(fw);ov.remove();if(o.onNext)o.onNext();};
    },
    init:function(){
      var h=document.querySelector('h1');
      if(h&&!h.querySelector('.fx-rb')){var m=h.textContent.match(/^([^A-Za-z0-9]*)(.*[A-Za-z0-9!?])([^A-Za-z0-9!?]*)$/);if(m)h.innerHTML=m[1]+'<span class="fx-rb">'+m[2]+'</span>'+m[3];}
      var sky=el('div','fxsky');['☁️','🎈','⭐','🦋','🌈','🎈','🐝','🌟','☁️','🎈'].forEach(function(e,i){var x=el('i','',e);x.style.left=(5+i*10)+'%';x.style.fontSize=(28+Math.random()*26)+'px';x.style.animationDuration=(14+Math.random()*14)+'s';x.style.animationDelay=(-Math.random()*20)+'s';sky.appendChild(x);});document.body.appendChild(sky);
      FX.theme(0);
    }
  };
  window.FX=FX;
  document.addEventListener('pointerdown',function(e){var t=e.target;if(t&&t.closest&&t.closest('button,.stage,.item,.bin,.tap-btn,.kb-key,.key')){FX.ripple(e.clientX,e.clientY);FX.burst(e.clientX,e.clientY,4);}},true);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',FX.init);else FX.init();
})();
