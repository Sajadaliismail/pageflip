import { Brush, Check, Plus, Trash2 } from "lucide-react";
import React, { useState } from "react";

export interface NotesInterface {
  addNotes: () => void;
  handleEditNotes: (index: number, content: string) => void;
  handleChangeColor: (index: number, color: string) => void;
  index?: number;
  deleteNotes: (index: number, e: React.MouseEvent<HTMLButtonElement>) => void;
  content: string;
  bgColor: string;
}

const Notes: React.FC<NotesInterface> = ({
  addNotes,
  index = 0,
  deleteNotes,
  handleEditNotes,
  content,
  handleChangeColor,
  bgColor,
}) => {
  const [textcontent, setContent] = useState<string>(content);
  const [textEditing, setTextEditing] = useState<boolean>(false);
  const [colorPalletteOn, setColorPalletteOn] = useState<boolean>(false);
  const [color, setColor] = useState<string>(bgColor);

  const changeColor = (color: string) => {
    setColor(color);
    handleChangeColor(index, color);
  };

  return (
    <div
      style={{ rotate: index % 2 === 0 ? "2deg" : "-2deg" }}
      className={`cursor-pointer  w-36 min-h-36 drop-shadow-xl ${color} p-2 m-2 rounded-lg`}
    >
      <div className="flex flex-row justify-around ">
        <button onClick={addNotes}>
          <Plus strokeWidth={3} />
        </button>
        <button
          onClick={() => {
            setTextEditing(false);
            handleEditNotes(index, textcontent);
          }}
        >
          <Check color={textEditing ? "red" : "black"} strokeWidth={3} />
        </button>
        <button
          onClick={() => {
            setColorPalletteOn((prev) => !prev);
          }}
        >
          <Brush strokeWidth={2.25} />
        </button>
        <button onClick={(e) => deleteNotes(index, e)}>
          <Trash2 strokeWidth={2.25} />
        </button>
      </div>
      <div
        className="flex flex-row justify-around mb-2 shadow-lg"
        style={{ display: colorPalletteOn ? "flex" : "none" }}
      >
        <button
          onClick={() => changeColor("bg-yellow-200")}
          className="w-8 h-6 bg-yellow-200 "
        />
        <button
          onClick={() => changeColor("bg-blue-200")}
          className="w-8 h-6 bg-blue-200 "
        />
        <button
          onClick={() => changeColor("bg-green-200")}
          className="w-8 h-6 bg-green-200 "
        />
        <button
          onClick={() => changeColor("bg-red-200")}
          className="w-8 h-6 bg-red-200 "
        />
        <button
          onClick={() => changeColor("bg-slate-200")}
          className="w-8 h-6 bg-slate-200 "
        />
      </div>
      <textarea
        value={textcontent}
        onChange={(e) => {
          setTextEditing(true);
          setContent(e.target.value);
        }}
        className={`w-full ${color} m-0 focus:outline-none`}
        style={{
          minHeight: "100px",
          resize: "vertical",
          overflowY: "auto",
          scrollbarWidth: "none",
          WebkitAppearance: "none",
          border: "none",
          outline: "none",
          caretColor: "transparent",
        }}
      />
    </div>
  );
};

export default Notes;
