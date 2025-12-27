const sliderParent = document.querySelector('[data-slider="parent"]') || { dataset: {} };
const slideChangeSpeed = (sliderParent.dataset.slideChangeSpeed * 1) || 700;
const autoplayDelay = (sliderParent.dataset.autoplayDelay * 1) || 3000;
const largeScreenSize = window.matchMedia("(min-width: 1100px)");
const totalSlides = document.querySelectorAll('[data-swiper-slider="thumbnail"] .swiper-slide').length || 0;
let swiperThumbnail = null;
let swiperPreview = null;
const slidersCommonOptions = {
	loop: true,
	loopAdditionalSlides: totalSlides,
	speed: slideChangeSpeed,
	slidesPerView: 3,
	breakpoints: {
		450: {
			slidesPerView: 5,
		},
		1100: {
			slidesPerView: 3,
		},
	},
};

function destroyExistingSwipers() {
	if (swiperThumbnail instanceof Swiper) {
		swiperThumbnail.destroy(true, true);
		swiperThumbnail = null;
	}
	if (swiperPreview instanceof Swiper) {
		swiperPreview.destroy(true, true);
		swiperPreview = null;
	}
}

function initSwipers() {
	destroyExistingSwipers();

	swiperThumbnail = new Swiper('[data-swiper-slider="thumbnail"]', {
		...slidersCommonOptions,
		centeredSlides: true,
		slideToClickedSlide: true,
		watchSlidesProgress: true,
		direction: largeScreenSize.matches ? "vertical" : "horizontal",
		autoplay: {
			delay: autoplayDelay,
			disableOnInteraction: false,
		},
		navigation: {
			nextEl: '[data-swiper-navigation="thumbnail-next"]',
			prevEl: '[data-swiper-navigation="thumbnail-prev"]',
		},
		on: {
			// 1. Sync the CSS transition duration with Swiper's speed
			setTransition: function (swiper, duration) {
				swiper.slides.forEach((slide) => {
					// Apply transition to slide (for padding/opacity)
					slide.style.transition = `padding ${duration}ms, opacity ${duration}ms`;

					// Apply transition to inner card (for transform/border-radius)
					if(largeScreenSize.matches) {
						const card = slide.querySelector(".thumbnail-card");
						if (card) card.style.transition = `transform ${duration}ms, border-radius ${duration}ms`;
					}
				});
			},
			// 2. Update CSS Variable based on progress
			setTranslate: function (swiper) {
				// Iterate over *all* slides to set their progress
				swiper.slides.forEach((slide) => {
					// 0 = active, 1 = neighbor, 2 = neighbor's neighbor, etc.
					const rawProgress = slide.progress;

					// We clamp it between 0 and 1 because we only care about Active vs Inactive for padding/opacity
					const progress = Math.min(Math.abs(rawProgress), 1);

					// Set the CSS Custom Property for Padding/Opacity
					slide.style.setProperty("--_active-progress", progress);

					// Calculate Y Offset for Outer Neighbors (Desktop/Vertical only)
					if (largeScreenSize.matches) {
						let yOffset = 0;
						const absProgress = Math.abs(rawProgress);
						
						// If we are further out than the immediate neighbor (progress > 1)
						if (absProgress > 1) {
							yOffset = (absProgress - 1) * 20 * Math.sign(rawProgress);
						}
						slide.style.setProperty("--_y-offset", `${yOffset}px`);
					}
				});
			},
		},
	});

	swiperPreview = new Swiper('[data-swiper-slider="preview"]', {
		...slidersCommonOptions,
		virtualTranslate: true,
		// grabCursor: true,
		allowTouchMove: false,
	});

	swiperPreview.controller.control = swiperThumbnail;
	swiperThumbnail.controller.control = swiperPreview;
}

initSwipers();
largeScreenSize.addEventListener("change", initSwipers);
