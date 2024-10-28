"use client";

import { Plus } from "lucide-react";
import React, { MouseEvent, useRef, useState } from "react";
import Notes, { NotesInterface } from "./Notes";

interface DraggableDivProps {
  stickyNote: boolean;
}

const DraggableDiv: React.FC<DraggableDivProps> = ({ stickyNote }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 100, y: 100 });
  // eslint-disable-next-line
  const dragItem = useRef<any>(null);
  const [notes, setNotes] = useState<NotesInterface[]>([]);

  const addNotes = () => {
    const newNote: NotesInterface = {
      addNotes,
      deleteNotes,
      index: notes.length + 10,
      content: "",
      handleEditNotes,
      bgColor: "bg-yellow-200",
      handleChangeColor,
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

  const deleteNotes = (idx: number, e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setNotes((prev) =>
      prev.filter((notes) => {
        if (notes.index !== idx) return notes;
      })
    );
  };

  const handleEditNotes = (index: number, content: string) => {
    setNotes((prev) =>
      prev.map((note) => {
        if (note.index === index) {
          return { ...note, content };
        }
        return note;
      })
    );
  };

  const handleChangeColor = (index: number, bgColor: string) => {
    setNotes((prev) =>
      prev.map((note) => {
        if (note.index === index) {
          return { ...note, bgColor };
        }
        return note;
      })
    );
  };
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  if (!stickyNote) return null;
  return (
    <div
      className="flex flex-row flex-wrap pt-10 bg-transparent bg-slate-300  items-start"
      style={{
        zIndex: 1000,
        position: "absolute",
        left: position.x,
        top: position.y,
        width: "35%",
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
        <div
          className="cursor-pointer w-28 h-28 drop-shadow-xl bg-slate-100 bg-transparent p-2 m-2 rounded-lg"
          onClick={addNotes}
        >
          <Plus className="w-24 h-24" />{" "}
        </div>
      ) : (
        notes.map((notes) => (
          <Notes
            key={notes.index}
            index={notes.index}
            addNotes={addNotes}
            deleteNotes={deleteNotes}
            content={notes.content}
            handleEditNotes={handleEditNotes}
            bgColor={notes.bgColor}
            handleChangeColor={handleChangeColor}
          />
        ))
      )}
    </div>
  );
};

export default DraggableDiv;
