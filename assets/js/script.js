const slideChangeSpeed = 700;
const autoplayDelay = 3000;
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
	});

	swiperPreview = new Swiper('[data-swiper-slider="preview"]', {
		...slidersCommonOptions,
        virtualTranslate: true,
        allowTouchMove: false,
	});

	swiperPreview.controller.control = swiperThumbnail;
	swiperThumbnail.controller.control = swiperPreview;
}

initSwipers();
largeScreenSize.addEventListener("change", initSwipers);