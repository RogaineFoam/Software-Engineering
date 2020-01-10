const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');
const SqlString = require('sqlstring');

const app = express();

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, PUT');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// User Calls
// Returns all of a users data
app.get('/api/user/:id', (req, res) => {
    var con = mysql.createConnection({
        host: "localhost",
        user: "alex",
        password: "password",
        database: 'SEProj',
    });

    let id = '%';

    if (req.params.id !== '0') id = req.params.id;

    con.connect(function (err) {
        if (err) throw err;
        con.query("select * from User where UserId like '" + id + "'", function (err, result) {
            if (err) throw err;
            res.send(result);
        });
    });
});
// Adds a user if funct is 'add', otherwise updates a user
app.put('/api/user/:funct', function (req, res) {
    // Funct is either add or funct
    let con = mysql.createConnection({
        host: "localhost",
        user: "alex",
        password: "password",
        database: 'SEProj',
    });

    let funct = req.params.funct;
    // Default sql that returns no rows
    let sql = "select * from User where UserId = 0";

    if (funct === 'add') {
        sql = "insert into User (Email, Password, FirstName, MiddleInitial, LastName, AddressLine1, AddressLine2, Zip, City, State) VALUES ("
            + SqlString.escape(req.body.Email) + ", "
            + SqlString.escape(req.body.Password) + ", "
            + SqlString.escape(req.body.FirstName) + ", "
            + SqlString.escape(req.body.MiddleInitial) + ", "
            + SqlString.escape(req.body.LastName) + ", "
            + SqlString.escape(req.body.AddressLine1) + ", "
            + SqlString.escape(req.body.AddressLine2) + ", "
            + SqlString.escape(req.body.Zip) + ", "
            + SqlString.escape(req.body.City) + ", "
            + SqlString.escape(req.body.State) + ")";
    } else {
        sql = "update User set "
            + "Email = " + SqlString.escape(req.body.Email) + ", "
            + "Password = " + SqlString.escape(req.body.Password) + ", "
            + "FirstName = " + SqlString.escape(req.body.FirstName) + ", "
            + "MiddleInitial = " + SqlString.escape(req.body.MiddleInitial) + ", "
            + "LastName = " + SqlString.escape(req.body.LastName) + ", "
            + "AddressLine1 = " + SqlString.escape(req.body.AddressLine1) + ", "
            + "AddressLine2 = " + SqlString.escape(req.body.AddressLine2) + ", "
            + "Zip = " + SqlString.escape(req.body.Zip) + ", "
            + "City = " + SqlString.escape(req.body.City) + ", "
            + "State = " + SqlString.escape(req.body.State)
            + "where UserId = " + SqlString.escape(req.body.UserId);
    }

    con.connect(function (err) {
        if (err) throw err;
        con.query(sql, function (err, result) {
            if (err) throw err;
            res.send(result);
        });
    });

});

// Landlord Calls
// Returns 1 as isLandlord if the user is a landlord
app.get('/api/isLandlord/:id', (req, res) => {
    var con = mysql.createConnection({
        host: "localhost",
        user: "alex",
        password: "password",
        database: 'SEProj',
    });
    if (req.params.id === 'undefined') {
        res.send();
    } else {
        con.connect(function (err) {
            if (err) throw err;
            con.query("select count(*) as isLandlord from User U right join Landlord L on U.UserId = L.UserId where U.UserId =" + req.params.id.toString(), function (err, result) {
                if (err) throw err;
                res.send(result);
            });
        });
    }
});
// Adds a user to the landlord group if they are not already, otherwise does nothing
app.put('/api/landlord/:id', function (req, res) {
    let con = mysql.createConnection({
        host: "localhost",
        user: "alex",
        password: "password",
        database: 'SEProj',
    });

    // How we'll tell if that user already has a rating for that property
    let sql = "select count(*) as doesExist from Landlord where UserId =" + req.params.id;
    let exists = "";

    con.connect(function (err) {
        if (err) throw err;

        con.query(sql, function (err, result) {
            if (err) throw err;
            exists = result;
        });

        if (exists[0].doesExist === 0) {
            sql = "insert into Landlord (UserId) value (" + req.params.id + ")"
        }

        con.query(sql, function (err, result) {
            if (err) throw err;
            res.send(result);
        });
    });

});

