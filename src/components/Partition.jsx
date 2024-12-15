import React, { useState } from "react";
import { getRandomColor } from "../utils/randomColor";

const Partition = ({ initialColor = getRandomColor(), onDelete, isRoot = false }) => {
  const [isSplit, setIsSplit] = useState(false);
  const [splitType, setSplitType] = useState(null);
  const [childDivs, setChildDivs] = useState([]);
  const [sizes, setSizes] = useState([50, 50]); // Initial sizes for child divs

  const handleSplit = (type) => {
    setIsSplit(true);
    setSplitType(type);
    setChildDivs([
      { id: crypto.randomUUID(), color: initialColor },
      { id: crypto.randomUUID(), color: getRandomColor() },
    ]);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    }
  };

  const handleChildDelete = (id) => {
    setChildDivs((prev) => {
      const updatedDivs = prev.filter((child) => child.id !== id);
      if (updatedDivs.length === 0) {
        setIsSplit(false);
        setSplitType(null);
      }
      return updatedDivs;
    });
  };

  const handleMouseDown = (index, event) => {
    event.preventDefault();
    const startX = event.clientX;
    const startY = event.clientY;
    const startSizes = [...sizes];

    const handleMouseMove = (event) => {
      const dx = event.clientX - startX;
      const dy = event.clientY - startY;

      const newSizes = [...startSizes];
      if (splitType === "horizontal") {
        newSizes[index] = Math.min(Math.max(startSizes[index] + dy, 10), 90);
        newSizes[index + 1] = 100 - newSizes[index];
      } else {
        newSizes[index] = Math.min(Math.max(startSizes[index] + dx, 10), 90);
        newSizes[index + 1] = 100 - newSizes[index];
      }

      setSizes(newSizes);
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

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
            style={{
              flex: `${sizes[index]} 0 auto`,
              backgroundColor: child.color,
            }}
          >
            <Partition
              initialColor={child.color}
              onDelete={() => handleChildDelete(child.id)}
            />
            {index < childDivs.length - 1 && (
              <div
                className={`resizer ${splitType === "horizontal" ? "vertical" : "horizontal"}`}
                onMouseDown={(event) => handleMouseDown(index, event)}
                style={{
                  cursor: splitType === "horizontal" ? "ns-resize" : "ew-resize",
                  width: splitType === "horizontal" ? "100%" : "10px",
                  height: splitType === "horizontal" ? "10px" : "100%",
                  backgroundColor: "transparent",
                  position: "absolute",
                  right: splitType === "horizontal" ? "0" : "0",
                  bottom: splitType === "horizontal" ? "0" : "0",
                }}
              />
            )}
          </div>
        ))
      ) : (
        <Card
          handleDelete={!isRoot ? handleDelete : null}
          handleSplit={handleSplit}
        />
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