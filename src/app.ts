import * as express from 'express';
import * as cors from 'cors';
import * as bodyparser from 'body-parser';
import * as firebase from 'firebase/app';
import * as moment from 'moment';
import 'firebase/firestore';

const app = express();
const path = require('path');

app.use(cors());
app.use(bodyparser.json());

var firebaseConfig = {
    apiKey: "AIzaSyDYB9_HIPzCVIGZkaWxADCzExhNjJ-A5-E",
    authDomain: "trueblue-cdc29.firebaseapp.com",
    databaseURL: "https://trueblue-cdc29.firebaseio.com",
    projectId: "trueblue-cdc29",
    storageBucket: "",
    messagingSenderId: "94332496434",
    appId: "1:94332496434:web:076eca97f372eff5"
  };
  
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

app.get('/', ( req: express.Request, resp: express.Response, next: express.NextFunction ) => {
    resp.sendFile('todos.html', {
        root: path.join(__dirname, './')
    });
});

app.get('/todos', ( req: express.Request, resp: express.Response, next: express.NextFunction ) => {
    let todos = [];
    db.collection('todos').orderBy('elapsed_at').get().then((res) => {
        res.docs.forEach(doc => {
            let todo = doc.data();
            todo.id = doc.id;
            let date = moment(todo.elapsed_at.toDate()).format('DD/MM/YYYY');
            let time = moment(todo.elapsed_at.toDate()).format('HH:mm');
            if (moment() > todo.elapsed_at.toDate()){
                todo.elapsed = true;
            }
            todo.elapsed_at = 'Scade il ' + date + ' alle ' + time;
            todos.push(todo);
        });
        resp.json(todos); 
    });    
});

app.get('/todo/:id', ( req: express.Request, resp: express.Response, next: express.NextFunction ) => {
    db.collection('todos').doc(req.params.id).get().then((res) => {
        let todo = res.data();
        todo.id = res.id;
        todo.elapsed_at = moment(todo.elapsed_at.toDate()).format('DD/MM/YYYY HH:mm');
        resp.json(todo); 
    });
});

app.post('/todo', ( req: express.Request, resp: express.Response, next: express.NextFunction ) => {
    db.collection('todos').add({
        title: req.body.title,
        description: req.body.description,
        elapsed_at: moment(req.body.elapsed_at, "DD/MM/YYYY hh:mm").toDate(),
        state: false
    });
    resp.end();
});

app.put('/todo/:id', ( req: express.Request, resp: express.Response, next: express.NextFunction ) => {
    db.collection('todos').doc(req.params.id).update({
        title: req.body.title,
        description: req.body.description,
        elapsed_at: moment(req.body.elapsed_at, "DD/MM/YYYY hh:mm").toDate()
    })
    resp.end();
});

app.put('/todo/:id/:state', ( req: express.Request, resp: express.Response, next: express.NextFunction ) => {
    db.collection('todos').doc(req.params.id).update({
        state: req.params.state == "true" ? true : false
    })
    resp.end();
});

app.delete('/todo/:id', ( req: express.Request, resp: express.Response, next: express.NextFunction ) => {
    db.collection('todos').doc(req.params.id).delete();
    resp.end();
});

export { app };