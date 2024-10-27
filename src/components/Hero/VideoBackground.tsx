import { forwardRef, RefObject, useEffect, useRef, useState } from "react";

export const VideoPlaceholder = () => (
  <div className="absolute inset-0 animate-pulse bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
    <div className="absolute inset-0 bg-black/10" />
  </div>
);

const VideoBackground = (
  { onLoad }: { onLoad?: () => void },
  ref: RefObject<HTMLVideoElement>,
) => {
  const localRef = useRef<HTMLVideoElement>(null);
  const videoRef = ref || localRef;
  const [isLoading, setIsLoading] = useState(true);
  const [videoSource, setVideoSource] = useState({
    webm: "/videos/hero-bg-low.webm",
    mp4: "/videos/hero-bg-low.mp4",
    poster: "/images/hero-bg-poster.jpg",
  });

  useEffect(() => {
    const getVideoSource = () => {
      const isMobile = window.innerWidth < 768;
      const isLowBandwidth =
        "connection" in navigator &&
        ((navigator as any).connection.effectiveType === "3g" ||
          (navigator as any).connection.saveData);

      if (isLowBandwidth) {
        return {
          webm: "/videos/hero-bg-low.webm",
          mp4: "/videos/hero-bg-low.mp4",
          poster: "/images/hero-bg-poster.jpg",
        };
      }

      return isMobile
        ? {
            webm: "/videos/hero-bg-mobile.webm",
            mp4: "/videos/hero-bg-mobile.mp4",
            poster: "/images/hero-bg-poster-mobile.jpg",
          }
        : {
            webm: "/videos/hero-bg.webm",
            mp4: "/videos/hero-bg.mp4",
            poster: "/images/hero-bg-poster.jpg",
          };
    };
    setVideoSource(getVideoSource());

    const preloadVideo = async () => {
      try {
        if (videoRef.current) {
          if (
            !("connection" in navigator) ||
            !(navigator as any).connection.saveData
          ) {
            await videoRef.current.play();
            videoRef.current.pause();
            setIsLoading(false);
            onLoad?.();
          }
        }
      } catch (error) {
        console.error("Video preload failed:", error);
      }
    };

    preloadVideo();
  }, [setVideoSource, onLoad, videoRef]);

  return (
    <>
      {isLoading && <VideoPlaceholder />}
      <video
        ref={videoRef}
        className={`absolute w-full h-full object-cover transition-opacity duration-500 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
        muted
        playsInline
        preload="metadata"
        poster={videoSource.poster}
        aria-hidden="true"
      >
        <source src={videoSource.webm} type="video/webm" />
        <source src={videoSource.mp4} type="video/mp4" />
      </video>
    </>
  );
};

export default forwardRef(VideoBackground);
