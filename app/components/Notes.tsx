import { Plus } from "lucide-react";
import React from "react";

export interface NotesInterface {
  key: number;
  content: string;
  addNotes: () => void;
}
const Notes: React.FC<NotesInterface> = ({ key, addNotes, content }) => {
  return (
    <div key={key}>
      <div onClick={addNotes}>
        <Plus />
      </div>
      {content}
    </div>
  );
};

export default Notes;
