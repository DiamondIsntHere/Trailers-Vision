// Blur navigation bar
window.addEventListener("scroll", () => {
  const header = document.querySelector("header");
  if (window.scrollY > 100) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

// Array of image sources for the carousel
const images = [
  "assets/images/gallery/1.png",
  "assets/images/gallery/2.png",
  "assets/images/gallery/3.png",
  "assets/images/gallery/4.png",
  "assets/images/gallery/5.png",
  "assets/images/gallery/6.png",
];

// Variables to keep track of carousel state and drag operations
let currentIndex = 0;
let touchStartX = 0;
let initialTransformX = 0;
let isDragging = false;
let startPos = 0;

// Get references to DOM elements
const carouselTrack = document.querySelector(".carousel-track");
const prevButton = document.querySelector(".carousel-button.prev");
const nextButton = document.querySelector(".carousel-button.next");
const dotsContainer = document.querySelector(".thumbnail-dots-container");
const carouselContainer = document.querySelector(".carousel-container");

let allDots = [];

// Function to dynamically create image elements and their corresponding dots
function populateCarouselAndDots() {
  images.forEach((src, index) => {
    const img = document.createElement("img");
    img.src = src;
    img.alt = `Minecraft Scene ${index + 1}`;
    img.classList.add("carousel-image-item");
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

// Function to update the carousel and display the image at the given index
function showImage(index) {
  const imagesCount = images.length;
  if (index >= imagesCount) {
    currentIndex = 0;
  } else if (index < 0) {
    currentIndex = imagesCount - 1;
  } else {
    currentIndex = index;
  }

  carouselTrack.style.transition = "transform 0.5s ease-in-out";

  const translateValue = -currentIndex * 100;
  carouselTrack.style.transform = `translateX(${translateValue}%)`;

  updateActiveDot();
}

// Functions to navigate to the previous or next image
function prevImage() {
  showImage(currentIndex - 1);
}

function nextImage() {
  showImage(currentIndex + 1);
}

// Function to update the active dot indicator
function updateActiveDot() {
  allDots.forEach((dot, index) => {
    if (index === currentIndex) {
      dot.classList.add("active");
    } else {
      dot.classList.remove("active");
    }
  });
}

// Add event listeners to navigation buttons
prevButton.addEventListener("click", prevImage);
nextButton.addEventListener("click", nextImage);

// Initialize the carousel on page load
window.onload = () => {
  populateCarouselAndDots();
  showImage(currentIndex);
};

// Handle arrow key navigation
document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    prevImage();
  } else if (event.key === "ArrowRight") {
    nextImage();
  }
});

// --- Mouse Drag Functionality ---

// Helper function to get current translateX percentage
function getCarouselCurrentTranslateXPercentage() {
  const style = window.getComputedStyle(carouselTrack);
  const matrix = new DOMMatrixReadOnly(style.transform);
  const carouselContainerWidth = carouselTrack.parentElement.clientWidth;
  return (matrix.m41 / carouselContainerWidth) * 100;
}

// Mouse down event handler for dragging
carouselContainer.addEventListener("mousedown", (event) => {
  if (event.button !== 0) return;

  isDragging = true;
  startPos = event.clientX;
  carouselTrack.style.transition = "none";
  carouselContainer.classList.add("dragging");

  initialTransformX = getCarouselCurrentTranslateXPercentage();

  document.addEventListener("mousemove", mouseMoveHandler);
  document.addEventListener("mouseup", mouseUpHandler);
  event.preventDefault();
});

// Mouse move event handler for dragging
function mouseMoveHandler(event) {
  if (!isDragging) return;

  const currentMouseX = event.clientX;
  const dragDistance = currentMouseX - startPos;
  const carouselContainerWidth = carouselTrack.parentElement.clientWidth;
  const dragPercentage = (dragDistance / carouselContainerWidth) * 100;

  carouselTrack.style.transform = `translateX(${
    initialTransformX + dragPercentage
  }%)`;
}

// Mouse up event handler to determine swipe direction or snap back
function mouseUpHandler(event) {
  if (!isDragging) return;
  isDragging = false;
  carouselContainer.classList.remove("dragging");

  const endPos = event.clientX;
  const swipeDistance = endPos - startPos;
  const swipeThreshold = 50;

  if (swipeDistance > swipeThreshold) {
    showImage(currentIndex - 1);
  } else if (swipeDistance < -swipeThreshold) {
    showImage(currentIndex + 1);
  } else {
    showImage(currentIndex);
  }

  document.removeEventListener("mousemove", mouseMoveHandler);
  document.removeEventListener("mouseup", mouseUpHandler);
}

// --- Touch Swipe Functionality ---

// Touch start event handler for swiping
carouselContainer.addEventListener("touchstart", (event) => {
  touchStartX = event.changedTouches[0].screenX;
  isDragging = true;
  carouselTrack.style.transition = "none";
  carouselContainer.classList.add("dragging");

  initialTransformX = getCarouselCurrentTranslateXPercentage();
});

// Touch move event handler for swiping
carouselContainer.addEventListener("touchmove", (event) => {
  if (!isDragging) return;

  const currentTouchX = event.changedTouches[0].screenX;
  const dragDistance = currentTouchX - touchStartX;
  const carouselContainerWidth = carouselTrack.parentElement.clientWidth;
  const dragPercentage = (dragDistance / carouselContainerWidth) * 100;

  carouselTrack.style.transform = `translateX(${
    initialTransformX + dragPercentage
  }%)`;
  event.preventDefault();
});

// Touch end event handler to determine swipe direction or snap back
carouselContainer.addEventListener("touchend", (event) => {
  if (!isDragging) return;
  isDragging = false;
  carouselContainer.classList.remove("dragging");

  const touchEndX = event.changedTouches[0].screenX;
  const swipeDistance = touchEndX - touchStartX;
  const swipeThreshold = 50;

  if (swipeDistance > swipeThreshold) {
    showImage(currentIndex - 1);
  } else if (swipeDistance < -swipeThreshold) {
    showImage(currentIndex + 1);
  } else {
    showImage(currentIndex);
  }
});

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
