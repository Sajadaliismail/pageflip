"use client";

import { Download } from "lucide-react";
import React, { MouseEvent, useEffect, useRef, useState } from "react";

interface DraggableRecorderProps {
  Recorder: boolean;
  audioUrlArray: string[];
  setAudioUrlArray: React.Dispatch<React.SetStateAction<string[]>>;
}

const DraggableRecorder: React.FC<DraggableRecorderProps> = ({
  Recorder,
  audioUrlArray,
  setAudioUrlArray,
}) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: 100,
    y: 100,
  });
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const audioChunksRef = useRef<BlobPart[]>([]);
  // eslint-disable-next-line
  const dragItem = useRef<any>(null);

  const handleMouseDown = (e: MouseEvent) => {
    setIsDragging(true);
    dragItem.current = {
      offsetX: e.clientX - position.x,
      offsetY: e.clientY - position.y,
    };
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - dragItem.current.offsetX;
      const newY = e.clientY - dragItem.current.offsetY;
      setPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
      if (audioStream) {
        audioStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);
  const handleRecording = async () => {
    if (isRecording) {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
    } else {
      setIsRecording(true);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        setAudioStream(stream);
        audioChunksRef.current = [];

        mediaRecorderRef.current = new MediaRecorder(stream);

        mediaRecorderRef.current.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };

        mediaRecorderRef.current.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, {
            type: "audio/webm",
          });
          const audioURL = URL.createObjectURL(audioBlob);
          setAudioUrlArray((prev: string[]) => [...prev, audioURL]);

          setAudioURL(audioURL);
          stream.getTracks().forEach((track) => track.stop());
          mediaRecorderRef.current = null;
        };

        mediaRecorderRef.current.start();
      } catch (err) {
        console.error("Error accessing microphone:", err);
        setError("Error accessing microphone. Please check your permissions.");
        setIsRecording(false);
      }
    }
  };

  if (!Recorder) return null;
  return (
    <div
      className="flex flex-row flex-wrap pt-10 bg-transparent bg-slate-300  items-start"
      style={{
        zIndex: 1000,
        position: "absolute",
        left: position.x,
        top: position.y,
        width: "40%",
        height: "50%",
        overflow: "scroll",
        scrollbarWidth: "none",
        cursor: "grab",
        display: "flex",

        borderRadius: "8px",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
      }}
    >
      <div
        className="h-8 bg-slate-300 absolute top-0 w-full text-center "
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        Click here to move
      </div>

      <div
        style={{ scrollbarWidth: "none" }}
        className={`flex mx-auto  flex-col justify-center items-center ${
          audioUrlArray.length && "bg-slate-500 p-2 rounded-lg overflow-scroll"
        }`}
      >
        <div className="rounded-full flex justify-center items-center bg-black w-[75px] h-[175px]">
          <div className="bg-black w-[152px] h-[152px] rounded-full flex justify-center items-center">
            <div className="bg-white w-36 h-36 rounded-full flex justify-center items-center">
              <div
                className={`${
                  isRecording
                    ? "bg-gradient-to-r from-red-500 via-red-600 to-red-700 w-24 h-24 rounded-full transition-all duration-300  hover:from-red-700 hover:via-red-800 hover:to-red-900"
                    : "bg-gradient-to-r from-blue-200 via-blue-300 to-blue-400 w-24 h-24 rounded-full transition-all duration-300 hover:from-pink-200 hover:via-pink-300 hover:to-blue-400"
                } `}
                style={{ boxShadow: "inset 0 0 10px rgba(0, 0, 0, 0.5)" }}
                onClick={handleRecording}
              ></div>
            </div>
          </div>
        </div>
        <div className="bg-slate-500">
          {audioUrlArray.map((audio, index) => (
            <div key={index} className="flex flex-row my-2 gap-1">
              <audio controls>
                <source src={audio} type="audio/webm" />
                Your browser does not support the audio tag.
              </audio>
              <a
                className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 rounded-2xl w-12 h-12 flex align-middle items-center justify-center"
                download={audio}
                href={audio}
              >
                <Download className="text-white" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DraggableRecorder;
