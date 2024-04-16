import app from "./app.js";
import "dotenv/config";

const hostname = "127.0.0.1";
const port = 3000;

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
