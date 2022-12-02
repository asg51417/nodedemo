const http = require("http");
const app = require("./app");
const server = http.createServer(app); // create http server with express 

const { API_PORT } = process.env; // destructing port variable from environment file
const port = process.env.PORT || API_PORT;

// server listening 
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});