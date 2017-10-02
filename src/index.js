import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

const Box = ({ selectBox, row, col, boxClass, boxId }) => {
  const selectThisBox = () => selectBox(row, col);
  return <div className={boxClass} id={boxId} onClick={selectThisBox} />;
};

class Grid extends React.Component {
  render() {
    const width = this.props.cols * 16 + 1;
    const rowsArr = this.props.gridFull.map((row, i) =>
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
            selectBox={this.props.selectBox}
          />
        );
      })
    );

    return (
      <div className="grid" style={{ width: width }}>
        {rowsArr}
      </div>
    );
  }
}
class Main extends React.Component {
  constructor() {
    super();
    this.speed = 100;
    this.rows = 30;
    this.cols = 50;

    this.state = {
      generation: 0,
      gridFull: Array(this.rows)
        .fill()
        .map(() => Array(this.cols).fill(false))
    };
  }

  seed = () => {
    const gridRandom = this.state.gridFull.map(row =>
      row.map(() => Math.floor(Math.random() * 4) === 1)
    );

    this.setState(() => {
      debugger;
      return { gridFull: gridRandom };
    });
  };

  selectBox = (row, col) =>
    this.setState(({ gridFull }) => {
      gridFull[row][col] = !gridFull[row][col];
      return { gridFull };
    });

  componentDidMount() {
    this.seed();
  }

  render() {
    return (
      <div>
        <h1>The Game of Life</h1>
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
