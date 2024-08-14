import { useState } from "react";

function Square({ value, onSquareClick, winnerSquares }) {
  const winningSquareStyle = {
    backgroundColor: "green",
  };
  return (
    <button
      className="square"
      onClick={onSquareClick}
      style={winnerSquares ? winningSquareStyle : null}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    onPlay(nextSquares, i);
  }

  const winner = calculateWinner(squares);
  let status;

  if (winner) {
    status = `Winner: ${winner.winnerSquare}`;
  } else {
    status = `Next player: ${xIsNext ? "X" : "O"}`;
  }

  const rowsOfBlocks = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
  ];

  return (
    <>
      <div className="status">{status}</div>
      {rowsOfBlocks.map((rows, index) => {
        return (
          <div className="board-row" key={index}>
            {rows.map((i) => {
              let winnerSquares =
                winner && winner.winnerSquares.includes(i) ? true : false;
              return (
                <Square
                  key={i}
                  value={squares[i]}
                  winnerSquares={winnerSquares}
                  index={i}
                  onSquareClick={() => handleClick(i)}
                />
              );
            })}
          </div>
        );
      })}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isSort, setIsSort] = useState(false);
  const [position, setPosition] = useState([]);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares, positionClick) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    const newPosition = position;
    newPosition.push([
      Math.floor(positionClick / 3 + 1),
      Math.floor((positionClick % 3) + 1),
    ]);
    setPosition(newPosition);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function sortMoves() {
    setIsSort(!isSort);
  }

  const moves = history.map((step, move) => {
    let description;
    if (move > 0) {
      description = `Go to move # ${move}`;
    } else {
      description = "Go to game start";
    }

    return (
      <li key={move}>
        {currentMove === move ? (
          `You are at move # ${move}`
        ) : (
          <>
            <button className="btn-width" onClick={() => jumpTo(move)}>
              {description}
            </button>
            <span style={{ marginLeft: "10px" }}>
              Position: [row: {position[move][0]}, col: {position[move][1]}]
            </span>
          </>
        )}
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{isSort ? moves.reverse() : moves}</ol>
        <button className="btn-margin-left" onClick={() => sortMoves()}>
          Toggle order sort
        </button>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winnerSquare: squares[a],
        winnerSquares: lines[i],
      };
    }
  }
  return null;
}
