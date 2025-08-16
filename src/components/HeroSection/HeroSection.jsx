import React, { useEffect, useRef, useState } from "react";
import "./HeroSection.css";

const Hero = () => {
  const videoRef = useRef(null);
  const videos = ["/videos/video1.mp4"];
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const handleVideoEnd = () => {
    setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch((err) => console.log(err));
    }
  }, [currentVideoIndex]);

  return (
    <section className="hero">
      <video
        ref={videoRef}
        src={videos[currentVideoIndex]}
        autoPlay
        muted
        loop
        playsInline
        onEnded={handleVideoEnd}
        className="hero-video"
      />
      <div className="hero-overlay">
        <div className="hero-content">
          <h1>Maanju Farms Pilani</h1>
          <p>From Our Farm To Your Table – 100% Pure and Organic</p>
          <button
            className="add-to-cart"
            onClick={() => console.log("Buy Now clicked!")}
          >
            Buy Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
