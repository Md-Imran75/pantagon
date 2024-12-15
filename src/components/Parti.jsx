import React, { useState, useRef, useCallback } from "react";
import { getRandomColor } from "../utils/randomColor";

const Partition = ({ initialColor = getRandomColor(), onDelete, isRoot = false }) => {
  const [isSplit, setIsSplit] = useState(false);
  const [splitType, setSplitType] = useState(null);
  const [childDivs, setChildDivs] = useState([]);

  const handleSplit = useCallback((type) => {
    if (!isSplit) {
      setIsSplit(true);
      setSplitType(type);

      setChildDivs([
        { id: crypto.randomUUID(), color: initialColor, size: 50 },
        { id: crypto.randomUUID(), color: getRandomColor(), size: 50 },
      ]);
    }
  }, [isSplit, initialColor]);

  const handleDelete = useCallback(() => {
    if (onDelete) {
      onDelete();
    }
  }, [onDelete]);

  const handleChildDelete = useCallback((id) => {
    setChildDivs((prev) => {
      const updatedDivs = prev.filter((child) => child.id !== id);

      if (updatedDivs.length === 0) {
        setIsSplit(false);
        setSplitType(null);
      }

      return updatedDivs;
    });
  }, []);

  const handleResize = useCallback((id, delta) => {
    setChildDivs((prev) => {
      const index = prev.findIndex((child) => child.id === id);
      if (index === -1) return prev;

      const updated = [...prev];
      const siblingIndex = index === 0 ? 1 : 0;

      updated[index].size = Math.max(updated[index].size + delta, 10); 
      updated[siblingIndex].size = Math.max(updated[siblingIndex].size - delta, 10);

      return updated;
    });
  }, []);

  return (
    <div
      className={`flex ${splitType === "horizontal" ? "flex-col" : "flex-row"} w-full h-full border border-white relative`}
      style={{ backgroundColor: initialColor }}
    >
      {isSplit ? (
        childDivs.map((child, index) => (
          <div
            key={child.id}
            className="relative"
            style={
              splitType === "horizontal"
                ? { height: `${child.size}%`, width: "100%" }
                : { width: `${child.size}%`, height: "100%" }
            }
          >
            <Partition
              initialColor={child.color}
              onDelete={() => handleChildDelete(child.id)}
              isRoot={false}
            />

            {/* Resizer */}
            {index === 0 && (
              <div
                className={`absolute ${
                  splitType === "horizontal"
                    ? "bottom-0 left-0 w-full h-2 cursor-row-resize"
                    : "right-0 top-0 h-full w-2 cursor-col-resize"
                } bg-gray-500`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  const start = splitType === "horizontal" ? e.clientY : e.clientX;

                  let delta = 0;

                  const handleMouseMove = (event) => {
                    const current = splitType === "horizontal" ? event.clientY : event.clientX;
                    delta = ((current - start) / (splitType === "horizontal" ? window.innerHeight : window.innerWidth)) * 100;
                  };

                  const handleMouseUp = () => {
                    handleResize(child.id, delta);
                    window.removeEventListener("mousemove", handleMouseMove);
                    window.removeEventListener("mouseup", handleMouseUp);
                  };

                  window.addEventListener("mousemove", handleMouseMove);
                  window.addEventListener("mouseup", handleMouseUp);
                }}
              ></div>
            )}
          </div>
        ))
      ) : (
        <Card  handleDelete={!isRoot ? handleDelete : null} handleSplit={handleSplit} />
      )}
    </div>
  );
};



const Card = ({ handleSplit, handleDelete }) => {
  return (
    <div className="flex flex-row items-center justify-center border-2 border-black w-full h-full">
      <button
        onClick={() => handleSplit("horizontal")}
        className="bg-gray-700 text-white px-4 py-2 m-2 rounded"
      >
        h
      </button>
      <button
        onClick={() => handleSplit("vertical")}
        className="bg-gray-700 text-white px-4 py-2 m-2 rounded"
      >
        v
      </button>
      {handleDelete && (
        <button
          onClick={handleDelete}
          className="bg-red-600 text-white px-4 py-2 m-2 rounded"
        >
          x
        </button>
      )}
    </div>
  );
};

export default Partition;
