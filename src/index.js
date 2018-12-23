import React from "react";
import ReactDOM from "react-dom";
import "./styles.css";

const gameboardStyle = {
  background: "#000",
  height: "310px",
  position: "relative",
  width: "310px"
};

const snakeStyle = {
  background: "#fff",
  border: "1px solid gray",
  boxSizing: "border-box",
  display: "block",
  height: "10px",
  position: "absolute",
  width: "10px"
};

class Gameboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      direction: false,
      partCoords: [
        [150, 150],
        [160, 150],
        [170, 150],
        [180, 150],
        [190, 150],
        [200, 150]
      ]
    };
    this.coordsInterval = null;
    this.updateDirection = this.updateDirection.bind(this);
    this.updateCoords = this.updateCoords.bind(this);
  }

  updateDirection(ev) {
    let evkc = ev.keyCode,
      sd = this.state.direction || 41;
    if (
      (evkc === 37 && sd !== 39) ||
      (evkc === 38 && sd !== 40) ||
      (evkc === 39 && sd !== 37) ||
      (evkc === 40 && sd !== 38)
    ) {
      clearInterval(this.coordsInterval);
      this.setState(
        () => ({
          direction: evkc
        }),
        () => {
          this.coordsInterval = setInterval(this.updateCoords, 66);
        }
      );
    }
  }

  updateCoords() {
    let updatedCoords = [];
    this.state.partCoords.forEach((el, i) => {
      if (i === 0) {
        let tspi = this.state.partCoords[i];
        switch (this.state.direction) {
          case 37:
            updatedCoords.push([tspi[0], tspi[1] >= 10 ? tspi[1] - 10 : 300]);
            break;
          case 38:
            updatedCoords.push([tspi[0] >= 10 ? tspi[0] - 10 : 300, tspi[1]]);
            break;
          case 39:
            updatedCoords.push([tspi[0], tspi[1] <= 290 ? tspi[1] + 10 : 0]);
            break;
          case 40:
            updatedCoords.push([tspi[0] <= 290 ? tspi[0] + 10 : 0, tspi[1]]);
            break;
          default:
            break;
        }
      } else {
        updatedCoords.push(this.state.partCoords[i - 1]);
      }
    });

    this.setState(() => ({
      partCoords: updatedCoords
    }));
  }

  render() {
    return (
      <div
        onKeyDown={this.updateDirection}
        style={gameboardStyle}
        children={<Snake partCoords={this.state.partCoords} />}
        tabIndex="0"
      />
    );
  }
}

const Snake = props => (
  <ul>
    {props.partCoords.map((p, i) => (
      <SnakePart coords={props.partCoords[i]} />
    ))}
  </ul>
);

const SnakePart = props => (
  <li
    style={{
      ...snakeStyle,
      top: props.coords[0],
      left: props.coords[1]
    }}
  />
);

function SnakeGame() {
  return <Gameboard />;
}

const rootElement = document.getElementById("root");
ReactDOM.render(<SnakeGame />, rootElement);
