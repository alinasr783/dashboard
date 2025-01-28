import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import "../css/productSlider.css";

export default function ProductSlider({ images = [] }) {
  const progressBars = useRef([]);
  const swiperRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  const onAutoplayTimeLeft = (swiper, time, progress) => {
    const activeIndex = swiper.activeIndex;
    progressBars.current.forEach((bar, index) => {
      const progressFill = bar.querySelector(".progress-fill");
      if (index === activeIndex) {
        progressFill.style.setProperty("width", `${(1 - progress) * 100}%`);
      } else if (index < activeIndex) {
        progressFill.style.setProperty("width", "100%");
      } else {
        progressFill.style.setProperty("width", "0%");
      }
    });
  };

  const handlePause = (e) => {
    e.preventDefault();
    if (swiperRef.current && swiperRef.current.autoplay) {
      swiperRef.current.autoplay.stop();
      setIsPaused(true);
    }
  };

  const handleResume = () => {
    if (swiperRef.current && swiperRef.current.autoplay && isPaused) {
      swiperRef.current.autoplay.start();
      setIsPaused(false);
    }
  };

  const handleNextSlide = () => {
    if (swiperRef.current) swiperRef.current.swiper.slideNext();
  };

  const handlePrevSlide = () => {
    if (swiperRef.current) swiperRef.current.swiper.slidePrev();
  };

  const handleClick = (e) => {
    const { clientX, target } = e;
    const width = target.offsetWidth;
    const halfWidth = width / 2;

    if (clientX > halfWidth) {
      handleNextSlide();
    } else {
      handlePrevSlide();
    }
  };

  if (!images.length) {
    return <div>No images to display.</div>;
  }

  return (
    <div className="instagram-story-container">
      <div className="progress-indicators">
        {images.map((_, index) => (
          <div
            key={index}
            className="progress-bar"
            ref={(el) => (progressBars.current[index] = el)}
          >
            <div className="progress-fill"></div>
          </div>
        ))}
      </div>
      <Swiper
        ref={swiperRef}
        spaceBetween={0}
        centeredSlides={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        onAutoplayTimeLeft={onAutoplayTimeLeft}
        modules={[Autoplay]}
        className="swiper-container"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index} className="story-slide">
            <div className="story-content" onClick={handleClick}>
              <img src={image} alt={`Slide ${index + 1}`} className="story-image" />
              <div
                className="overlay"
                onTouchStart={(e) => handlePause(e)}
                onTouchMove={(e) => e.preventDefault()}
                onTouchEnd={handleResume}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}