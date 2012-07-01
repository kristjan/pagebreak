var _window = $(window);
var ROWS = 5;
var COLS = 10;

var BACKGROUND_COLOR = 0;
var FOREGROUND_COLOR = 255;

Pagebreak = (function() {
  var game, ball, bricks, p;

  function init() {
    game = createGame();
    startGame();
  }

  function createGame() {
    $('<canvas>', {
      id : 'game',
      width: _window.innerWidth(),
      height: _window.innerHeight()
    }).appendTo('body');
  }

  function startGame() {
    ball = new Ball();
    bricks = new Bricks(ROWS, COLS);
    p = new Processing('game', run);
  }

  function run(p) {
    p.frameRate(60);
    p.size(screen.width, screen.height);
    p.draw = function() {
      p.background(BACKGROUND_COLOR);
      ball.draw(p);
      bricks.draw(p);
    };
  }

  return {
    init: init
  };
})();

var Ball = function() {
  this.radius   = 25;
  this.diameter = 2 * this.radius

  this.pos = {
    x: _window.innerWidth() / 2,
    y: _window.innerHeight() - this.diameter - 20
  };

  this.velocity = {
    x: 10,
    y: -10
  };

  this.draw = function(p) {
    p.fill(FOREGROUND_COLOR)
    p.ellipse(this.pos.x, this.pos.y, this.diameter, this.diameter);
    this.update('x');
    this.update('y');
  };

  this.update = function(coord) {
    this.pos[coord] += this.velocity[coord];

    var dimension = coord === 'x' ? 'innerWidth' : 'innerHeight';

    if (this.pos[coord] <= this.radius)
      this.velocity[coord] = Math.abs(this.velocity[coord]);
    if (this.pos[coord] + this.radius >= _window[dimension]())
      this.velocity[coord] = -Math.abs(this.velocity[coord]);
  };
}

var Bricks = function(rows, cols) {
  this.bricks = new Array(rows);
  for (var row = 0; row < rows; row++) {
    this.bricks[row] = new Array(cols);
    for (var col = 0; col < cols; col++) {
      this.bricks[row][col] = true;
    }
  }

  this.draw = function(p) {
    p.fill(FOREGROUND_COLOR);
    for (var row = 0; row < rows; row++) {
      for (var col = 0; col < cols; col++) {
        if (this.bricks[row][col]) this.drawBrick(p, row, col);
      }
    }
  };

  this.drawBrick = function(p, row, col) {
    var unit = _window.innerWidth() / ((cols - 1) + 10 * (cols + 2));
    var x = unit * (10 * (col + 1) + col)
    var y = unit * (5 * (row + 1) + row)
    p.rect(x, y, 10 * unit, 5 * unit);
  };
}

$(Pagebreak.init);
