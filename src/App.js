import React, { Component } from 'react';
import { Stage, Layer, Circle, Line, Rect } from 'react-konva';
import Konva from 'konva';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      crosshair: {
        x: -999,
        y: -999,
      },
      y: 0,
      playerPosition: 0,
    }
  }


  componentDidMount() {
    this.anim = new Konva.Animation((frame) => {
      const { y } = this.state;
      let oldY = this.circle.attrs.y;
      if (Math.abs(y - oldY) <= 0.5) return;
      if (typeof oldY === 'undefined') oldY = 0;
      if (y > oldY) {
        this.circle.setY(oldY + ((y - oldY) * 0.1));
        this.setState({ playerPosition: oldY + ((y - oldY) * 0.1) })
      }
      if (y < oldY) {
        this.circle.setY(oldY - ((oldY - y) * 0.1));
        this.setState({ playerPosition: oldY + ((y - oldY) * 0.1) })
      }
    }, this.layer);
    this.anim.start();
  }


  onKeyPress = (e, x) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp' && e.key !== 'w' && e.key !== 's') return;
    const { y } = this.state;
    const nextY = e.key === 'ArrowDown' || e.key === 's' ? y + 66 : y - 66;
    this.setState({ y: nextY });
  }


  onMouseMove = ({ clientX, clientY }) => {
    this.setState({
      crosshair: {
        x: clientX,
        y: clientY,
      }
    })
  }


  onClick = () => {
    console.log('this.bullet =>', this.bullet);
    this.bullet.setX(0);
    this.bullet.setY(this.state.playerPosition);
    this.bullet.to({
      ...this.getShotPos(),
      duration: 0.6, 
    });
    setTimeout(() => {
      this.bullet.setX(-9999);
      this.bullet.setY(-9999);
    }, 230)
  }


  getShotPos() {
    const { playerPosition } = this.state;
    const { x, y } = this.state.crosshair;
    const multiplier = window.innerWidth / x;
    const shotPos = ((y - playerPosition) * multiplier) + playerPosition;
    console.log('shotPos =>', shotPos);
    return {
      x: window.innerWidth,
      y: shotPos,
    }
  }


  render() {
    return (
      <div tabIndex={0} onKeyPress={this.onKeyPress} onMouseMove={this.onMouseMove} onClick={this.onClick}>
        <Stage width={window.innerWidth} height={window.innerHeight}>
          <Layer width={window.innerWidth} height={window.innerHeight} ref={(e) => { this.layer = e; }}>
            <Circle
              ref={(node) => { this.circle = node; }}
              radius={40}
              fill="wheat"
              stroke="crimson"
              strokeWidth={5}
            />
            <Circle
              ref={(node) => { this.crosshair = node; }}
              radius={15}
              stroke="rgba(23,23,23,0.3)"
              fill="transparent"
              dash={[1, 3]}
              strokeWidth={2}
              x={this.state.crosshair.x}
              y={this.state.crosshair.y}
            />
            <Circle
              ref={(node) => { this.bullet = node; }}
              width={15}
              height={15}
              fill="crimson"
              x={-9999}
              y={-9999}
            />
            {this.circle ?
              <Line
                points={[
                  0,
                  this.state.playerPosition,
                  this.state.crosshair.x,
                  this.state.crosshair.y,
                ]}
                stroke="rgba(23,23,23,0.3)"
                dash={[1,3]}
                tension={1}
              />
            : null}
          </Layer>
        </Stage>
      </div>
    );
  }
}

export default App;