var _window = $(window);

Pagebreak = (function() {
  var game, ball, p;

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
    p = new Processing('game', run);
  }

  function run(p) {
    p.frameRate(60);
    p.size(screen.width, screen.height);
    p.draw = function() {
      p.background(0);
      ball.draw(p);
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
    x: _window.innerWidth()  - this.diameter - 20,
    y: _window.innerHeight() - this.diameter - 20
  };

  this.velocity = {
    x: -10,
    y: -10
  };

  this.draw = function(p) {
    p.fill(255);
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

$(Pagebreak.init);
