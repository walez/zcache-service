import * as express from 'express';

import Cache from './cache';
import Handler from './handler';

const app = express();

const cache = new Cache(2);
const handler = new Handler(cache);

app.use(express.json());
app.get('/store', handler.getItems.bind(handler));
app.post('/store', handler.putItems.bind(handler));
app.delete('/store', handler.deleteItems.bind(handler));

export default app;
