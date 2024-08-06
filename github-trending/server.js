const express = require('express');
const bodyParser = require('body-parser');
const FetchModule = require('./modules/FetchModule');   
var cors = require('cors')
const app = express();
const def = new FetchModule();

app.use(bodyParser.json());
app.use(cors())

app.get('/repositories', async (req, res) => def.getRepositories(res));

app.get('/repositories/:id', async (req, res) => def.getRepositoryById(req, res));

app.get('/repository/:name', async (req, res) => def.getRepositoryByName(req, res));

app.post('/sync', async (req, res) => def.syncRepositories(res));

def.fetchTrendingRepositories();

let syncInterval = setInterval(def.fetchTrendingRepositories, 1000 * 60 * 2);

app.post('/sync/force', async (req, res) => def.syncRepositoriesForce(res, syncInterval));

const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log("Server is running on port 5500");
});

module.exports = { app };