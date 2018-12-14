// =================================================================
// BASE SETUP
// =================================================================
const express = require('express');
const cors = require('cors');
const app = express().use(cors());
const bodyParser = require('body-parser');
const neo4j = require('neo4j-driver').v1;

const uri = "bolt://localhost:7687";
const user = "test";
const password = "test";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = 4114; // set our port

// =================================================================
// ROUTES FOR OUR API 
// =================================================================
var router = express.Router(); 

router.get('/', function(req, res){
    res.json({ message: 'Neo4j-App REST API' });
});

router.get('/employee', function(req, res) {
    const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
    const session = driver.session();

    session.run(
        "MATCH (n:Employee) RETURN n"
    ).then(result => {
        session.close();
        console.log('result length: ' + result.records.length);
        driver.close();

        var resultArr = [];
        for(var r of result.records){
            resultArr.push(
                {
                    'id' : r.get(0).properties.id,
                    'name' : r.get(0).properties.name
                }
            );
        }

        res.json({
            'results' : resultArr,
        });
    });
});

router.post('/employee/:id', function(req, res) {
    const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
    const session = driver.session();

    var currentId = req.params.id;
    var name = req.body.name;
    var id = req.body.id;

    session.run(
        "MATCH (n:Employee {id: toFloat($currentId)}) SET n.id = toFloat($id), n.name = $name",
        {
            'currentId': currentId,
            'id': id,
            'name': name
        }
    ).then(result => {
        session.close();
        driver.close();    
    });

    res.json({ message: 'employee updated.' });

});

router.put('/employee', function(req, res) {
    const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
    const session = driver.session();

    var name = req.body.name;
    var id = req.body.id;

    session.run(
        "CREATE (n:Employee {id: toFloat($id), name: $name})",
        {
            'id': id,
            'name': name
        }
    ).then(result => {
        session.close();
        driver.close();    
    });

    res.json({ message: 'employee created.' });   
});

router.delete('/employee/:id', function(req, res) {
    const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
    const session = driver.session();

    var id = req.params.id;

    session.run(
        "MATCH (n:Employee {id: toFloat($id)}) DELETE n",
        {'id': id}
    ).then(result => {
        session.close();
        driver.close();    
    });

    res.json({ message: 'employee deleted.' });   
});

// =================================================================
// REGISTER OUR ROUTES
// =================================================================
app.use('/api', router); // all of our routes will be prefixed with /api

// =================================================================
// START THE SERVER
// =================================================================
app.listen(port);
console.log('Node Server Startup on port: ' + port);
