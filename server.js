const express = require('express');
const mustacheExpress = require('mustache-express');

const app = express();
const mustache = mustacheExpress();
const bodyParser = require('body-parser');
const { Client } = require('pg');


mustache.cache = null;
app.engine('mustache', mustache);
app.set('view engine', 'mustache');


app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:false}));

app.get('/new', (req,res)=>{
    res.render('survey-form');
});

app.post('/surveys/new', (req,res)=>{
    console.log('post body', req.body);

    const client = new Client({

        user: 'postgres',
        host: 'localhost',
        database: 'survey1',
        password: '1234',
        port: 5432,

    });
client.connect()
    .then(()=>{
        console.log(' connection successful');
        const sql = 'INSERT INTO survs (rating, comment, name) VALUES ($1, $2, $3)'
        const params = [req.body.rating, req.body.comment, req.body.name];
        return client.query(sql,params);
    })
    .then((result)=>{
        console.log('results?', result);
        res.redirect('/surveys');
    });

    
});

app.get('/surveys', (req, res)=>{

    const client = new Client({

        user: 'postgres',
        host: 'localhost',
        database: 'survey1',
        password: '1234',
        port: 5432,

    });
client.connect()
    .then(()=>{
        return client.query('SELECT * FROM survs');
        

    })
    .then((results)=>{
        console.log('results?',results);
        res.render('surveys',results);
        
    });

    
});

app.listen(7000, ()=>{
    console.log('listening to port 7000');
});