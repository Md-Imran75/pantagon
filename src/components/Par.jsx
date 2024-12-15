import React, { useState } from "react";


const Par = ({ data, onUpdate, onRemove }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [resizeDir, setResizeDir] = useState(null);


    const handleCreateVertical = () => {
        const recursiveUpdate = (par) => {
            if (par.children.length > 0) {
                // If the par already has children, recursively update them
                return {
                    ...par,
                    children: par.children.map(recursiveUpdate),
                };
            }


            // If the par has no children, split it into two vertically
            const newChild1 = {
                id: Math.random(),
                x: par.x,
                y: par.y,
                width: par.width,
                height: par.height / 2,
                children: [],
            };


            const newChild2 = {
                id: Math.random(),
                x: par.x,
                y: par.y + par.height / 2,
                width: par.width,
                height: par.height / 2,
                children: [],
            };


            return {
                ...par,
                children: [newChild1, newChild2],
            };
        };


        onUpdate(data.id, recursiveUpdate);
    };


    const handleCreateHorizontal = () => {
        const recursiveUpdate = (par) => {
            if (par.children.length > 0) {
                // If the par already has children, recursively update them
                return {
                    ...par,
                    children: par.children.map(recursiveUpdate),
                };
            }


            // If the par has no children, split it into two horizontally
            const newChild1 = {
                id: Math.random(),
                x: par.x,
                y: par.y,
                width: par.width / 2,
                height: par.height,
                children: [],
            };


            const newChild2 = {
                id: Math.random(),
                x: par.x + par.width / 2,
                y: par.y,
                width: par.width / 2,
                height: par.height,
                children: [],
            };


            return {
                ...par,
                children: [newChild1, newChild2],
            };
        };


        onUpdate(data.id, recursiveUpdate);
    };




    const handleRemove = () => {
        onRemove(data.id);
    };


    const handleResizeStart = (e, direction) => {
        e.stopPropagation();
        setIsResizing(true);
        setResizeDir(direction);
    };


    const handleResizeMove = (e) => {
        if (!isResizing) return;


        const deltaX = e.movementX;
        const deltaY = e.movementY;


        onUpdate(data.id, (par) => {
            const updatedpar = { ...par };


            if (resizeDir === "right") updatedpar.width += deltaX;
            if (resizeDir === "bottom") updatedpar.height += deltaY;
            if (resizeDir === "left") {
                updatedpar.x += deltaX;
                updatedpar.width -= deltaX;
            }
            if (resizeDir === "top") {
                updatedpar.y += deltaY;
                updatedpar.height -= deltaY;
            }


            return updatedpar;
        });
    };


    const handleResizeEnd = () => {
        setIsResizing(false);
        setResizeDir(null);
    };


    return (
        <div
            className="par"
            style={{
                left: data.x,
                top: data.y,
                width: data.width,
                height: data.height,
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onMouseMove={handleResizeMove}
            onMouseUp={handleResizeEnd}
        >
            {isHovered && (
                <div className="controls">
                    <button onClick={handleCreateVertical}>Create Vertically</button>
                    <button onClick={handleCreateHorizontal}>Create Horizontally</button>
                    <button onClick={handleRemove}>Remove</button>
                </div>
            )}


            {/* Resizing Handles */}
            <div
                className="handle right"
                onMouseDown={(e) => handleResizeStart(e, "right")}
            ></div>
            <div
                className="handle bottom"
                onMouseDown={(e) => handleResizeStart(e, "bottom")}
            ></div>
            <div
                className="handle left"
                onMouseDown={(e) => handleResizeStart(e, "left")}
            ></div>
            <div
                className="handle top"
                onMouseDown={(e) => handleResizeStart(e, "top")}
            ></div>


            {/* Render Sub-pars */}
            {data.children.map((child) => (
                <par
                    key={child.id}
                    data={child}
                    onUpdate={onUpdate}
                    onRemove={onRemove}
                />
            ))}
        </div>
    );
};


export default Par;
