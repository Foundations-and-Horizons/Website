"use client";
import {useEffect} from "react";

export default function SiteMotion(){
  useEffect(()=>{
    const els=[...document.querySelectorAll("main section > div, main .fh-card, main article")];
    els.forEach((el,i)=>{el.classList.add("fh-reveal");(el as HTMLElement).style.setProperty("--reveal-delay",String((i%4)*55)+"ms")});
    const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("fh-seen");io.unobserve(e.target)}}),{threshold:.08,rootMargin:"0px 0px -6% 0px"});
    els.forEach(el=>io.observe(el));
    const onScroll=()=>document.documentElement.style.setProperty("--scroll",String(window.scrollY));
    onScroll();window.addEventListener("scroll",onScroll,{passive:true});
    return()=>{io.disconnect();window.removeEventListener("scroll",onScroll)};
  },[]);
  return <div className="fh-progress" aria-hidden="true"/>;
}
