"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import HTMLFlipBook from "react-pageflip";
import Next from "./icons/share-arrow.png";
import Previous from "./icons/share-prev.png";
import {
  Bookmark,
  BookMarked,
  FullscreenIcon,
  Lightbulb,
  Pause,
  Play,
  RotateCcw,
  StickyNote,
  ZoomIn,
  ZoomOut,
  Mic,
  HomeIcon,
  TableOfContents,
  SquarePen,
  Search,
} from "lucide-react";
import Button from "./components/Button";
import DraggableDiv from "./components/DraggableDiv";
import DraggableRecorder from "./components/DraggableRecorder";
import DraggableAnnotation from "./components/DraggableAnnotations";

export default function Home() {
  const pageLimit = new Array(100).fill(0).map((_, index) => index + 1);
  // eslint-disable-next-line
  const bookRef = useRef<any>(null);
  const [autoplay, setAutoplay] = useState<boolean>(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [spotlight, setSpotLight] = useState<boolean>(false);
  const [bookMark, setBookMark] = useState<null | number>(null);
  const [stickyNote, setStickyNote] = useState<boolean>(false);
  const [recorder, setRecorder] = useState<boolean>(false);
  const [annotations, setAnnotations] = useState<boolean>(false);
  const [audioUrlArray, setAudioUrlArray] = useState<string[]>([]);
  const [pageSearch, setPageSearch] = useState<number | string>("");
  const [size, setSize] = useState<{ width: number; height: number }>({
    width: 475,
    height: 580,
  });
  const aspectRatio = 475 / 580;

  const [currentPage, setCurrentPage] = useState<number>(1);
  const spotlightRef = useRef<HTMLDivElement | null>(null);
  /* eslint-disable react-hooks/exhaustive-deps */

  useEffect(() => {
    const innerWidth = window.innerWidth;

    if (innerWidth < size.width) {
      const calculatedWidth = innerWidth * 0.4;

      const calculatedHeight = calculatedWidth / aspectRatio;

      setSize({
        width: calculatedWidth,
        height: calculatedHeight,
      });
    }
  }, []);

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
    setSize({ height: 580, width: 475 });
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

  const goToPage = async (page: number) => {
    await bookRef.current.pageFlip().flip(page);
  };

  const toggleStickyNote = () => {
    setStickyNote((prev) => !prev);
  };
  const toggleAnnotations = () => {
    setAnnotations((prev) => !prev);
  };
  const toggleRecorder = () => {
    setRecorder((prev) => !prev);
  };
  const handleSpotlight = () => {
    setSpotLight((prev) => !prev);
  };

  const handleSearch = async () => {
    if (!pageSearch) return null;
    if (isNaN(Number(pageSearch))) return null;
    goToPage(Number(pageSearch)).then(() => {
      setTimeout(() => {
        setPageSearch("");
      }, 1000);
    });
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
        className="h-[100vh] items-center flex flex-col overflow-scroll p-5 relative w-[100vw]"
        style={{ scrollbarWidth: "none" }}
      >
        <Button
          additionalClasses="absolute top-10 w-50 md:right-[500px]"
          onClick={handleBookMark}
          icon={Bookmark}
          label="Bookmark"
        />

        <div
          ref={spotlightRef}
          className="spotlight"
          style={{
            zIndex: 500,
            width: "300px",
            height: "300px",
            backgroundColor: "transparent",
            display: spotlight ? "block" : "none",
          }}
        ></div>
        <DraggableDiv stickyNote={stickyNote}></DraggableDiv>
        <DraggableRecorder
          Recorder={recorder}
          audioUrlArray={audioUrlArray}
          setAudioUrlArray={setAudioUrlArray}
        ></DraggableRecorder>
        <DraggableAnnotation annotations={annotations}></DraggableAnnotation>
        <div
          className="relative mx-auto flex justify-center my-auto rounded-lg"
          style={{ width: size.width * 2 }}
        >
          <HTMLFlipBook
            startZIndex={10}
            flippingTime={900}
            swipeDistance={5}
            useMouseEvents={true}
            usePortrait={true}
            onChangeState={() => null}
            onChangeOrientation={() => null}
            onInit={() => null}
            onUpdate={() => null}
            autoSize={true}
            style={{}}
            clickEventForward={true}
            disableFlipByClick={false}
            maxHeight={1000}
            maxWidth={1000}
            minHeight={400}
            minWidth={275}
            width={size.width}
            height={size.height}
            startPage={currentPage}
            className="shadow-2xl rounded-lg relative w-full"
            key={`${size.height} ${size.width}`}
            drawShadow={true}
            ref={bookRef}
            showCover={true}
            size="fixed"
            maxShadowOpacity={0.5}
            mobileScrollSupport={true}
            showPageCorners={true}
            onFlip={(e) => setCurrentPage(e.data)}
          >
            {pageLimit.map((page) => (
              <div key={page} className="h-full w-full rounded-md">
                <Image
                  src={`https://picsum.photos/400/600?id=${page}`}
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
                className="absolute -left-14 bottom-2/4 hover:scale-110 rounded-md"
                src={Previous}
                width={size.width / 5}
                height={size.width / 5}
                alt="Previous"
              ></Image>
            </button>
          )}
          {currentPage < pageLimit.length - 1 && (
            <button onClick={handleNext}>
              <Image
                className="absolute -right-14 bottom-2/4 hover:scale-110"
                src={Next}
                width={size.width / 5}
                height={size.width / 5}
                alt="next"
              ></Image>
            </button>
          )}
        </div>
      </div>
      <div className="absolute bottom-0 z-10 w-full" style={{ zIndex: 1000 }}>
        <div className=" h-14 w-full md:w-[800px] relative mx-auto ">
          <div
            className="absolute bottom-6 left-0 h-20 w-full bg-[#182d06]  shadow-2xl"
            style={{ clipPath: "polygon(9% 2%, 91% 2%, 101% 100%, -1% 100%)" }}
          ></div>

          <div
            className="absolute bottom-8 left-0 h-20 w-full bg-[#2d5906] flex flex-row justify-center md:gap-2 py-2"
            style={{ clipPath: "polygon(10% 0, 90% 0, 100% 100%, 0 100%)" }}
          >
            <Button
              label={"Autoplay"}
              onClick={handleAuto}
              icon={autoplay ? Pause : Play}
            />
            <Button label={"Zoom In"} onClick={handleZoomIn} icon={ZoomIn} />
            <Button label={"Zoom Out"} onClick={handleZoomOut} icon={ZoomOut} />
            <Button
              label={"Reset view"}
              onClick={handleResetView}
              icon={RotateCcw}
            />
            <Button
              label={"Home page"}
              onClick={() => goToPage(0)}
              icon={HomeIcon}
            />
            <Button
              label={"Contents"}
              onClick={() => goToPage(3)}
              icon={TableOfContents}
            />
            <Button
              label={"Bookmarked"}
              onClick={flipToPage}
              icon={BookMarked}
            />
            <Button
              label={"Spotlight"}
              onClick={handleSpotlight}
              icon={Lightbulb}
            />
            <Button
              label={"Fullscreen"}
              onClick={handleFullscreenToggle}
              icon={FullscreenIcon}
            />
            <Button
              label={"Sticky notes"}
              onClick={toggleStickyNote}
              icon={StickyNote}
            />
            <Button
              label={"Annotations"}
              onClick={toggleAnnotations}
              icon={SquarePen}
            />
            <Button label={"Recording"} onClick={toggleRecorder} icon={Mic} />
          </div>
        </div>
        <div className="absolute right-36 bottom-8 flex">
          <input
            type="text"
            className="border rounded-l-full  w-20 h-8 px-2 "
            value={pageSearch}
            onChange={(e) => setPageSearch(e.target.value)}
            style={{ outline: "none", border: "none" }}
            placeholder={`${currentPage - 1} - ${currentPage}`}
          />
          <button
            className={`bg-yellow-500 rounded-r-full w-12 h-8  flex items-center justify-center`}
            style={{ boxShadow: "0 40px 30px rgba(0, 0, 0, 0.8)" }}
            onClick={handleSearch}
          >
            <Search className="text-orange-800" />
          </button>
        </div>
      </div>
    </>
  );
}
