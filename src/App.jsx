import React, { useState } from 'react';
import './App.css';

const App = () => {
  const [nodes, setNodes] = useState([
    { id: 1, x: 100, y: 100, width: 100, height: 100 },
    { id: 2, x: 300, y: 200, width: 100, height: 100 },
    { id: 3, x: 400, y: 300, width: 100, height: 100 },
    { id: 4, x: 500, y: 400, width: 100, height: 100 },
  ]);
  const [dragging, setDragging] = useState(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [snapLines, setSnapLines] = useState({ x: null, y: null });

  const handleMouseDown = (e, id) => {
    const node = nodes.find(n => n.id === id);
    setDragging(id);
    setOffset({ x: e.clientX - node.x, y: e.clientY - node.y });
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;

    const snapThreshold = 10;
    let newX = e.clientX - offset.x;
    let newY = e.clientY - offset.y;
    let snapX = null;
    let snapY = null;

    const newNodes = nodes.map(node => {
      if (node.id === dragging) {
        nodes.forEach(otherNode => {
          if (node.id !== otherNode.id) {
            if (Math.abs(newX - otherNode.x) < snapThreshold) {
              newX = otherNode.x;
              snapX = otherNode.x;
            }
            if (Math.abs(newX - (otherNode.x + otherNode.width)) < snapThreshold) {
              newX = otherNode.x + otherNode.width;
              snapX = otherNode.x + otherNode.width;
            }
            if (Math.abs(newY - otherNode.y) < snapThreshold) {
              newY = otherNode.y;
              snapY = otherNode.y;
            }
            if (Math.abs(newY - (otherNode.y + otherNode.height)) < snapThreshold) {
              newY = otherNode.y + otherNode.height;
              snapY = otherNode.y + otherNode.height;
            }
          }
        });

        if (Math.abs(newX) < snapThreshold) {
          newX = 0;
          snapX = 0;
        }
        if (Math.abs(newX + node.width - 800) < snapThreshold) {
          newX = 800 - node.width;
          snapX = 800;
        }
        if (Math.abs(newY) < snapThreshold) {
          newY = 0;
          snapY = 0;
        }
        if (Math.abs(newY + node.height - 600) < snapThreshold) {
          newY = 600 - node.height;
          snapY = 600;
        }

        return { ...node, x: newX, y: newY };
      }
      return node;
    });

    setNodes(newNodes);
    setSnapLines({ x: snapX, y: snapY });
  };

  const handleMouseUp = () => {
    setDragging(null);
    setSnapLines({ x: null, y: null });
  };

  return (
    <div className="App" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
      {nodes.map(node => (
        <div
          key={node.id}
          className="node"
          style={{ left: node.x, top: node.y, width: node.width, height: node.height }}
          onMouseDown={(e) => handleMouseDown(e, node.id)}
        />
      ))}
      {snapLines.x !== null && <div className="snap-line vertical" style={{ left: snapLines.x }} />}
      {snapLines.y !== null && <div className="snap-line horizontal" style={{ top: snapLines.y }} />}
    </div>
  );
};

export default App;
