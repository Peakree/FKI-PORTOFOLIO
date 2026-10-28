(function(){
  var swTh=0,swingKick=null;
  var root=document.documentElement;
  try{var t=localStorage.getItem("theme");if(t)root.setAttribute("data-theme",t)}catch(e){}
  document.getElementById("theme").onclick=function(){
    var cur=root.getAttribute("data-theme");
    var dark=cur?cur==="dark":matchMedia("(prefers-color-scheme:dark)").matches;
    var n=dark?"light":"dark";root.setAttribute("data-theme",n);
    try{localStorage.setItem("theme",n)}catch(e){}
  };
  document.getElementById("yr").textContent=new Date().getFullYear();
  function count(el){
    var n=+el.dataset.n,s=el.dataset.s||"",st=null;
    function step(ts){st=st||ts;var p=Math.min((ts-st)/1200,1);el.textContent=Math.round(n*p)+(p===1?s:"");if(p<1)requestAnimationFrame(step)}
    requestAnimationFrame(step);
  }
  function reveal(el){el.classList.add("in");if(el.id==="swing"&&swingKick)swingKick();el.querySelectorAll("[data-n]").forEach(count)}
  var els=document.querySelectorAll(".rv");
  var nav=document.getElementById("nav"),links=document.querySelectorAll(".nav a");
  function setActive(id){
    links.forEach(function(l){
      var on=l.getAttribute("href")==="#"+id;l.classList.toggle("on",on);
      if(on&&nav.scrollWidth>nav.clientWidth){nav.scrollTo({left:l.offsetLeft-(nav.clientWidth-l.offsetWidth)/2,behavior:"smooth"})}
    });
  }
  if("IntersectionObserver" in window){
    var io=new IntersectionObserver(function(en){en.forEach(function(x){if(x.isIntersecting){reveal(x.target);io.unobserve(x.target)}})},{threshold:.1});
    els.forEach(function(e){io.observe(e)});
    var so=new IntersectionObserver(function(en){en.forEach(function(x){if(x.isIntersecting)setActive(x.target.id)})},{rootMargin:"-45% 0px -50% 0px"});
    document.querySelectorAll("section").forEach(function(s){so.observe(s)});
  }else{els.forEach(reveal)}
  document.querySelectorAll(".avatar img").forEach(function(im){
    var ok=function(){im.classList.add("ok")},bad=function(){im.remove()};
    if(im.complete){im.naturalWidth?ok():bad()}else{im.addEventListener("load",ok);im.addEventListener("error",bad)}
  });
  /* kotak kursor: kotak mengikuti kursor, teks di dalamnya berbalik warna */
  (function(){
    var hero=document.getElementById("home");if(!hero)return;
    var box=hero.querySelector(".box"),inv=hero.querySelector(".inv"),inner=hero.querySelector(".hero-inner");
    if(matchMedia("(prefers-reduced-motion:reduce)").matches){box.style.display="none";inv.style.display="none";return}
    var cl=inner.cloneNode(true);
    cl.querySelectorAll("[id]").forEach(function(e){e.removeAttribute("id")});
    cl.querySelectorAll("a,button").forEach(function(e){e.setAttribute("tabindex","-1")});
    inv.appendChild(cl);
    var W=0,H=0,tx=0,ty=0,cx=0,cy=0,last=0,prev=0,vis=false,raf=0,init=false;
    function tick(now){
      raf=0;if(!vis){prev=0;return}
      var dt=prev?Math.min((now-prev)/1000,.05):.016;prev=now;
      var r=hero.getBoundingClientRect(),S=box.offsetWidth;W=r.width;H=r.height;
      if(!init){cx=tx=W*.3;cy=ty=H*.45;init=true}
      if(now-last>3500){var a=now*.0006;tx=W*(.5+.3*Math.cos(a));ty=H*(.42+.16*Math.sin(a*1.7))}
      var k=1-Math.exp(-dt/.17);cx+=(tx-cx)*k;cy+=(ty-cy)*k;
      var l=cx-S/2,t=cy-S/2,rr=l+S,bb=t+S;
      box.style.transform="translate3d("+l+"px,"+t+"px,0)";
      inv.style.clipPath="polygon("+l+"px "+t+"px,"+rr+"px "+t+"px,"+rr+"px "+bb+"px,"+l+"px "+bb+"px)";
      raf=requestAnimationFrame(tick);
    }
    function run(){if(!raf&&vis)raf=requestAnimationFrame(tick)}
    var away=false;
    function setAway(v){if(v!==away){away=v;hero.classList.toggle("away",v)}}
    hero.addEventListener("pointerover",function(e){setAway(!!(e.target.closest&&e.target.closest(".cta,.avatar,.sticker,.paper")))});
    hero.addEventListener("pointerleave",function(){setAway(false)});
    hero.addEventListener("pointermove",function(e){
      var r=hero.getBoundingClientRect();tx=e.clientX-r.left;ty=e.clientY-r.top;last=performance.now();
    });
    if("IntersectionObserver" in window){
      new IntersectionObserver(function(en){vis=en[0].isIntersecting;run()}).observe(hero);
    }else{vis=true;run()}
    function onScroll(){hero.classList.toggle("scrolled",scrollY>Math.max(80,innerHeight*.08))}
    addEventListener("scroll",onScroll,{passive:true});onScroll();
    setTimeout(function(){hero.classList.add("live")},900);
  })();
  var at=document.querySelector(".about-text");
  if(at){
    var gl=["var(--acc)","var(--acc2)","#F5B942"],k=0;
    var wrap=function(n){Array.prototype.slice.call(n.childNodes).forEach(function(c){
      if(c.nodeType===3){
        var f=document.createDocumentFragment();
        c.textContent.split(/(\s+)/).forEach(function(p){
          if(!p)return;
          if(/^\s+$/.test(p)){f.appendChild(document.createTextNode(p))}
          else{var s=document.createElement("span");s.className="w";s.style.setProperty("--g",gl[k++%3]);s.textContent=p;f.appendChild(s)}
        });
        n.replaceChild(f,c);
      }else if(c.nodeType===1){wrap(c)}
    })};
    at.querySelectorAll("p").forEach(wrap);
    var glow=function(e){var r=at.getBoundingClientRect(),dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2),c=Math.cos(swTh),s=Math.sin(swTh);at.style.setProperty("--mx",(at.offsetWidth/2+dx*c+dy*s)+"px");at.style.setProperty("--my",(at.offsetHeight/2-dx*s+dy*c)+"px")};
    at.addEventListener("pointermove",glow);at.addEventListener("pointerdown",glow);
  }
  /* kartu "Tentang" menggantung di tali: bisa ditarik, diayun, dan dilempar */
  (function(){
    var sw=document.getElementById("swing");if(!sw)return;
    var nail=sw.querySelector(".nail"),K=22,C=1.5,MAXA=1.25,th=0,om=0,drag=false,raf=0,prev=0,phi0=0,pt=0;
    function apply(){sw.style.rotate=(th*57.29578)+"deg"}
    function ang(e){var r=nail.getBoundingClientRect();return Math.atan2(-(e.clientX-(r.left+r.width/2)),e.clientY-(r.top+r.height/2))}
    function wrap(a){while(a>Math.PI)a-=2*Math.PI;while(a<-Math.PI)a+=2*Math.PI;return a}
    function loop(ts){
      var dt=prev?Math.min((ts-prev)/1000,.04):.016;prev=ts;
      if(!drag){
        var n=2,h=dt/n;
        for(var i=0;i<n;i++){om+=(-K*Math.sin(th)-C*om)*h;th+=om*h}
        if(th>MAXA){th=MAXA;om=-Math.abs(om)*.4}else if(th<-MAXA){th=-MAXA;om=Math.abs(om)*.4}
        apply();
        if(Math.abs(th)<.0008&&Math.abs(om)<.01){th=om=0;apply();raf=0;prev=0;return}
      }
      raf=requestAnimationFrame(loop);
    }
    function go(){if(!raf){prev=0;raf=requestAnimationFrame(loop)}}
    function release(){
      if(!drag)return;drag=false;sw.classList.remove("dragging");
      if(performance.now()-pt>90)om=0;
      om=Math.max(-14,Math.min(14,om));go();
    }
    sw.addEventListener("pointerdown",function(e){
      if(e.button>0)return;
      drag=true;sw.classList.add("dragging");
      try{sw.setPointerCapture(e.pointerId)}catch(x){}
      if(raf){cancelAnimationFrame(raf);raf=0}
      phi0=ang(e)-th;om=0;pt=performance.now();
    });
    sw.addEventListener("pointermove",function(e){
      if(drag){
        var t=Math.max(-MAXA,Math.min(MAXA,wrap(ang(e)-phi0))),now=performance.now(),dt=Math.max((now-pt)/1000,.001);
        om=om*.6+((t-th)/dt)*.4;th=t;pt=now;apply();return;
      }
      if(e.pointerType!=="mouse"||Math.abs(e.movementX)<2)return;
      om=Math.max(-3,Math.min(3,om-e.movementX*.0035));go();
    });
    sw.addEventListener("pointerup",release);
    sw.addEventListener("pointercancel",release);
    sw.addEventListener("lostpointercapture",release);
    if(!matchMedia("(prefers-reduced-motion:reduce)").matches){swingKick=function(){th=.26;om=0;apply();go()}}
  })();
  var ai=document.getElementById("aboutimg");
  if(ai){
    var aok=function(){ai.classList.add("ok");ai.parentNode.classList.add("has-img")},abad=function(){ai.remove()};
    if(ai.complete){ai.naturalWidth?aok():abad()}else{ai.addEventListener("load",aok);ai.addEventListener("error",abad)}
  }
  /* sorotan emas/warna yang mengikuti kursor di kartu pengalaman & proyek */
  document.querySelectorAll(".exp,.card").forEach(function(c){
    c.addEventListener("pointermove",function(e){var r=c.getBoundingClientRect();c.style.setProperty("--mx",(e.clientX-r.left)+"px");c.style.setProperty("--my",(e.clientY-r.top)+"px")});
  });
  /* klik skill -> kartu penjelasan, halaman belakang di-blur */
  (function(){
    var m=document.getElementById("modal");if(!m)return;
    var mc=document.getElementById("mc"),mt=document.getElementById("mt"),md=document.getElementById("md"),ml=document.getElementById("ml"),mx=document.getElementById("mx"),from=null;
    function open(li){
      var col=li.closest(".skills>div"),h=col&&col.querySelector("h3");
      from=li;mc.textContent=h?h.textContent:"";mt.textContent=li.textContent.trim();md.textContent=li.getAttribute("data-desc")||"";
      ml.style.width="0";m.classList.add("open");m.setAttribute("aria-hidden","false");document.documentElement.style.overflow="hidden";
      requestAnimationFrame(function(){requestAnimationFrame(function(){ml.style.width=(li.getAttribute("data-lvl")||70)+"%"})});
      mx.focus();
    }
    function close(){
      if(!m.classList.contains("open"))return;
      m.classList.remove("open");m.setAttribute("aria-hidden","true");document.documentElement.style.overflow="";ml.style.width="0";
      if(from)from.focus();
    }
    document.querySelectorAll(".skills li").forEach(function(li){
      li.tabIndex=0;li.setAttribute("role","button");
      li.addEventListener("click",function(){open(li)});
      li.addEventListener("keydown",function(e){if(e.key==="Enter"||e.key===" "){e.preventDefault();open(li)}});
    });
    m.addEventListener("click",function(e){if(e.target===m)close()});
    mx.addEventListener("click",close);
    addEventListener("keydown",function(e){if(e.key==="Escape")close()});
  })();
  var up=document.getElementById("up");
  addEventListener("scroll",function(){up.classList.toggle("show",scrollY>700)},{passive:true});
  up.onclick=function(){scrollTo({top:0,behavior:"smooth"})};
})();
