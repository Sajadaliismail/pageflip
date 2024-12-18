"use client";

import React, { MouseEvent, useEffect, useRef, useState } from "react";

interface DraggableAnnotationProps {
  annotations: boolean;
}

const DraggableAnnotation: React.FC<DraggableAnnotationProps> = ({
  annotations,
}) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: 100,
    y: 100,
  });

  // eslint-disable-next-line
  const dragItem = useRef<any>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(5);
  const [brushShape, setBrushShape] = useState<"round" | "square">("round");

  const startDrawing = (e: MouseEvent) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  };

  const draw = (e: MouseEvent) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.stroke();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.lineJoin = "round";
    ctx.lineCap = brushShape;
  }, []);

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

  if (!annotations) return null;
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
      <div className="flex flex-col items-center">
        <div className="flex flex-row justify-evenly w-full">
          <input
            type="range"
            min={1}
            max={25}
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
          ></input>
          <input
            type="color"
            value={color}
            onChange={handleColorChange}
            className="mb-2"
          />
          <button
            className="bg-slate-300 px-2 rounded-md"
            onClick={clearCanvas}
          >
            Clear
          </button>
          <button
            className="bg-slate-300 px-2 rounded-md"
            onClick={() => setBrushShape("square")}
          >
            Square
          </button>
          <button
            className="bg-slate-300 px-2 rounded-md"
            onClick={() => setBrushShape("round")}
          >
            Round
          </button>
        </div>
        <canvas
          ref={canvasRef}
          width={630}
          height={280}
          className="border border-gray-400"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
      </div>
    </div>
  );
};

export default DraggableAnnotation;
