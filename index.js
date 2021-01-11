const http = require('http');
const path = require('path');
const fs = require('fs');

const express = require('express');
const sqlite3 = require("sqlite3").verbose();

const app = express();
app.use(express.json());
app.use(express.static(__dirname + '/public'));

if (process.argv[2]) {
  let rawdata = fs.readFileSync(process.argv[2]);
  let {autonomy, departure, arrival, routes_db} = JSON.parse(rawdata);
  const db_name = path.join(__dirname, process.argv[2].substr(0, process.argv[2].lastIndexOf('/')+1), routes_db);
  const db = new sqlite3.Database(db_name, err => {
    if (err) {
      return console.error(err.message);
    }
    // console.log("Connexion réussie à la base de données");
  });

  app.get("/routes", function (req, res, next) {
    var sql = "select * from ROUTES"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
      });
  })

  app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
  });

  app.get("/autonomy", (req, res, next) => {
    res.json({"autonomy": autonomy})
  });

  app.get("/departure", (req, res, next) => {
    res.json({"departure": departure})
  });

  app.get("/arrival", (req, res, next) => {
    res.json({"arrival": arrival})
  });

  // Default response for any other request
  app.use((req, res) => {
    res.status(404);
  });
      
  const server = http.createServer(app);
  const port = 3000;
  server.listen(port);
  
  console.debug('Server listening on port ' + port);
} else {
  console.log("no file selected");
}
