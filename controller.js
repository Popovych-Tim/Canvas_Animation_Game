class Controller {
  constructor(canvas) {
    this.canvas = canvas.link;
    this.context = this.canvas.getContext('2d');
    this.w = canvas.link.clientWidth;
    this.h = canvas.link.clientHeight;
    this.size = 75; // Square size
    this.scoreElement = document.getElementById("score");
    this.score = 0;
    this.squares = [];
    this.isPlaying = false;
    this.canvas.addEventListener('click', (e) => {
      this.click(e.offsetX, e.offsetY);
    });
  }

  addSquare() {
    const newSquare = {
      x: Math.random() * (this.w - this.size),
      y: 0,
      color: this.randomColor(),
      speed: Math.random() * 4 + 1
    };
    this.squares.push(newSquare);
  }

  randomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r},${g},${b})`;
  }

  randomCreation() {
    let randomInterval = Math.random() * 1000;
    this.timeOut = setTimeout(() => {
      this.addSquare();
      this.randomCreation();
    }, randomInterval);
  }

  renderSquares() {
    this.squares.forEach((square) => {
      this.context.fillStyle = square.color;
      this.context.fillRect(square.x, square.y, this.size, this.size);
    });
  }

  moveSquares() {
    this.squares.forEach((square) => {
      square.y += square.speed;
    });
  }

  isPointInSquare(square, x, y) {
    return square.x < x &&
      square.x + this.size >= x &&
      square.y + this.size >= y &&
      square.y < y;
  }

  click(x, y) {
    for (let i = this.squares.length - 1; i >= 0; i--) {
      if (this.isPointInSquare(this.squares[i], x, y)) {
        this.squares.splice(i, 1);
        this.score++;
        this.scoreRender();
        break;
      }
    }
  }

  clear() {
    this.context.clearRect(0, 0, this.w, this.h);
  }

  scoreRender() {
    this.scoreElement.innerHTML = this.score;
  }

  deleteHiddenSquares() {
    this.squares = this.squares.filter((square) => square.y <= this.h);
  }

  start() {
    if (!this.isPlaying) {
      this.isPlaying = true;
      this.score = 0;
      this.scoreRender();
      this.squares = [];
      this.randomCreation();
      this.animate.call(this);
    }
  }

  stop() {
    if (this.isPlaying) {
      this.isPlaying = false;
      clearTimeout(this.timeOut);
      this.clear();
    } else {
      this.score = 0;
      this.scoreRender();
    }
  }

  animate() {
    if (this.isPlaying) {
      this.clear();
      this.renderSquares();
      this.moveSquares();
      this.deleteHiddenSquares();
      requestAnimationFrame(this.animate.bind(this));
    }
  }
}

let controller = new Controller(_canvas);