// Blur navigation bar
window.addEventListener("scroll", () => {
  const header = document.querySelector("header");
  if (window.scrollY > 100) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

const images = [
  "assets/images/gallery/1.png",
  "assets/images/gallery/2.png",
  "assets/images/gallery/3.png",
  "assets/images/gallery/4.png",
  "assets/images/gallery/5.png",
  "assets/images/gallery/6.png",
];

let currentIndex = 0;
let isDragging = false;
let startPos = 0;
let currentTranslate = 0;
let prevTranslate = 0;

const carouselTrack = document.querySelector(".carousel-track");
const prevButton = document.querySelector(".carousel-button.prev");
const nextButton = document.querySelector(".carousel-button.next");
const dotsContainer = document.querySelector(".thumbnail-dots-container");
const carouselContainer = document.querySelector(".carousel-container");

let allDots = [];

// 1. Setup Carousel
function populateCarouselAndDots() {
  images.forEach((src, index) => {
    const img = document.createElement("img");
    img.src = src;
    img.alt = `Minecraft Scene ${index + 1}`;
    img.classList.add("carousel-image-item");

    // STOP THE GLITCH: Disable default browser ghosting/dragging
    img.draggable = false;

    img.onerror = () => {
      img.src = `https://placehold.co/800x450/cccccc/333333?text=Image+${
        index + 1
      }+Not+Found`;
    };
    carouselTrack.appendChild(img);

    const dot = document.createElement("span");
    dot.classList.add("dot");
    dot.dataset.index = index;
    dot.addEventListener("click", () => showImage(index));
    dotsContainer.appendChild(dot);
    allDots.push(dot);
  });
}

// 2. Core Navigation Logic
function showImage(index) {
  const imagesCount = images.length;

  if (index >= imagesCount) currentIndex = 0;
  else if (index < 0) currentIndex = imagesCount - 1;
  else currentIndex = index;

  // Re-enable transition for the snap effect
  carouselTrack.style.transition = "transform 0.4s ease-out";

  currentTranslate = currentIndex * -100;
  prevTranslate = currentTranslate;

  carouselTrack.style.transform = `translateX(${currentTranslate}%)`;
  updateActiveDot();
}

function updateActiveDot() {
  allDots.forEach((dot, i) => {
    dot.classList.toggle("active", i === currentIndex);
  });
}

// 3. Event Listeners for Buttons/Keys
prevButton.addEventListener("click", () => showImage(currentIndex - 1));
nextButton.addEventListener("click", () => showImage(currentIndex + 1));

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") showImage(currentIndex - 1);
  if (e.key === "ArrowRight") showImage(currentIndex + 1);
});

// 4. Drag & Swipe Logic (The "Anti-Glitch" Version)
function getPositionX(event) {
  return event.type.includes("mouse")
    ? event.clientX
    : event.touches[0].clientX;
}

function dragStart(event) {
  // Only left click for mouse
  if (event.type.includes("mouse") && event.button !== 0) return;

  isDragging = true;
  startPos = getPositionX(event);

  // Kill transition so it follows the finger/mouse instantly
  carouselTrack.style.transition = "none";
  carouselContainer.classList.add("dragging");
}

function dragMove(event) {
  if (!isDragging) return;

  const currentPosition = getPositionX(event);
  const diff = currentPosition - startPos;

  // Calculate percentage of movement based on container width
  const dragPercent = (diff / carouselContainer.offsetWidth) * 100;

  currentTranslate = prevTranslate + dragPercent;
  carouselTrack.style.transform = `translateX(${currentTranslate}%)`;
}

function dragEnd() {
  if (!isDragging) return;
  isDragging = false;
  carouselContainer.classList.remove("dragging");

  const movedBy = currentTranslate - prevTranslate;

  // If dragged more than 15% of the slide width, move to next/prev
  if (movedBy < -15) {
    showImage(currentIndex + 1);
  } else if (movedBy > 15) {
    showImage(currentIndex - 1);
  } else {
    // Snap back to current image if didn't drag far enough
    showImage(currentIndex);
  }
}

// Mouse Events
carouselContainer.addEventListener("mousedown", dragStart);
window.addEventListener("mousemove", dragMove);
window.addEventListener("mouseup", dragEnd);

// Touch Events
carouselContainer.addEventListener("touchstart", dragStart, { passive: true });
carouselContainer.addEventListener("touchmove", dragMove, { passive: false });
carouselContainer.addEventListener("touchend", dragEnd);

// Initialize
window.onload = () => {
  populateCarouselAndDots();
  showImage(0);
};

// --- FAQ Functionality ---

// DOMContentLoaded listener for FAQ animations
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".faq-item").forEach((item) => {
    const answer = item.querySelector(".faq-answer");
    const summary = item.querySelector(".faq-question");
    const icon = summary.querySelector(".faq-icon");

    const expandedPaddingTop = "15px";
    const expandedPaddingBottom = "20px";

    answer.style.transition =
      "max-height 0.3s ease-in-out, opacity 0.3s ease-in-out, padding 0.3s ease-in-out";
    icon.style.transition = "transform 0.2s ease";

    // Set initial state for FAQ items
    if (item.open) {
      answer.style.maxHeight = answer.scrollHeight + "px";
      answer.style.opacity = "1";
      answer.style.paddingTop = expandedPaddingTop;
      answer.style.paddingBottom = expandedPaddingBottom;
      icon.style.transform = "translateY(0) rotate(270deg)";
    } else {
      answer.style.maxHeight = "0";
      answer.style.opacity = "0";
      answer.style.paddingTop = "0";
      answer.style.paddingBottom = "0";
      icon.style.transform = "translateY(0) rotate(0deg)";
    }

    // Click listener to toggle FAQ item open/close
    summary.addEventListener("click", (e) => {
      e.preventDefault();

      if (item.open) {
        answer.style.maxHeight = answer.scrollHeight + "px";
        answer.style.opacity = "1";

        setTimeout(() => {
          answer.style.maxHeight = "0";
          answer.style.opacity = "0";
          answer.style.paddingTop = "0";
          answer.style.paddingBottom = "0";
          icon.style.transform = "translateY(0) rotate(0deg)";
        }, 10);

        answer.addEventListener(
          "transitionend",
          function handler() {
            item.open = false;
            answer.removeEventListener("transitionend", handler);
          },
          { once: true }
        );
      } else {
        item.open = true;

        answer.style.paddingTop = expandedPaddingTop;
        answer.style.paddingBottom = expandedPaddingBottom;
        icon.style.transform = "translateY(0) rotate(270deg)";

        setTimeout(() => {
          answer.style.maxHeight = answer.scrollHeight + "px";
          answer.style.opacity = "1";
        }, 10);
      }
    });

    // Listener to reset maxHeight to 'auto' after opening animation
    answer.addEventListener("transitionend", () => {
      if (item.open && answer.style.maxHeight !== "auto") {
        answer.style.maxHeight = "auto";
      }
    });
  });
});
