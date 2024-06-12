gsap.registerPlugin(EasePack);
gsap.set('#hand',{ opacity: 0 });
const toastClip = document.getElementById("toast-clip");
const toastBtn = document.getElementById("button-trigger");
var isPlaying = false;

toastBtn.addEventListener("mouseover", () => {
  if (isPlaying == false) {
    gsap.to('#knob-main', { duration: 0.2, fill:"#ee5b76" });
    gsap.to('#knob-highlight2', { duration: 0.2, opacity: 0.5 });
    gsap.to('#knob-highlight1', { duration: 0.2, opacity: 0.5 });
  }
});

toastBtn.addEventListener("mouseout", () => {
  if (isPlaying == false) {
    gsap.to('#knob-main', { duration: 0.2, fill:"#ffdd15" });
    gsap.to('#knob-highlight2', { duration: 0.2, opacity: 1 });
    gsap.to('#knob-highlight1', { duration: 0.2, opacity: 1 });
  }
});
toastBtn.addEventListener("click", () => {
  if (isPlaying == false) {
    isPlaying = true;
  
    gsap.set('#knob-main', { fill:"#ee5b76" });
    gsap.set('#knob-highlight2', { opacity: 0.5 });
    gsap.set('#knob-highlight1', { opacity: 0.5 });
    gsap.set('#toast',{ x: 5, y: 0 });
    toastClip.style.clipPath = "url(#clip1)";
    const tl = gsap.timeline({ onComplete: toastAway });
    tl.to('#knob-top', { duration: 0.2, x: -3, repeat:1, yoyo:true, ease: "ease.out"})
      .to('#timer', { delay: 0.3, duration: 2, y: -85, ease: "elastic.inOut(1, 0.75)"},"<")
      .to('#timer', { duration: 1.2, y: 0, ease: "elastic.inOut(1, 0.75)"})
      .to('#hand', { duration: 0.5, opacity:0, ease: "ease.out"}, "<")
      .to('#toast', { duration: 2, y: -400, ease: "elastic.out(1, 0.5)"},"< -0.8")
      .to('#flash1', { duration: 0.2, opacity: 0.8, repeat:1, yoyo:true, ease: "ease.out"},"<")
      .from('#right-arm', { transformOrigin: '100% 100%', duration: 1, rotate: 15, ease: "elastic.inOut(1, 0.75)"},"< ")
      .from('#left-arm', { transformOrigin: '0% 100%', duration: 1, rotate: -15, ease: "elastic.inOut(1, 0.75)"},"< -0.8")
      .to('#sparkles > *', {
        transformOrigin: '50% 50%',
        opacity: 1,
        scale: 0.5,
        ease: "bounce.out",
        stagger: {
          each: 0.15,
          repeat: 1,
          yoyo: true,
        }
      },"<")
      .to('#toast', { delay: 0.2, duration: 0.6, x:60, y: -420, ease: "elastic.out(1, 0.5)"},">");
  }
});

function toastAway() {
 
  toastClip.style.clipPath = "url(#clip2)";
  const tl = gsap.timeline({ onComplete: toastReset });
  tl.to('#toast', { delay: 0.4, duration: 1.6, y: 0, opacity:0, ease: "ease.out"})
    .to('#right-arm', { transformOrigin: '100% 100%', duration: 0.6, rotate: 15, ease: "ease.out"},"<")
    .to('#left-arm', { transformOrigin: '0% 100%', duration: 0.6, rotate: -15, ease: "ease.out"},"<")
    .to('#flash2', { duration: 0.6, opacity: 0.3, repeat:1, yoyo:true, ease: "ease.out"},"<");
}

function toastReset() {
  //banglaText.textContent = "";
  gsap.set('#toast',{ x: 5, y: 0, opacity:1 });
  toastClip.style.clipPath = "url(#clip1)";
  gsap.set('#right-arm', { rotate: 0 });
  gsap.set('#left-arm', { rotate: 0 });
  gsap.to('#knob-main', { fill:"#ffdd15" });
  gsap.to('#knob-highlight2', { duration: 0.2, opacity: 1 });
  gsap.to('#knob-highlight1', { duration: 0.2, opacity: 1 });
  isPlaying = false;
}

function initiate() {
  const tl = gsap.timeline();
  tl.to('#hand', { delay:1, duration: 0.6, opacity:1, ease: "ease.out"})
    .to('#hand', { duration: 2, repeat:-1,  yoyo:true, x: -30, ease: "back.out(1)"})
    .to('#light2', { duration: 1, opacity: 0.6, ease: "rough({ template: none.out, strength: 1, points: 20, taper: 'none', randomize: true, clamp:  false})"}, '<')
    .to('#light1', { delay: 0.5, duration: 1, opacity: 0.9, ease: "rough({ template: none.out, strength: 1, points: 20, taper: 'none', randomize: true, clamp:  false})"}, '<')
  return tl;
}

const main = gsap.timeline();
main.add(initiate());

// console.log(toast.getBBox())
// console.log(toast.getBoundingClientRect())
// ScrubGSAPTimeline(tl);