import { app } from './app';
import * as http from 'http';

const server = http.createServer(app);

server.listen(5000);