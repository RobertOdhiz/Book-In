import express, { json, urlencoded } from 'express';
import routes from './routes';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use('/', routes);

const port = process.env.PORT || 5000;
app.listen(port, () => { console.log(`app listening on port ${port}`) })