// Admin Calls
// Returns 1 as isAdmin if the user is an admin
app.get('/api/isAdmin/:id', (req, res) => {
    var con = mysql.createConnection({
        host: "localhost",
        user: "alex",
        password: "password",
        database: 'SEProj',
    });
    if (req.params.id === 'undefined') {
        res.send();
    } else {
        con.connect(function (err) {
            if (err) throw err;
            con.query("select count(*) as isAdmin from User U right join Admin L on U.UserId = L.UserId where U.UserId =" + req.params.id.toString(), function (err, result) {
                if (err) throw err;
                res.send(result);
            });
        });
    }
});
// Adds a user to the landlord group if they are not already, otherwise does nothing
app.put('/api/admin/:id', function (req, res) {
    let con = mysql.createConnection({
        host: "localhost",
        user: "alex",
        password: "password",
        database: 'SEProj',
    });

    // How we'll tell if that user already has a rating for that property
    let sql = "select count(*) as doesExist from Admin where UserId =" + req.params.id;
    let exists = "";

    con.connect(function (err) {
        if (err) throw err;

        con.query(sql, function (err, result) {
            if (err) throw err;
            exists = result;
        });

        if (exists.doesExist === 0) {
            sql = "insert into Admin (UserId) value (" + req.params.id + ")"
        }

        con.query(sql, function (err, result) {
            if (err) throw err;
            res.send(result);
        });
    });

});

// Property Calls
// Get all properties if id = 0, else get just the property for that id
app.get('/api/property/:id', (req, res) => {
    var con = mysql.createConnection({
        host: "localhost",
        user: "alex",
        password: "password",
        database: 'SEProj',
    });

    let id = '%';

    if (req.params.id !== '0') id = req.params.id;

    con.connect(function (err) {
        if (err) throw err;
        con.query("select * from Property where PropertyId like '" + id + "'", function (err, result) {
            if (err) throw err;
            res.send(result);
        });
    });

});
// Adds a property
app.put('/api/property/:id', function (req, res) {
    let con = mysql.createConnection({
        host: "localhost",
        user: "alex",
        password: "password",
        database: 'SEProj',
    });

    sql = "insert into Property (LandlordId, AddressLine1, AddressLine2, City, State, Zip, Description, DayRent, AvaliableStart, AvaliableEnd) VALUES ("
        + SqlString.escape(req.params.id) + ", "
        + SqlString.escape(req.body.AddressLine1) + ", "
        + SqlString.escape(req.body.AddrissLine2) + ", "
        + SqlString.escape(req.body.City) + ", "
        + SqlString.escape(req.body.State) + ", "
        + SqlString.escape(req.body.Zip) + ", "
        + SqlString.escape(req.body.Description) + ", "
        + SqlString.escape(req.body.DayRent) + ", "
        + SqlString.escape(req.body.AvaliableStart) + ", "
        + SqlString.escape(req.body.AvaliableEnd) + ", "
        + ")";


    con.connect(function (err) {
        if (err) throw err;
        con.query(sql, function (err, result) {
            if (err) throw err;
            res.send(result);
        });
    });

});

