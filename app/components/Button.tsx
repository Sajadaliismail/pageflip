"use client"; // Use this if your component is meant for client-side rendering

import React from "react";
import Tooltip from "./ToolTip";

interface ButtonProps {
  onClick: () => void;
  icon?: React.ElementType;
  style?: React.CSSProperties;
  additionalClasses?: string;
  label: string;
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  icon: Icon,
  style,
  additionalClasses = "",
  label,
}) => {
  return (
    <Tooltip text={label}>
      <button
        onClick={onClick}
        className={`bg-yellow-500 rounded-full md:w-12 md:h-12 h-8 w-8 hover:animate-bounce flex items-center justify-center ${additionalClasses}`}
        style={{ boxShadow: "0 40px 30px rgba(0, 0, 0, 0.8)", ...style }}
      >
        {Icon && <Icon className="text-orange-800" />}
      </button>
    </Tooltip>
  );
};

export default Button;
