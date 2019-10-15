import React from "react";
import "./App.css";

const styles = {
  maindiv: {
    width: "100%",
    height: "100%"
  },
  textdiv: {
    margin: "10px 10px"
  },
  buttondiv: {
    margin: "0px 10px"
  },
  button: {
    border: "0px",
    margin: "1px",
    height: "50px",
    minWidth: "75px"
  },
  canvas: {
    border: "1px solid #333",
    margin: "10px 10px"
  }
};

//simple draw component made in react
class App extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.reset();
  }

  draw(e) {
    //response to Draw button click
    this.setState({
      mode: "draw"
    });
  }

  erase() {
    //response to Erase button click
    this.setState({
      mode: "erase"
    });
  }
  isMobile() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      return true;
    }
    return false;
  }
  drawing(e) {
    //if the pen is down in the canvas, draw/erase

    if (this.state.pen === "down") {
      this.ctx.beginPath();
      this.ctx.lineWidth = this.state.lineWidth;
      this.ctx.lineCap = "round";

      if (this.state.mode === "draw") {
        this.ctx.strokeStyle = this.state.penColor;
      }

      if (this.state.mode === "erase") {
        this.ctx.strokeStyle = "#ffffff";
      }

      e.preventDefault();
      this.ctx.moveTo(this.state.penCoords[0], this.state.penCoords[1]); //move to old position
      if (this.isMobile()) {
        // alert("Is Mobile");
        let rect = this.refs.canvas.getBoundingClientRect();
        var mobileX = e.targetTouches[0].pageX - rect.left;
        var mobileY = e.targetTouches[0].pageY - rect.top;
        this.setState({
          //save new position

          penCoords: [mobileX, mobileY]
        });
        this.ctx.lineTo(mobileX, mobileY); //draw to new position
      } else {
        // alert("Is Desktop");
        this.setState({
          //save new position
          penCoords: [e.nativeEvent.offsetX, e.nativeEvent.offsetY]
        });

        this.ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY); //draw to new position
      }

      this.ctx.stroke();
      e.stopPropagation(); // Really this time.
    }
  }

  penDown(e) {
    //mouse is down on the canvas

    if (this.isMobile()) {
      e.preventDefault();
      let rect = this.refs.canvas.getBoundingClientRect();
      var mobileX = e.targetTouches[0].pageX - rect.left;
      var mobileY = e.targetTouches[0].pageY - rect.top;

      this.setState({
        pen: "down",
        penCoords: [mobileX, mobileY]
      });
    } else {
      this.setState({
        pen: "down",
        penCoords: [e.nativeEvent.offsetX, e.nativeEvent.offsetY]
      });
    }
    e.stopPropagation(); // Really this time.
  }

  penUp(e) {
    e.preventDefault();
    //mouse is up on the canvas
    this.setState({
      pen: "up"
    });
  }

  penSize(e) {
    //increase pen size button clicked

    if (e.currentTarget.id === "thin") {
      this.state.lineWidth = 5;
    } else if (e.currentTarget.id === "thik") {
      this.state.lineWidth = 15;
    } else {
      this.state.lineWidth = 30;
    }

    this.setState({
      lineWidth: this.state.lineWidth
    });
  }

  setColor(c) {
    //a color button was clicked
    this.setState({
      penColor: c
    });
  }

  reset() {
    //clears it to all white, resets state to original
    this.setState({
      mode: "draw",
      pen: "up",
      lineWidth: 10,
      penColor: "black"
      //  canvas: canvas
    });

    this.ctx = this.refs.canvas.getContext("2d");
    this.ctx.fillStyle = "white";
    this.ctx.fillRect(0, 0, 800, 600);
    this.ctx.lineWidth = 10;

    this.refs.canvas.width = this.refs.canvas.offsetWidth;
    this.refs.canvas.height = this.refs.canvas.offsetHeight;
  }

  render() {
    return (
      <div style={styles.maindiv}>
        <div style={styles.textdiv}>
          <h3> Drawing App</h3>
          <h4> by Vijay Singh (talk.vijay@gmail.com)</h4>
        </div>
        <canvas
          ref="canvas"
          style={styles.canvas}
          id="canvas"
          onMouseMove={e => this.drawing(e, { passive: false })}
          onMouseDown={e => this.penDown(e, { passive: false })}
          onMouseUp={e => this.penUp(e, { passive: false })}
          onTouchStart={e => this.penDown(e, { passive: false })}
          onTouchMove={e => this.drawing(e, { passive: false })}
          onTouchEnd={e => this.penUp(e, { passive: false })}
        ></canvas>
        <div style={styles.buttondiv}>
          <button onClick={e => this.draw(e)} style={(styles.btn, styles.button)}>
            Draw
          </button>
          <button onClick={e => this.erase(e)} style={(styles.btn, styles.button)}>
            Erase
          </button>
          <button id="thin" onClick={e => this.penSize(e)} style={(styles.btn, styles.button)}>
            Thin
          </button>
          <button id="thik" onClick={e => this.penSize(e)} style={(styles.btn, styles.button)}>
            Thik
          </button>
          <button id="large" onClick={e => this.penSize(e)} style={(styles.btn, styles.button)}>
            Large
          </button>
          <button onClick={() => this.reset()} style={(styles.btn, styles.button)}>
            Undo
          </button>
        </div>
      </div>
    );
  }
}

export default App;
