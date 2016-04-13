/**
 * Author: Methew Guda
 * Author ID: A00381751
 * Dedsription: Modified University DB app that reads data from MongoDB server.
 * Date: 08-04-2016
 */

var bcrypt = require('bcrypt');
var express = require('express');
var mongodb = require('mongodb');

//#############################################
// These const/vars should be changed to use your own 
// ID, password, databse, and ports
const SERVER_PORT = 8225;
var user = "m_guda";
var password = "381751";
var database = 'm_guda';
//#############################################


//These should not change, unless the server spec changes
var host = '127.0.0.1';
var port = '27017'; // Default MongoDB port



// Now create a connection String to be used for the mongo access
var connectionString = 'mongodb://' + user + ':' + password + '@' +
        host + ':' + port + '/' + database;


//#############################################
//the var for the university collections, no need to change
var universitiesCollection;
const NAME_OF_COLLECTION = 'universities';
//#############################################


//CORS Middleware, causes Express to allow Cross-Origin Requests
// Do NOT change anythinghere
var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers','Content-Type');
    next();
};


//set up the server variables
var app = express();
app.use(express.bodyParser());
app.use(allowCrossDomain);
app.use('/scripts', express.static(__dirname + '/scripts'));
app.use('/css', express.static(__dirname + '/css'));
app.use(express.static(__dirname));



//now connect to the db
mongodb.connect(connectionString, function (error, db) {
    
    //if something is wrong, it'll crash
    //you could add a try-catch block to handle it, 
    //but not needed for the assignment
    if (error) {
        throw error;
    }//end if


    //#############################################
    universitiesCollection = db.collection(NAME_OF_COLLECTION);
    //#############################################



    // Close the database connection and server when the application ends
    process.on('SIGTERM', function () {
        console.log("Shutting server down.");
        db.close();
        app.close();
    });


    //now start the application server
    var server = app.listen(SERVER_PORT, function () {
        console.log('Listening on port %d',
                server.address().port);
    });
});


//#############################################
app.post('/saveUniversity', function (request, response) {

    //request.body contains the stringified object
    console.log(request.body);

    universitiesCollection.insert(request.body,
        function (err, result) {//use empty to get all records
            if (err) {
                return response.send(400,'An error occurred saving a record.');
            }//end if

            return response.send(200, "Record saved successfully.");
        });
    });
//#############################################


//#############################################
app.post('/getUniversity', function (request, response) {

    //case insensitive regex pattern using request.body.Name
    var searchKey = new RegExp(request.body.Name,"i");
    
    console.log('Retrieving records: ' + searchKey.toString() );

    universitiesCollection.find({"Name" : searchKey},
        function (err, result) {
            if (err) {
                return response.send(400, 'An error occurred retrieving records.');
            }//end if

            //console.log(result);

            //now result is expected to be an array of rectangles
            result.toArray(
                function (err, resultArray) {
                    if (err) {
                        return response.send(400,
                            'An error occurred processing your records.');
                    }//end if

                    //if succeeded, send it back to the calling thread
                    return response.send(200, resultArray);
                });
        });
});
//#############################################


//#############################################
app.post('/getAllUniversities', function (request, response) {

    console.log('Retrieving all the records.');

    universitiesCollection.find(
        function (err, result) {//use empty to get all records
            if (err) {
                return response.send(400,'An error occurred retrieving records.');
            }//end if

            console.log(result);

            //now result is expected to be an array of rectangles
            result.toArray(
                function (err, resultArray) {
                    if (err) {
                        return response.send(400,
                            'An error occurred processing your records.');
                    }//end if

                    //if succeeded, send it back to the calling thread
                    return response.send(200, resultArray);
                });
        });
});
//#############################################


//#############################################
app.post('/deleteUniversity', function (request, response) {

    //case insensitive regex pattern using request.body.Name
    var searchKey = new RegExp(request.body.Name,"i");
    
    console.log('Retrieving records: ' + searchKey.toString() );

    universitiesCollection.remove(
        //find docs with x being the value specified and remove them all
        {Name: searchKey},
        function (err, returnedStr) {
            if (err) {
                return response.send(
                    400,'An error occurred retrieving records.');
            }//end if

            var obj = JSON.parse(returnedStr);//convert it to an obj
            console.log(obj.n + " records"); //contain # of remvoved docs

            return response.send(200, returnedStr);
        });
});
//#############################################
