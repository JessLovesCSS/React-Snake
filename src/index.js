import React from "react";
import ReactDOM from "react-dom";

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

const appleStyle = {
  background: "#f00",
  border: "1px solid #c00",
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
      addAppleCall: false,
      applesCoords: [],
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
    this.coordsInterval = false;
    this.updateDirection = this.updateDirection.bind(this);
    this.updateCoords = this.updateCoords.bind(this);
    this.addApple = this.addApple.bind(this);
    this.eatApple = this.eatApple.bind(this);
  }

  updateDirection(ev) {
    const evkc = ev.keyCode,
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
        () => (this.coordsInterval = setInterval(this.updateCoords, 66))
      );
    }
  }

  updateCoords() {
    const updatedCoords = [];
    this.eatApple();
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

  addApple() {
    const m = Math;
    const randAppleCoord = () => m.floor(m.random() * 31) * 10;
    const randApple = () => [randAppleCoord(), randAppleCoord()];
    const getUniqueApple = ra => {
      if (typeof ra === "undefined") {
        ra = randApple();
      }
      if (
        this.state.applesCoords.some(
          arr => arr[0] === ra[0] && arr[1] === ra[1]
        ) ||
        this.state.partCoords.some(arr => arr[0] === ra[0] && arr[1] === ra[1])
      )
        return getUniqueApple(randApple());
      return ra;
    };
    this.appleCall = setInterval(() => {
      this.setState(() => ({
        applesCoords: [...this.state.applesCoords, getUniqueApple()]
      }));
    }, 3000);
  }

  eatApple() {
    let updatedApplesCoords = [];
    this.state.applesCoords.forEach((apple, appleIndex) => {
      if (
        apple[0] === this.state.partCoords[0][0] &&
        apple[1] === this.state.partCoords[0][1]
      ) {
        updatedApplesCoords = this.state.applesCoords.filter(
          (a, ai) => ai !== appleIndex
        );
        this.setState(() => ({
          applesCoords: updatedApplesCoords
        }));
      }
    });
  }

  componentDidUpdate() {
    if (!this.state.addAppleCall) {
      this.setState(() => ({
        addAppleCall: true
      }));
      this.addApple();
    }
  }

  render() {
    return (
      <div onKeyDown={this.updateDirection} style={gameboardStyle} tabIndex="0">
        {this.state.applesCoords.map((a, i) => (
          <Apple coords={this.state.applesCoords[i]} />
        ))}
        <Snake partCoords={this.state.partCoords} />
      </div>
    );
  }
}

const Apple = props => (
  <div
    className="apple"
    style={{
      ...appleStyle,
      top: props.coords[0],
      left: props.coords[1]
    }}
  />
);

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
