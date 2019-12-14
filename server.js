const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');// A library used for "hashing" the password
const knex = require('knex');//A library used to connect the server to a database

const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: 'test123',
        database: 'todolist'
    }
});



const app = express();

const dataBase = {
    users: [
        {
            id: 1,
            name: 'Seba',
            email: 'blackthorus@gmail.com',
            password: '012',
            container: [],
            joined: new Date()
        },

        {
            id: 2,
            name: 'Ovi',
            email: 'ovidiu@gmail.com',
            password: '234',
            container: [],
            joined: new Date()
        }
    ],

    login: [
        {
            id: '908',
            hash: '',
            email: 'blackthorus@gmail.com'
        }
    ]
}


//===Middleware===
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors()); //Cors is for fixing security issues with Chrome
// app.use(express.static(__dirname + '/public'));
// ===============

app.get('/', (req, res) => {
    res.json(dataBase.users);
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    //   // ===This function hashes the password===
    //   bcrypt.genSalt(10, function(err, salt) {
    //     bcrypt.hash(password, salt, function(err, hash) {
    //     });
    // });
    // =========================================
    if (email === dataBase.users[0].email && password === dataBase.users[0].password) {
        // res.send('Succes');  the send() can be used, but "express" comes with json() that has more functionalities
        res.json(dataBase.users[0]);
    }
    else {
        res.status(400).json('error logging in');
    }
});

app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    // ===This function hashes the password===
    // bcrypt.genSalt(10, function(err, salt) {
    //     bcrypt.hash(password, salt, function(err, hash) {
    //     });
    // });
    // =========================================
    db('users')
        .returning('*')//A knex function - is returning the "user" to be inserted
        .insert({
            name: name,
            email: email,
            container: [],
            joined: new Date()
        })
        .then(user => res.json(user[0]))
        .catch(err => res.status(400).json('Unable to Register. User allready exists'));


});

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    db.select('*').from('users').where({ id: id })
        .then(user => {
            if (user.length) {
                res.json(user[0]);
            }
            else {
                res.json('User Not Found');
            }
        })
        .catch(err => res.json('Error Getting User'));
});



// // Load hash from your password DB.
// bcrypt.compare("B4c0/\/", hash, function(err, res) {
//     // res === true
// });
// bcrypt.compare("not_bacon", hash, function(err, res) {
//     // res === false
// });

// // As of bcryptjs 2.4.0, compare returns a promise if callback is omitted:
// bcrypt.compare("B4c0/\/", hash).then((res) => {
//     // res === true
// });

app.listen(4000);












/* TODO

--> "/"       res = this is working
   --> "/signin" req = POST
                 res = succes/fail
   --> "/register" req = POST
                   res = the new user created
   --> "/profile:userId"  req = GET
                          res = the new user created

*/