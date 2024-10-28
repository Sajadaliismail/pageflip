"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import HTMLFlipBook from "react-pageflip";
import Next from "./icons/next.svg";
import Previous from "./icons/previousArrow.svg";
import {
  Bookmark,
  BookMarked,
  FullscreenIcon,
  Lightbulb,
  Pause,
  Play,
  RotateCcw,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import Button from "./components/Button";

export default function Home() {
  const pageLimit = new Array(100).fill(0).map((_, index) => index + 1);
  // eslint-disable-next-line
  const bookRef = useRef<any>(null);
  const [autoplay, setAutoplay] = useState<boolean>(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [spotlight, setSpotLight] = useState<boolean>(false);
  const [bookMark, setBookMark] = useState<null | number>(null);
  const [size, setSize] = useState<{ width: number; height: number }>({
    width: 575,
    height: 700,
  });
  const aspectRatio = 575 / 700;

  const [currentPage, setCurrentPage] = useState<number>(1);
  const spotlightRef = useRef<HTMLDivElement | null>(null);

  const handleMouseMove = (event: MouseEvent) => {
    if (spotlightRef.current) {
      spotlightRef.current.style.left = `${event.clientX - 100}px`;
      spotlightRef.current.style.top = `${event.clientY - 100}px`;
    }
  };

  const handleNext = () => {
    if (bookRef.current) {
      bookRef.current.pageFlip().flipNext();
    }
  };

  const handlePrev = () => {
    if (bookRef.current) {
      bookRef.current.pageFlip().flipPrev();
    }
  };

  const handleZoomIn = () => {
    setSize((prev) => {
      const newWidth = prev.width + 50;
      const newHeight = newWidth / aspectRatio;
      return {
        width: newWidth,
        height: newHeight,
      };
    });
  };

  const handleResetView = () => {
    setSize({ height: 700, width: 575 });
  };

  const handleZoomOut = () => {
    setSize((prev) => {
      const newWidth = Math.max(prev.width - 50, 100);
      const newHeight = newWidth / aspectRatio;
      return {
        width: newWidth,
        height: newHeight,
      };
    });
  };

  const handleAuto = () => {
    if (!autoplay) {
      setAutoplay(true);
      intervalRef.current = setInterval(() => {
        handleNext();
      }, 3000);
    } else {
      if (intervalRef?.current) clearInterval(intervalRef?.current);
      setAutoplay(false);
    }
  };

  const flipToPage = () => {
    if (bookMark) {
      bookRef.current.pageFlip().flip(bookMark);
    }
  };

  const handleSpotlight = () => {
    setSpotLight((prev) => !prev);
  };

  const handleBookMark = () => {
    setBookMark(currentPage);
  };
  const handleFullscreenToggle = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(
          `Error attempting to enable full-screen mode: ${err.message} (${err.name})`
        );
      });
    } else {
      document.exitFullscreen();
    }
  };
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (bookRef.current) {
      bookRef.current.pageFlip()?.flip(currentPage);
    }
  }, [size]);

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      if (intervalRef?.current) clearInterval(intervalRef?.current);
    };
  }, []);

  return (
    <>
      <div
        className="h-[100vh] items-center flex flex-col overflow-scroll p-5 relative"
        style={{ scrollbarWidth: "none" }}
      >
        <Button
          additionalClasses="absolute w-50 top-10 left-10"
          onClick={handleBookMark}
          icon={Bookmark}
        />

        <div
          ref={spotlightRef}
          className="spotlight"
          style={{
            zIndex: 1000,
            width: "300px",
            height: "300px",
            backgroundColor: "transparent",
            display: spotlight ? "block" : "none",
          }}
        ></div>
        <div
          className="relative mx-auto flex justify-center "
          style={{ width: size.width * 2 }}
        >
          <HTMLFlipBook
            startZIndex={10}
            flippingTime={1000}
            swipeDistance={5}
            useMouseEvents={true}
            usePortrait={true}
            onChangeState={(e) => console.log(e, "onchange")}
            onChangeOrientation={(e) => console.log(e, "onorientation")}
            onInit={(e) => console.log(e, "oninit")}
            onUpdate={(e) => console.log(e, "onupdate")}
            autoSize={true}
            style={{}}
            clickEventForward={true}
            disableFlipByClick={false}
            maxHeight={1000}
            maxWidth={1000}
            minHeight={400}
            minWidth={275}
            startPage={currentPage}
            className="shadow-2xl rounded-md relative w-full"
            key={`${size.height} ${size.width}`}
            drawShadow={true}
            ref={bookRef}
            width={size.width}
            height={size.height}
            showCover={true}
            size="fixed"
            maxShadowOpacity={0.5}
            mobileScrollSupport={true}
            showPageCorners={true}
            onFlip={(e) => setCurrentPage(e.data)}
          >
            {pageLimit.map((page) => (
              <div key={page} className="h-full w-full">
                <Image
                  src={`https://iameonline.com/books/class-1/bubbles-class-1-sem-2/pages/${page}.jpg`}
                  alt={`Page ${page}`}
                  width={size.width}
                  height={size.height}
                  priority={true}
                  className="bg-cover bg-center h-full w-full"
                />
              </div>
            ))}
          </HTMLFlipBook>
          {currentPage > 0 && (
            <button onClick={handlePrev}>
              <Image
                className="absolute -left-14 bottom-2/4 hover:scale-110"
                src={Previous}
                width={70}
                height={70}
                alt="Previous"
              ></Image>
            </button>
          )}
          <button onClick={handleNext}>
            <Image
              className="absolute -right-14 bottom-2/4 hover:scale-110"
              src={Next}
              width={70}
              height={70}
              alt="next"
            ></Image>
          </button>
        </div>
      </div>
      <div className="absolute bottom-0 z-10 w-full">
        <div className=" h-14 w-[1200px] relative mx-auto ">
          <div
            className="absolute bottom-6 left-0 h-20 w-full bg-[#182d06]  shadow-2xl"
            style={{ clipPath: "polygon(9% 2%, 91% 2%, 101% 100%, -1% 100%)" }}
          ></div>

          <div
            className="absolute bottom-8 left-0 h-20 w-full bg-[#2d5906] flex flex-row justify-center gap-4 py-2"
            style={{ clipPath: "polygon(10% 0, 90% 0, 100% 100%, 0 100%)" }}
          >
            <Button onClick={handleAuto} icon={autoplay ? Pause : Play} />
            <Button onClick={handleZoomIn} icon={ZoomIn} />
            <Button onClick={handleZoomOut} icon={ZoomOut} />
            <Button onClick={handleResetView} icon={RotateCcw} />
            <Button onClick={flipToPage} icon={BookMarked} />
            <Button onClick={handleSpotlight} icon={Lightbulb} />
            <Button onClick={handleFullscreenToggle} icon={FullscreenIcon} />
          </div>
        </div>
      </div>
    </>
  );
}
