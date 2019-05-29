var db = require("../models");

module.exports = function(app) {
  app.get("/api/characters", function(req, res) {
    db.Character.findAll({}).then(function(dbCharacter) {
      res.json(dbCharacter);
    });
  });

  app.get("/api/characters/:id", function(req, res) {
    db.Character.findOne({
      where: {
        id: req.params.id
      },
      include: [db.Item]
    }).then(function(dbCharacter) {
      res.json(dbCharacter);
    });
  });

  app.put("/api/characters", function(req, res) {
    db.Character.update(
      { activeFlag: req.body.activeFlag, charSelected: req.body.charSelected },
      {
        where: {
          id: req.body.id
        }
      }
    ).then(function(results) {
      res.json(results);
    });
  });

  app.get("/api/players", function(req, res) {
    db.Player.findAll({}).then(function(dbExamples) {
      res.json(dbExamples);
    });
  });

  app.get("/api/board", function(req, res) {
    db.Board.findAll({}).then(function(board) {
      res.json(board);
    });
  });

  app.put("/api/board", function(req, res) {
    db.Board.findAll({}).then(function(board) {
      var newSpots = JSON.parse(board[0].boardSpots);

      if (board[0].currentTurn == req.body.playerId) {
        for (var i = 0; i < newSpots.spots.length; i++) {
          if (
            newSpots.spots[i].hasPlayer &&
            newSpots.spots[i].playerId === parseInt(req.body.playerId)
          ) {
            newSpots.spots[i].hasPlayer = false;
            newSpots.spots[i].playerId = 0;
          }
        }
        console.log(req.body);
        newSpots.spots[req.body.newPosition].playerId = parseInt(
          req.body.playerId
        );
        newSpots.spots[req.body.newPosition].hasPlayer = true;

        var boardString = JSON.stringify(newSpots);

        db.Board.update({ boardSpots: boardString }, { where: { id: 1 } }).then(
          function(data) {
            res.json(data);
          }
        );
      }
    });
  });

  app.post("/api/players", function(req, res) {
    db.Player.create(req.body).then(function(dbExample) {
      res.render("gameboard");
    });
  });

  app.delete("/api/players", function(req, res) {
    db.Player.destroy({ where: {}, truncate: true }).then(function(data) {
      res.json(data);
      db.Board.destroy({ where: {}, truncate: true });
    });
  });
};
