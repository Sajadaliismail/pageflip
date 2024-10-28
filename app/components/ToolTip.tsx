import React, { Component, useState } from "react";
interface TooltipInterface {
  text: string;
  children: React.ReactNode;
}
const Tooltip: React.FC<TooltipInterface> = ({ text, children }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        className="tooltip-target"
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
      >
        {children}
      </div>
      {visible && (
        <div className="absolute top-10 left-1/2 transform -translate-x-1/2 mb-2 w-max bg-green-900 text-white text-sm py-1 px-2 rounded shadow-lg">
          {text}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
