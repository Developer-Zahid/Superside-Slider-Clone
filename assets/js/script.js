let slidersCommonOptions = {
    loop: true,
    speed: 700,
    slidesPerView: 3,
    // slidesPerView: "auto",
    // loopAdditionalSlides: 1,
};

let swiperSliderThumbnail = new Swiper('[data-swiper-slider="thumbnail"]', {
    ...slidersCommonOptions,
    direction: "vertical",
    // autoplay: {
    //     delay: 2000,
    //     disableOnInteraction: false,
    // },
    centeredSlides: true,
    slideToClickedSlide: true,
    watchSlidesProgress: true,
    navigation: {
        nextEl: '[data-swiper-navigation="thumbnail-next"]',
        prevEl: '[data-swiper-navigation="thumbnail-prev"]',
    },
});

let swiperSliderPreview = new Swiper('[data-swiper-slider="preview"]', {
    ...slidersCommonOptions,
    // grabCursor: true,
    allowTouchMove: false,
    virtualTranslate: true,
});

swiperSliderPreview.controller.control = swiperSliderThumbnail;
swiperSliderThumbnail.controller.control = swiperSliderPreview;