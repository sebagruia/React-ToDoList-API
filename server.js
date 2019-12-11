const express = require('express');

const app = express();

const dataBase = {
    users: [
        {
            id: '1',
            name: 'Seba',
            email: 'blackthorus@gmail.com',
            password: '012',
            joined: new Date()
        },

        {
            id: '2',
            name: 'Ovi',
            email: 'ovidiu@gmail.com',
            password: '234',
            joined: new Date()
        }
    ]
}


//===Middleware===
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// app.use(express.static(__dirname + '/public'));
// ===============

app.get('/', (req, res) => {
    res.send('THIS IS WORKING');
});

app.post('/signin', (req, res) => {
    if (req.body.email === dataBase.users[0].email && req.body.password === dataBase.users[0].password) {
        // res.send('Succes');  the send() can be used, but "express" comes with json() that has more functionalities
        res.json('Succes');
    }
    else{
        res.status(400).json('error logging in');
    }
});

app.post('/register', (req, res)=>{
    const {name, email, password} = req.body;
    dataBase.users.push(
        {
            id: '3',
            name: name,
            email: email,
            password: password,
            joined: new Date()
        }
    );
    res.json(dataBase.users[dataBase.users.length-1]);

});

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