//Photo Calls
// Gets the photo that's attached to a property
app.get('/api/photo/:id', (req, res) => {
    var con = mysql.createConnection({
        host: "localhost",
        user: "alex",
        password: "password",
        database: 'SEProj',
    });
    con.connect(function (err) {
        if (err) throw err;
        con.query("select ImageData from Photo where PropertyId =" + req.params.id, function (err, result) {
            if (err) throw err;
            res.send(result);
        });
    });
});
// Adds the photo if it does not exist, else replaces the photo
app.put('/api/photo/:id', function (req, res) {
    let con = mysql.createConnection({
        host: "localhost",
        user: "alex",
        password: "password",
        database: 'SEProj',
    });

    // How we'll tell if that user already has a rating for that property
    let sql = "select count(*) as doesExist from Photo where PropertyId =" + req.params.id;
    let exists = "";

    con.connect(function (err) {
        if (err) throw err;

        con.query(sql, function (err, result) {
            if (err) throw err;
            exists = result;
        });

        if (exists.doesExist === 0) {
            sql = "insert into Photo (ImageData, PropertyId) VALUES ("
                + req.body.ImageData + ', '
                + req.params.id + ')';
        } else {
            sql = "update Photo set "
                + "ImageData = " + req.body.ImageData;
        }

        con.query(sql, function (err, result) {
            if (err) throw err;
            res.send(result);
        });
    });

});

// Reservation Calls
// Returns all non-cancelled reservations for a user
app.get('/api/reservation/:id', (req, res) => {
    var con = mysql.createConnection({
        host: "localhost",
        user: "alex",
        password: "password",
        database: 'SEProj',
    });
    con.connect(function (err) {
        if (err) throw err;
        con.query("select * from Reservations where UserId = " + req.params.id + " and isCancelled = false", function (err, result) {
            if (err) throw err;
            res.send(result);
        });
    });
});
// Creates a reservation for a user and a property id
app.put('/api/reservation/:propId/:uId', function (req, res) {
    let con = mysql.createConnection({
        host: "localhost",
        user: "alex",
        password: "password",
        database: 'SEProj',
    });

    con.connect(function (err) {
        if (err) throw err;

        let sql = "insert into Reservations (UserId, PropertyId, ReservationStart, ReservationEnd) VALUES ("
            + req.params.uId + ', '
            + req.params.propId + ', '
            + req.body.ReservationStart
            + req.body.ReservationEnd + ')';

        con.query(sql, function (err, result) {
            if (err) throw err;
            res.send(result);
        });
    });

});
// Marks a reservation as cancelled
app.put('/api/reservation/:id', function (req, res) {
    let con = mysql.createConnection({
        host: "localhost",
        user: "alex",
        password: "password",
        database: 'SEProj',
    });

    con.connect(function (err) {
        if (err) throw err;

        let sql = "update Reservations set isCancelled = true where ReservationId =" + req.params.id;

        con.query(sql, function (err, result) {
            if (err) throw err;
            res.send(result);
        });
    });

});

// Rating Calls
// Returns all ratings for a property
app.get('/api/rating/:id', (req, res) => {
    var con = mysql.createConnection({
        host: "localhost",
        user: "alex",
        password: "password",
        database: 'SEProj',
    });
    con.connect(function (err) {
        if (err) throw err;
        con.query("select * from Ratings where PropertyId =" + req.params.id, function (err, result) {
            if (err) throw err;
            res.send(result);
        });
    });

});
// Adds a rating if one does not exist, otherwise updates it
app.put('/api/rating/:propId/:uId', function (req, res) {
    let con = mysql.createConnection({
        host: "localhost",
        user: "alex",
        password: "password",
        database: 'SEProj',
    });

    // How we'll tell if that user already has a rating for that property
    let sql = "select count(RatingValue) as doesExist from Ratings where UserId =" + req.params.uId + "and PropertyId =" + req.params.propId;
    let exists = "";

    con.connect(function (err) {
        if (err) throw err;

        con.query(sql, function (err, result) {
            if (err) throw err;
            exists = result;
        });

        if (exists.doesExist === 0) {
            sql = "insert into Ratings (UserId, PropertyId, RatingValue) VALUES ("
                + req.params.uId + ', '
                + req.params.propId + ', '
                + req.body.RatingValue + ')';
        } else {
            sql = "update Ratings set "
                + "RatingValue = " + req.body.RatingValue;
        }

        con.query(sql, function (err, result) {
            if (err) throw err;
            res.send(result);
        });
    });

});

