var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var mongoose = require("mongoose");

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var Mensaje = mongoose.model("Message", {
  name: String,
  message: String,
});

var dbUrl = "mongodb://localhost:27017/chat?readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=false";

app.get("/messages", (req, res) => {
  Mensaje.find({}, (err, mensajes) => {
    res.send(mensajes);
  });
});

app.post("/messages", (req, res) => {
  var mensaje = new Mensaje(req.body);
  mensaje.save((err) => {
    if (err) sendStatus(500);
    io.emit("mensaje", req.body);
    res.sendStatus(200);
  });
});

io.on("connection", () => {
  console.log("Un usuario esta conectado, socket encendido");
});
mongoose.set('strictQuery', true);
mongoose.connect(dbUrl, (err) => {
  console.log("Mongodb conectado", err);
});

Mensaje.createCollection();

var servidor = http.listen(3001, () => {
  console.log(
    "el servidor se está ejecutando en el puerto",
    servidor.address().port
  );
});
