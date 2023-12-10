import { useState, useCallback, ReactNode } from "react";

type Place = "top" | "right" | "bottom" | "left";

function Tooltip({
  title,
  children,
  place = "left",
}: {
  title: string;
  children: ReactNode;
  place?: Place;
}) {
  const [visible, setVisible] = useState(false);
  const tooltipTrigger = () => setVisible(!visible);
  const getVisibility = () => (visible ? "inline-block" : "hidden");
  const getPlacement = () => {
    const places = {
      top: "bottom-10 mb-1",
      bottom: "top-10 mt-1",
      left: "left-11 ml-4 top-0",
      right: "right-11 ml-4 top-0",
    };
    return places[place];
  };

  return (
    <div
      className="relative"
      onMouseEnter={tooltipTrigger}
      onMouseLeave={tooltipTrigger}
    >
      {children}
      <div
        className={`${getVisibility()} ${getPlacement()} bg-gray-700 p-1 text-sm text-gray-100 rounded-md absolute`}
      >
        {title}
      </div>
    </div>
  );
}

export default Tooltip;
