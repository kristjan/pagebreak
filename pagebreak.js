Pagebreak = (function() {
  var _game, _blocks, _ball;
  var _window;

  function init() {
    _window = $(window).resize(resize);
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
    resize();
    resetBall();
  }

  function resetBall() {
    if (!_ball) _ball = createBall();
    _ball.css({
      top:  _game.height() - _ball.width()  - 20,
      left: _game.width()  - _ball.height() - 20
    })
  }

  function createBall() {
    return $('<div>', {id: 'ball'}).appendTo(game);
  }

  function resize() {
    _game.css({
      width: _window.innerWidth(),
      height: _window.innerHeight()
    })
  }

  return {
    init: init,
    getGame : getGame
  };
})();

$(Pagebreak.init);
