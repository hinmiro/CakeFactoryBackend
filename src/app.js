import express from 'express';
import api from './api/index.js';

const hostname = '127.0.0.1';
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api/v1', api);

app.get('/', (req, res) => {
  res.send('**Cake Factory server**');
});

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}`);
});
