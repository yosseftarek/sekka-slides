(function(){
  const deck=document.getElementById('deck');
  const scenes=[...document.querySelectorAll('.scene')];
  const bar=document.getElementById('bar');
  const counter=document.getElementById('counter');
  let current=0, locked=false, touchY=0, resizeTimer=null;
  function fit(){
    const marginW=36, marginH=28;
    const scale=Math.min((innerWidth-marginW)/1440,(innerHeight-marginH)/810);
    document.documentElement.style.setProperty('--s', Math.max(0.2, scale).toFixed(4));
    snap(false);
  }
  function update(){
    const pct=((current+1)/scenes.length)*100;
    bar.style.width=pct+'%';
    counter.textContent=String(current+1).padStart(2,'0')+' / '+String(scenes.length).padStart(2,'0');
    document.title='سِكّة Pitch · '+counter.textContent;
  }
  function go(i, smooth=true){
    i=Math.max(0,Math.min(scenes.length-1,i));
    if(i===current && smooth) return;
    current=i; update(); locked=true;
    if(!smooth) deck.classList.add('no-smooth'); else deck.classList.remove('no-smooth');
    scenes[current].scrollIntoView({block:'start',behavior:smooth?'smooth':'auto'});
    setTimeout(()=>{locked=false;deck.classList.remove('no-smooth');}, smooth?640:80);
  }
  function nearest(){return Math.round(deck.scrollTop / Math.max(1, innerHeight));}
  function snap(smooth=true){go(nearest(), smooth)}
  deck.addEventListener('wheel',e=>{e.preventDefault(); if(locked) return; go(current+(e.deltaY>0?1:-1));},{passive:false});
  window.addEventListener('keydown',e=>{const keys=['ArrowDown','PageDown',' ','ArrowRight','ArrowUp','PageUp','ArrowLeft','Home','End']; if(!keys.includes(e.key))return; e.preventDefault(); if(locked)return; if(e.key==='Home')go(0); else if(e.key==='End')go(scenes.length-1); else if(['ArrowDown','PageDown',' ','ArrowRight'].includes(e.key))go(current+1); else go(current-1);});
  deck.addEventListener('touchstart',e=>{touchY=e.changedTouches[0].clientY},{passive:true});
  deck.addEventListener('touchend',e=>{const dy=touchY-e.changedTouches[0].clientY; if(Math.abs(dy)>34&&!locked)go(current+(dy>0?1:-1));},{passive:true});
  document.getElementById('next').onclick=()=>go(current+1); document.getElementById('prev').onclick=()=>go(current-1);
  deck.addEventListener('scroll',()=>{clearTimeout(window.__snapTimer); window.__snapTimer=setTimeout(()=>snap(true),140)});
  addEventListener('resize',()=>{clearTimeout(resizeTimer); resizeTimer=setTimeout(fit,80)});
  fit(); update(); setTimeout(()=>go(0,false),100);
})();
