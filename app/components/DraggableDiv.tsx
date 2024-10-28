"use client";

import { Plus } from "lucide-react";
import React, { Component, MouseEvent, useRef, useState } from "react";
import Notes, { NotesInterface } from "./Notes";

interface DraggableDivProps {
  stickyNote: boolean;
}

const DraggableDiv: React.FC<DraggableDivProps> = ({ stickyNote }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const dragItem = useRef<any>(null);
  const [notes, setNotes] = useState<NotesInterface[]>([]);

  const addNotes = () => {
    const newNote: NotesInterface = {
      key: notes.length + 1,
      content: `Note ${notes.length + 1}`,
      addNotes: addNotes,
    };
    setNotes((prev) => [...prev, newNote]);
  };

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
  if (!stickyNote) return null;
  return (
    <div
      className="flex flex-row flex-wrap pt-10"
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
      {notes.length == 0 ? (
        <div className="cursor-pointer" onClick={addNotes}>
          <Plus className="w-24 h-24" />{" "}
        </div>
      ) : (
        notes.map((notes, idx) => (
          <Notes content={notes.content} key={notes.key} addNotes={addNotes} />
        ))
      )}
    </div>
  );
};

export default DraggableDiv;
