const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');// A library used for "hashing" the password
const knex = require('knex');//A library used to connect the server to a database

const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: 'test',
        database: 'todolist'
    }
});

const app = express();

//===Middleware===
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors()); //Cors is for fixing security issues with Chrome
// app.use(express.static(__dirname + '/public'));
// ===============

app.get('/', (req, res) => {
    // res.json(dataBase.users);
    db.select('*').from('users')
        .then(data => {
            res.json(data);
        })
        .catch(err => res.status(400).json("Can't acces database"));

});

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    db.select('email', 'hash').from('login')
        .where({ 'email': email })
        .then(data => {
            // ===This function compares the password to the hashed password===
            const isValid = bcrypt.compareSync(password, data[0].hash);
            // =========================================
            if (isValid) {
                return db.select('*').from('users').where({ 'email': email })
                    .then(user => {
                        res.json(user[0])
                    })
                    .catch(err => res.status(400).json('unable to get user'));
            }
            else {
                res.status(400).json('wrong credentials')

            }
        })
        .catch(err => {
            res.status(400).json('Wrong Credentials')
        });
});

app.post('/register', (req, res) => {
    let { name, email, password } = req.body;
    // ===This function hashes the password===
    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(password, salt);
    // =========================================
    db.transaction(trx => {//this function connects the 2 tables from postgress: "users" and "login"
        trx.insert({
            hash: hash,
            email: email
        })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                return trx.insert({
                    name: name,
                    email: loginEmail[0], //loginEmail[0] because in this way we are selecting the the Object from the Array
                    container: [],
                    joined: new Date()
                })
                    .into('users')
                    .returning('*')//A knex function - is returning the "user" to be inserted
                    .then(user => res.json(user[0]))


            })
            .then(trx.commit)
            .catch(trx.rollback)
    })
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
                res.status(404).json('User Not Found');
            }
        })
        .catch(err => res.json('Error Getting User'));
});


app.put('/save&exit', (req, res) => {
    const { email, container } = req.body;
    db('users')
   
        .where({ email: email })
        .update({container: container})
        .returning('*')
    .then(res=>res.json(`User ${user.container.id} was updated`))
    .catch(err=>res.json('Error Updating User'));

});


const PORT = 4000;
app.listen(process.env.PORT || PORT, () => {
    console.log(`Server running on PORT ${process.env.PORT}`)
});












/* TODO

--> "/"       res = this is working
   --> "/signin" req = POST
                 res = succes/fail
   --> "/register" req = POST
                   res = the new user created
   --> "/profile:userId"  req = GET
                          res = the new user created
   --> "/logout"          req= PUT
                          res = user container

*/



// CREATE TABLE users(
//     todolist(# id serial PRIMARY KEY,
//     todolist(# name varchar(100),
//     todolist(# email text UNIQUE NOT NULL,
//     todolist(# container json,
//     todolist(# joined TIMESTAMP NOT NULL);


// {"{\"id\":\"fdgdfg\",\"listItems\":[{\"item\":\"dfgdfg\",\"lineThrough\":null,\"uncheckIcon\":null,\"checkIcon\":\"none\",\"display\":\"\"},{\"item\":\"dfgdf\",\"lineThrough\":null,\"uncheckIcon\":null,\"checkIcon\":\"none\",\"display\":\"\"},{\"item\":\"dfgdf\",\"lineThrough\":null,\"uncheckIcon\":null,\"checkIcon\":\"none\",\"display\":\"\"}]}","{\"id\":\"dfgdf\",\"listItems\":[]}"}

// "{"id":"wawewe","listItems":[{"item":"qqweqwe","lineThrough":null,"uncheckIcon":null,"checkIcon":"none","display":""},{"item":"qweqwe","lineThrough":null,"uncheckIcon":null,"checkIcon":"none","display":""},{"item":"qweqwe","lineThrough":null,"uncheckIcon":null,"checkIcon":"none","display":""}]}"