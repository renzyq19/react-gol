import React from "react";
import ReactDOM from "react-dom";
import { ButtonToolbar, MenuItem, DropdownButton } from "react-bootstrap";
import "./index.css";

const Box = ({ selectBox, row, col, boxClass, boxId }) => {
  const selectThisBox = () => selectBox(row, col);
  return <div className={boxClass} id={boxId} onClick={selectThisBox} />;
};

const Grid = ({ cols, selectBox, gridFull }) => {
  const width = cols * 14;
  const rowsArr = gridFull.map((row, i) =>
    row.map((box, j) => {
      const boxId = `${i}_${j}`;
      const boxClass = `box ${box ? "on" : "off"}`;
      return (
        <Box
          boxClass={boxClass}
          key={boxId}
          boxId={boxId}
          row={i}
          col={j}
          selectBox={selectBox}
        />
      );
    })
  );
  return (
    <div className="grid" style={{ width: width }}>
      {rowsArr}
    </div>
  );
};

const Buttons = ({
  playButton,
  pauseButton,
  clear,
  slow,
  fast,
  seed,
  gridSize
}) => {
  const handleSelect = evt => gridSize(evt);

  return (
    <div className="center">
      <ButtonToolbar>
        {[
          ["Play", playButton],
          ["Pause", pauseButton],
          ["Clear", clear],
          ["Slow", slow],
          ["Fast", fast],
          ["Seed", seed]
        ].map(([label, handler]) => (
          <button key={label} className="btn btn-default" onClick={handler}>
            {label}
          </button>
        ))}
        <DropdownButton
          title="Grid Size"
          id="size-menu"
          onSelect={handleSelect}
        >
          <MenuItem eventKey="1">20x10</MenuItem>
          <MenuItem eventKey="2">50x30</MenuItem>
          <MenuItem eventKey="3">70x50</MenuItem>
        </DropdownButton>
      </ButtonToolbar>
    </div>
  );
};

class Main extends React.Component {
  constructor() {
    super();
    this.speed = 100;
    this.rows = 30;
    this.cols = 50;
    this.state = {};
  }

  seed = () => {
    const gridRandom = this.state.gridFull.map(row =>
      row.map(() => Math.floor(Math.random() * 4) === 1)
    );

    this.setState(() => {
      return { generation: 0, gridFull: gridRandom };
    });
  };

  selectBox = (row, col) =>
    this.setState(({ gridFull }) => {
      gridFull[row][col] = !gridFull[row][col];
      return { gridFull };
    });

  playButton = () => {
    clearInterval(this.intervalId);
    this.intervalId = setInterval(this.play, this.speed);
  };

  pauseButton = () => clearInterval(this.intervalId);

  slow = () => {
    this.speed = 1000;
    this.playButton();
  };

  fast = () => {
    this.speed = 50;
    this.playButton();
  };

  gridSize = size => {
    switch (size) {
      case "1":
        this.cols = 20;
        this.rows = 10;
        break;
      case "2":
        this.cols = 50;
        this.rows = 30;
        break;
      default:
        this.cols = 100;
        this.rows = 50;
    }
    this.clear();
  };

  clear = () => {
    const emptyArray = Array(this.rows)
      .fill()
      .map(() => Array(this.cols).fill(false));
    this.setState(() => ({
      gridFull: emptyArray,
      generation: 0
    }));
    this.speed = 100;
    this.pauseButton();
  };

  play = () => {
    const neighbours = (row, col) => {
      const wrapAccess = array => (i, j) => {
        const length = array.length;
        const wrapped = n => (n % length + length) % length;
        return array[wrapped(i)][wrapped(j)];
      };
      const wrapGrid = wrapAccess(this.state.gridFull);
      let total = 0;
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          if (wrapGrid(i + row, j + col) && (i || j)) total++;
        }
      }
      return total;
    };

    const nextGrid = this.state.gridFull.map((row, i) =>
      row.map((cell, j) => {
        const n = neighbours(i, j);
        let nextCell = false;
        if (cell) {
          if (n < 2) nextCell = false;
          else if (n <= 3) nextCell = true;
          else nextCell = false;
        } else {
          if (n === 3) nextCell = true;
        }
        return nextCell;
      })
    );
    this.setState(({ generation }) => ({
      gridFull: nextGrid,
      generation: generation + 1
    }));
  };

  componentWillMount() {
    this.clear();
  }

  componentDidMount() {
    this.seed();
  }

  render() {
    return (
      <div>
        <h1>The Game of Life</h1>
        <Buttons
          playButton={this.playButton}
          pauseButton={this.pauseButton}
          slow={this.slow}
          fast={this.fast}
          clear={this.clear}
          seed={this.seed}
          gridSize={this.gridSize}
        />
        <Grid
          gridFull={this.state.gridFull}
          rows={this.rows}
          cols={this.cols}
          selectBox={this.selectBox}
        />
        <h2>Generations: {this.state.generation}</h2>
      </div>
    );
  }
}

ReactDOM.render(<Main />, document.getElementById("root"));