// Report Calls
// Returns all a report data
app.get('/api/report', (req, res) => {
    var con = mysql.createConnection({
        host: "localhost",
        user: "alex",
        password: "password",
        database: 'SEProj',
    });
    con.connect(function (err) {
        if (err) throw err;
        con.query("select * from Report", function (err, result) {
            if (err) throw err;
            res.send(result);
        });
    });

});
// Creates a report for propertyId from userId
app.put('/api/report/:propId/:uId', function (req, res) {
    let con = mysql.createConnection({
        host: "localhost",
        user: "alex",
        password: "password",
        database: 'SEProj',
    });

    con.connect(function (err) {
        if (err) throw err;

        let sql = "insert into Report (PropertyId, ReporterId, ReportDetails) VALUES ("
            + req.params.propId + ', '
            + req.params.uId + ', '
            + SqlString.escape(req.body.ReportDetails) + ')';

        con.query(sql, function (err, result) {
            if (err) throw err;
            res.send(result);
        });
    });

});
// Marks a report as resolved
app.put('/api/report/:id', function (req, res) {
    let con = mysql.createConnection({
        host: "localhost",
        user: "alex",
        password: "password",
        database: 'SEProj',
    });

    con.connect(function (err) {
        if (err) throw err;

        let sql = "update Report set isResolved = true where ReportId =" + req.params.id;

        con.query(sql, function (err, result) {
            if (err) throw err;
            res.send(result);
        });
    });

});

// Payment Calls
// Returns a users payment info
app.get('/api/payment/:id', (req, res) => {
    var con = mysql.createConnection({
        host: "localhost",
        user: "alex",
        password: "password",
        database: 'SEProj',
    });
    if (req.params.id === 'undefined') {
        res.send();
    } else {
        con.connect(function (err) {
            if (err) throw err;
            con.query("select * from `Payment Info` where UserId =" + req.params.id, function (err, result) {
                if (err) throw err;
                res.send(result);
            });
        });
    }
});
// Adds a payment method to a user
app.put('/api/payment/:id', function (req, res) {
    let con = mysql.createConnection({
        host: "localhost",
        user: "alex",
        password: "password",
        database: 'SEProj',
    });

    sql = "insert into `Payment Info` (UserId, BillingFirstName, BillingLastName, BillingAddressLine1, BillingAddressLine2, BillingZip, BillingCity, BillingState, CreditCardNumber) VALUES ("
        + SqlString.escape(req.params.id) + ", "
        + SqlString.escape(req.body.BillingFirstName) + ", "
        + SqlString.escape(req.body.BillingLastName) + ", "
        + SqlString.escape(req.body.BillingAddressLine1) + ", "
        + SqlString.escape(req.body.BillingAddressLine2) + ", "
        + SqlString.escape(req.body.BillingZip) + ", "
        + SqlString.escape(req.body.BillingCity) + ", "
        + SqlString.escape(req.body.BillingState) + ", "
        + SqlString.escape(req.body.CreditCardNumber) + ", "
        + ")";

    con.connect(function (err) {
        if (err) throw err;
        con.query(sql, function (err, result) {
            if (err) throw err;
            res.send(result);
        });
    });

});
// Removes the payment method for a user
app.put('/api/payment/:id', function (req, res) {
    let con = mysql.createConnection({
        host: "localhost",
        user: "alex",
        password: "password",
        database: 'SEProj',
    });

    con.connect(function (err) {
        if (err) throw err;
        con.query("delete from `Payment Info` where UserId = " + req.params.id, function (err, result) {
            if (err) throw err;
            res.send(result);
        });
    });

});

// Actually running the damn thing
app.listen(3000, () => console.log('Listening on 3000...'));
