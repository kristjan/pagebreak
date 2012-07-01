var _window = $(window);
_window.smallestDimension = function() {
  var width = this.innerWidth();
  var height = this.innerHeight();
  return (width < height) ? width : height;
};

var ROWS = 5;
var COLS = 10;

var BALL_RATIO = .03;

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
      bricks.checkCollisions(ball);
    };
  }

  return {
    init: init
  };
})();

var Ball = function() {
  this.radius   = 25;

  this.diameter = function() {
    return 2 * this.radius;
  };

  this.pos = {
    x: _window.innerWidth() / 2,
    y: _window.innerHeight() - this.diameter() - 20
  };

  this.velocity = {
    x: 10,
    y: -10
  };

  this.draw = function(p) {
    this.radius = BALL_RATIO * _window.smallestDimension();
    p.fill(FOREGROUND_COLOR)
    p.ellipse(this.pos.x, this.pos.y, this.diameter(), this.diameter());
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

  this.bounce = function(direction) {
    switch (direction) {
      case 'x': this.velocity.x *= -1; break;
      case 'y': this.velocity.y *= -1; break;
      default:
        this.velocity.x *= -1;
        this.velocity.y *= -1;
    }
  }
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
    var brick = this.getGeometry(row, col);
    p.rect(brick.x, brick.y, brick.width, brick.height);
  };

  this.checkCollisions = function(ball) {
    for (var row = 0; row < rows; row++) {
      for (var col = 0; col < cols; col++) {
        if (this.bricks[row][col]) this.checkCollision(ball, row, col);
      }
    }
  };

  this.checkCollision = function(ball, row, col) {
    var brick = this.getGeometry(row, col);
    // Distance from ball center to brick center
    var dist = {
      x: Math.abs(ball.pos.x - (brick.x + brick.width  / 2)),
      y: Math.abs(ball.pos.y - (brick.y + brick.height / 2))
    }

    var colliding;

    if (dist.x > brick.width  / 2 + ball.radius ||
        dist.y > brick.height / 2 + ball.radius) {
      // Ball center is more than a radius from brick center in either direction
      // Can't possibly be colliding
      colliding = false;
    } else if (dist.x <= brick.width/2 || dist.y <= brick.height/2) {
      // Ball center is closer than brick thickness in either direction
      // Must be colliding
      colliding = true;
    }

    if (!colliding) {
      var diag = Math.pow(dist.x - brick.width  / 2, 2) +
                 Math.pow(dist.y - brick.height / 2, 2)
      // Colliding if ball center is less than a radius from brick corner
      if (diag <= Math.pow(ball.radius, 2)) colliding = true;
    }

    if (colliding) {
      this.bricks[row][col] = false;
      // Distance from ball center to edges of brick
      var edgeDist = {
        x: dist.x - brick.width  / 2,
        y: dist.y - brick.height / 2
      }
      if (edgeDist.x < brick.width / 2) {
        // Ball came in from the top or bottom
        ball.bounce('y');
      } else if (edgeDist.y < brick.height / 2) {
        // Ball came in from left or right
        ball.bounce('x');
      } else {
        // Ball hit the corner
        ball.bounce();
      }
    }
  };

  this.getGeometry = function(row, col) {
    var units = {
      width:  _window.innerWidth() / ((cols - 1) + 10 * (cols + 2)),
      height: (_window.innerHeight() / 2) / ((rows - 1) + 10 * (rows + 2)),
    };
    return {
      x     : units.width  * (10 * (col + 1) + col),
      y     : units.height * (5 * (row + 1) + row),
      width : units.width  * 10,
      height: units.height * 5
    };
  }
}

$(Pagebreak.init);
