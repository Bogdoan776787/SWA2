import { useEffect, useState } from "react";

const width = 8;
const objectColors = ["green", "yellow", "red", "blue", "gray", "indigo"];

function App() {
  const [currentColor, setCurrentColor] = useState([]);
  const [draggedSquare, setDraggedSquare] = useState(null);
  const [replacedSquare, setReplacedSquare] = useState(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const checkColumnOfFour = () => {
    for (let i = 0; i <= 39; i++) {
      const columnOfFour = [i, i + width, i + width * 2, i + width * 3];
      const checkedColor = currentColor[i];

      if (
        columnOfFour.every((number) => currentColor[number] === checkedColor)
      ) {
        columnOfFour.forEach((number) => (currentColor[number] = ""));
      }
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const checkColumnOfThree = () => {
    for (let i = 0; i <= 47; i++) {
      const columnOfThree = [i, i + width, i + width * 2];
      const checkedColor = currentColor[i];
      if (
        columnOfThree.every((number) => currentColor[number] === checkedColor)
      ) {
        columnOfThree.forEach((number) => (currentColor[number] = ""));
      }
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const checkRowOfThree = () => {
    for (let i = 0; i < 64; i++) {
      const rowOfThree = [i, i + 1, i + 2];
      const checkedColor = currentColor[i];
      const notValid = [
        6, 7, 14, 15, 22, 23, 30, 32, 38, 39, 46, 47, 54, 55, 63, 64,
      ];
      if (notValid.includes(i)) continue;
      if (rowOfThree.every((number) => currentColor[number] === checkedColor)) {
        rowOfThree.forEach((number) => (currentColor[number] = ""));
      }
    }
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const checkRowOfFour = () => {
    for (let i = 0; i < 64; i++) {
      const rowOfFour = [i, i + 1, i + 2, i + 3];
      const checkedColor = currentColor[i];
      const notValid = [
        5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53,
        54, 55, 62, 63, 64,
      ];
      if (notValid.includes(i)) continue;
      if (rowOfFour.every((number) => currentColor[number] === checkedColor)) {
        rowOfFour.forEach((number) => (currentColor[number] = ""));
      }
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const dragItemDown = () => {
    for (let i = 0; i <= 55 - width; i++) {
      const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
      const isFirstRow = firstRow.includes(i);

      if (isFirstRow && currentColor[i] === "") {
        let randomNumber = Math.floor(Math.random() * objectColors.length);
        currentColor[i] = objectColors[randomNumber];
      }

      if (currentColor[i + width] === "") {
        currentColor[i + width] = currentColor[i];
        currentColor[i] = "";
      }
    }
  };

  const startDragging = (e) => {
    setDraggedSquare(e.target);
  };

  const dropDragging = (e) => {
    setReplacedSquare(e.target);
  };

  const endDragging = () => {
    const draggedSquareId = parseInt(draggedSquare.getAttribute("data-id"));
    const replacedSquareId = parseInt(replacedSquare.getAttribute("data-id"));

    currentColor[replacedSquareId] = draggedSquare.style.backgroundColor;
    currentColor[draggedSquareId] = replacedSquare.style.backgroundColor;

    const validMoves = [
      draggedSquareId - 1,
      draggedSquareId - width,
      draggedSquareId + 1,
      draggedSquareId + width,
    ];

    const validMove = validMoves.includes(replacedSquareId);

    const isAColumnOfFour = checkColumnOfFour();
    const isARowOfFour = checkRowOfFour();
    const isAColumnOfThree = checkColumnOfThree();
    const isARowOfThree = checkRowOfThree();

    if (
      replacedSquareId &&
      validMove &&
      (isARowOfThree || isARowOfFour || isAColumnOfFour || isAColumnOfThree)
    ) {
      setDraggedSquare(null);
      setReplacedSquare(null);
    } else {
      currentColor[replacedSquareId] = replacedSquare.style.backgroundColor;
      currentColor[draggedSquareId] = draggedSquare.style.backgroundColor;
      setCurrentColor([...currentColor]);
    }
  };
  const playBoard = () => {
    const oddColorArray = [];
    for (let i = 0; i < width * width; i++) {
      const oddColor =
        objectColors[Math.floor(Math.random() * objectColors.length)];
      oddColorArray.push(oddColor);
    }
    setCurrentColor(oddColorArray);
  };
  useEffect(() => {
    playBoard();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      checkColumnOfFour();
      checkRowOfFour();
      checkColumnOfThree();
      checkRowOfThree();
      dragItemDown();
      setCurrentColor([...currentColor]);
    }, 100);
    return () => clearInterval(timer);
  }, [
    checkColumnOfFour,
    checkRowOfFour,
    checkColumnOfThree,
    checkRowOfThree,
    dragItemDown,
    currentColor,
  ]);

  return (
    <div className="App">
      <div className="game">
        {currentColor.map((objectColor, index) => (
          <div
            className="box"
            key={index}
            style={{ backgroundColor: objectColor }}
            alt={objectColor}
            data-id={index}
            draggable={true}
            onDragStart={startDragging}
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={(e) => e.preventDefault()}
            onDragLeave={(e) => e.preventDefault()}
            onDrop={dropDragging}
            onDragEnd={endDragging}
            onClick={(e) => console.log(objectColor)}
          ></div>
        ))}
      </div>
    </div>
  );
}

export default App;
