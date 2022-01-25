import { useState, useRef, useEffect } from "react";
import { words } from "./constants";
import "./App.css";

let word = words[Math.floor(Math.random() * words.length)];

console.log('word', word)

let startState = new Array(6);
for (let i = 0; i < startState.length; i++) {
  startState[i] = new Array(5).fill({ value: "", state: 4 });
}

const Block = ({ letter, state }) => {
  const background =
    state === 1
      ? "green"
      : state === 2
      ? "yellow"
      : state === 3
      ? "gray"
      : "white";

  return (
    <div
      style={{
        width: 62,
        height: 62,
        border: "1px solid black",
        background,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Helvetica Neue",
        fontSize: "2rem",
      }}
    >
      {letter}
    </div>
  );
};

const Row = ({ letters }) => {
  return (
    <div style={{ display: "flex" }}>
      {letters.map((letter) => {
        return <Block letter={letter.value} state={letter.state} />;
      })}
    </div>
  );
};

function App() {
  const [board, setBoard] = useState(startState);
  const [turn, setTurn] = useState(0);
  const [isOver, setIsOver] = useState(false);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const inputRef = useRef(null);
  const submitRef = useRef(null);

  useEffect(() => {
    const listener = (event) => {
      if (event.code === "Enter" || event.code === "NumpadEnter") {
        event.preventDefault();
        submitRef.current.click();
      }
    };
    document.addEventListener("keydown", listener);
    inputRef.current.focus();
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, []);

  return (
    <div
      className="App"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: 300,
      }}
    >
      {board.map((row) => {
        return <Row letters={row} />;
      })}

      <input
      
        ref={inputRef}
        disabled={isOver}
        type="text"
        maxLength="5"
        onChange={(e) => {
          const newRow = [];
          let i;

          for (i = 0; i < e.target.value.length; i++) {
            newRow.push({
              value: e.target.value[i],
              state: 4,
            });
          }
          if (i === 5) {
            setIsSubmitDisabled(false);
          } else {
            setIsSubmitDisabled(true);
          }
          for (; i < 5; i++) {
            newRow.push({
              value: "",
              state: 4,
            });
          }

          const newBoard = board.slice();
          newBoard[turn] = newRow;

          setBoard(newBoard);
        }}
      />
      <input
        style={{ visibility: "hidden" }}
        type="submit"
        ref={submitRef}
        onClick={() => {
          let newRow = [];
          let numberOfMatches = 0;

          const letterCount = {};

          for (let i = 0; i < word.length; i++) {
            if (!(word[i] in letterCount)) {
              letterCount[word[i]] = 0;
            }
            letterCount[word[i]]++;
          }

          board[turn].forEach((letter, index) => {
            let letterCopy = {
              ...letter,
            };

            if (word[index] === letter.value) {
              numberOfMatches++;
              letterCopy.state = 1;
              letterCount[letter.value]--;
            } else if (word.includes(letter.value)) {
              letterCopy.state = 2;
            } else {
              letterCopy.state = 3;
            }

            newRow.push(letterCopy);
          });

          //edge case
          newRow.forEach((letter) => {
            if (
              letter.state !== 1 &&
              letter.value in letterCount &&
              letterCount[letter.value] === 0
            ) {
              letter.state = 3;
            }
          });

          console.log("newrow", newRow);

          const newBoard = board.slice();
          newBoard[turn] = newRow;
          setBoard(newBoard);
          setTurn(turn + 1);

          if (numberOfMatches === 5) {
            setIsOver(true);
          }

          inputRef.current.value = "";
          inputRef.current.focus();

          setIsSubmitDisabled(true);
        }}
        disabled={isSubmitDisabled}
      />
      {isOver && <div>
          lul
        </div>}
    </div>
  );
}

export default App;
