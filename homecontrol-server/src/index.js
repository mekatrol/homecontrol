const express = require("express");
const path = require("path");
const hostname = "localhost";
const port = process.env.PORT || 80;
const app = express();

// serve static assets normally
app.use(express.static(__dirname + "/dist"));

// handle every other route with index.html, which will contain
// a script tag to your application's JavaScript file(s).
app.get("*", function (_ /* request */, response) {
  response.sendFile(path.resolve(__dirname, "./dist/index.html"));
});

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
