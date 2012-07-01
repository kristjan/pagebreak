Pagebreak = (function() {
  var _game, _blocks, _ball;
  var _window;

  function init() {
    _window = $(window);
    _game = createGame();
    startGame();
  }

  function getGame() {
    return game;
  }

  function createGame() {
    return $('<div>', {id : 'game'}).appendTo('body');
  }

  function startGame() {
    resetBall();
    window.animate(draw);
  }

  function resetBall() {
    if (!_ball) _ball = createBall();
  }

  function createBall() {
    var ball = $('<div>', {id: 'ball'}).appendTo(game);
    return {
      el: ball,
      pos: {
        top:  _game.height() - ball.width()  - 20,
        left: _game.width()  - ball.height() - 20
      },
      velocity: {
        x: -10,
        y: -10
      }
    };
  }

  function drawBall() {
    _ball.el.css({
      top: _ball.pos.top,
      left: _ball.pos.left
    });
    _ball.pos.top  += _ball.velocity.y;
    _ball.pos.left += _ball.velocity.x;

    if (_ball.pos.top <= 0) _ball.velocity.y =
      Math.abs(_ball.velocity.y);
    if (_ball.pos.top + _ball.el.height() >= _window.innerHeight())
      _ball.velocity.y = -Math.abs(_ball.velocity.y);

    if (_ball.pos.left <= 0)
      _ball.velocity.x = Math.abs(_ball.velocity.x);
    if (_ball.pos.left + _ball.el.width() >= _window.innerWidth())
      _ball.velocity.x = -Math.abs(_ball.velocity.x);
  }

  function resize() {
    _game.css({
      width: _window.innerWidth(),
      height: _window.innerHeight()
    })
  }

  function draw() {
    drawBall();
    window.animate(draw);
  }

  return {
    init: init,
    getGame : getGame
  };
})();

$(Pagebreak.init);

// http://www.html5canvastutorials.com/advanced/html5-canvas-animation-stage/
window.animate = (function(callback){
  return window.requestAnimationFrame ||
         window.webkitRequestAnimationFrame ||
         window.mozRequestAnimationFrame ||
         window.oRequestAnimationFrame ||
         window.msRequestAnimationFrame ||
         function(callback){
           window.setTimeout(callback, 1000 / 60);
         };
})();
