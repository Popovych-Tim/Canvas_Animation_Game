class Controller {
  constructor(canvas) {
    this.canvas = canvas.canvasLink;
    this.context = this.canvas.getContext('2d');

    this.w = canvas.canvasLink.clientWidth;
    this.h = canvas.canvasLink.clientHeight;
    this.s = 75;
    this.scoreLink = document.getElementById("score");
    this.score = 0;
    this.squares = [];
    this.isPlaying = false;

    this.canvas.addEventListener('click', (e) => {
      this.click(e.offsetX, e.offsetY);
    });
  }

  addSquare() {
    const newSquare = {
      x: Math.random() * (this.w - this.s),
      y: 0,
      color: this.randomColor(),
      speed: Math.random() * 5 + 1
    };
    this.squares.push(newSquare);
  }

  randomPlace() {
    let rand = Math.random()*700;
    this.timeOut = setTimeout(() => {
      this.addSquare();
      this.randomPlace();
    }, rand);
  }

  randomColor() {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgb(${r}, ${g}, ${b})`;
  }

  renderSquares() {
    this.squares.forEach((square) => {
      this.context.fillStyle = square.color;
      this.context.fillRect(square.x, square.y, this.s, this.s);
    });
  }

  moveSquares() {
    this.squares.forEach((square) => {
      square.y += square.speed;
    });
  }

  deleteHiddenSquares() {
    this.squares = this.squares.filter((square) => square.y <= this.h);
  }

  isPointInSquare(square, x, y) {
    return square.x < x &&
      square.x + this.s >= x &&
      square.y + this.s >= y &&
      square.y < y;
  }

  clear() {
    this.context.clearRect(0, 0, this.w, this.h);
  }

  scoreRender (){
    this.scoreLink.innerHTML = this.score;
  }
  
  click(x, y) {
    for(let i = this.squares.length -1; i>=0; i--) {
      if(this.isPointInSquare(this.squares[i], x, y)) {
        this.squares.splice(i, 1);
        this.score++;
        this.scoreRender();
        break;
      }
    }
  }

  start() {
    if (!this.isPlaying) {
      this.isPlaying = true;

      this.score = 0;
      this.scoreRender();
      this.squares = [];
      this.randomPlace();
      this.animate.call(this);
    }
  }

  stop() {
    if (this.isPlaying) {
      this.isPlaying = false;
      clearTimeout(this.timeOut);
    }
    this.clear();

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