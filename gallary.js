const prevEl = document.querySelector(".prev");
const nextEl = document.querySelector(".next");
const imgEls = document.querySelectorAll("img");
const imageContainerEl = document.querySelector(".image-container");
let currentImg = 1;
let timeout;

prevEl.addEventListener("click", () => {
    clearTimeout(timeout);
    currentImg--;
    updateImg();
});

nextEl.addEventListener("click", () => {
    clearTimeout(timeout);
    currentImg++;
    updateImg();
});

updateImg();

function updateImg() {
    if (currentImg > imgEls.length) {
        currentImg = 1;
    } else if (currentImg < 1) {
        currentImg = imgEls.length;
    }
    imageContainerEl.style.transform = `translateX(-${(currentImg - 1) * 500}px)`;
    timeout = setTimeout(() => {
        currentImg++;
        updateImg();
    }, 8000);
}