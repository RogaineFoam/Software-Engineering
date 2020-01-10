// Classes for all my DB tables for easy JSON conversion
class User {
    constructor(UserId, Email, Password, FirstName, MiddleInitial, LastName, AddressLine1, AddressLine2, Zip, City, State) {
        this.UserId = UserId;
        this.Email = Email;
        this.Password = Password;
        this.FirstName = FirstName;
        this.MiddleInitial = MiddleInitial;
        this.LastName = LastName;
        this.AddressLine1 = AddressLine1;
        this.AddressLine2 = AddressLine2;
        this.Zip = Zip;
        this.City = City;
        this.State = State;
    }
}

class Property {
    constructor(LandlordId, AddressLine1, AddressLine2, City, State, Zip, Description, DayRent, AvaliableStart, AvaliableEnd) {
        this.LandlordId = LandlordId;
        this.AddressLine1 = AddressLine1;
        this.AddressLine2 = AddressLine2;
        this.City = City;
        this.State = State;
        this.Zip = Zip;
        this.Description = Description;
        this.DayRent = DayRent;
        this.AvaliableStart = AvaliableStart;
        this.AvaliableEnd = AvaliableEnd;
    }
}

class Photo {
    constructor(ImageData) {
        this.ImageData = ImageData;
    }
}

class Reservation {
    constructor(ReservationId, PropertyId, ReservationStart, ReservationEnd) {
        this.ReservationId = ReservationId;
        this.PropertyId = PropertyId;
        this.ReservationStart = ReservationStart;
        this.ReservationEnd = ReservationEnd;
    }
}

class Rating {
    constructor(RatingValue) {
        this.RatingValue = RatingValue;
    }
}

class Report {
    constructor(ReportId, PropertyId, ReportDetails, isResolved) {
        this.ReportId = ReportId;
        this.PropertyId = PropertyId;
        this.ReportDetails = ReportDetails;
        this.isResolved = isResolved;
    }
}

class Payment {
    constructor(BillingFirstName, BillingLastName, BillingAddressLine1, BillingAddressLine2, BillingZip, BillingCity, BillingState, CreditCardNumber) {
        this.BillingFirstName = BillingFirstName;
        this.BillingLastName = BillingLastName;
        this.BillingAddressLine1 = BillingAddressLine1;
        this.BillingAddressLine2 = BillingAddressLine2;
        this.BillingZip = BillingZip;
        this.BillingCity = BillingCity;
        this.BillingState = BillingState;
        this.CreditCardNumber = CreditCardNumber;
    }
}

// index functions
// Verifies a client is in the database and sets them to active in the session
function logInUser(email = document.getElementById('email').value, password = document.getElementById('password').value) {
    const Http = new XMLHttpRequest();
    let url = 'http://localhost:3000/api/user/0';
    Http.open("GET", url);
    Http.send();

    var parsedJSON = '';
    var isCorrect = false;

    Http.onreadystatechange = function () {
        if (this.readyState === 4 && Http.responseText !== '[]') {
            parsedJSON = JSON.parse(Http.responseText);

            for (var i = 0; i < parsedJSON.length; i++) {
                if (parsedJSON[i].Email === email && parsedJSON[i].Password === password) {
                    sessionStorage.userId = parsedJSON[i].UserId;
                    document.getElementById('submit').disabled = true;
                    document.getElementById('subStatus').innerHTML = "";
                    isCorrect = true;
                    alert('You have been logged in');
                }

            }
        }
    };

    if (!isCorrect) {
        document.getElementById('subStatus').innerHTML = "Error, user not found in the database";
    }

}

// createAccount functions
// Creates a new user and puts them in the database
function addUser() {
    let email = document.getElementById('email').value;
    let fname = document.getElementById('fName').value;
    let mname = document.getElementById('mName').value;
    let lname = document.getElementById('lName').value;
    let addr1 = document.getElementById('addressl1').value;
    let addr2 = document.getElementById('addressl2').value;
    let zip = document.getElementById('zip').value;
    let city = document.getElementById('city').value;
    let state = document.getElementById('state').value;
    let pass = document.getElementById('pass').value;

    let newUserJSON = JSON.stringify(new User(0, email, pass, fname, mname, lname, addr1, addr2, zip, city, state));

    fetch('http://localhost:3000/api/user/add', {
        method: 'PUT',
        body: newUserJSON,
        headers: {'Content-Type': 'application/json'}
    });

    alert('You are now a registered user of this site');
    document.getElementById('submit').disabled = true;
}

// propView function
// Displays the current property from session storage
function displayProperty(propId = sessionStorage.propertyId) {
    const Http = new XMLHttpRequest();
    let url = 'http://localhost:3000/api/property/' + propId;
    Http.open("GET", url);
    Http.send();

    var parsedPropertyJSON = '';
    var parsedImageJSON = '';

    Http.onreadystatechange = function () {
        if (this.readyState === 4 && Http.responseText !== '[]') {
            parsedPropertyJSON = JSON.parse(Http.responseText);

            document.getElementById('propAddr').innerHTML = parsedPropertyJSON[0].AddressLine1 + ' ' + parsedPropertyJSON[0].City + ', ' + parsedPropertyJSON[0].State + ' ' + parsedPropertyJSON[0].Zip;
            document.getElementById('propRate').innerHTML = '$' + parsedPropertyJSON[0].DayRent + ' per day.';
            document.getElementById('propDesc').innerHTML = parsedPropertyJSON[0].Description;
            document.getElementById('availRange').innerHTML = 'Avaliable from ' + parsedPropertyJSON[0].AvaliableStart.substr(0, 10) + ' to ' + parsedPropertyJSON[0].AvaliableEnd.substr(0, 10);
            url = 'http://localhost:3000/api/photo/' + propId;
            Http.open("GET", url);
            Http.send();

            Http.onreadystatechange = function () {
                if (this.readyState === 4 && Http.responseText !== '[]') {
                    parsedImageJSON = JSON.parse(Http.responseText);

                    document.getElementById('propImg').src = parsedImageJSON[0].ImageData;
                }
            };
        }
    };
}

// propertyList functions
// Populates the list with the properties
function populatePropertyList() {
    const Http = new XMLHttpRequest();
    const url = 'http://localhost:3000/api/property/0';
    Http.open("GET", url);
    Http.send();

    var parsedJSON = '';

    Http.onreadystatechange = function () {
        if (this.readyState === 4 && parsedJSON !== []) {
            parsedJSON = JSON.parse(Http.responseText);
            displayQuoteHistory(parsedJSON);
        }
    };
}

function displayQuoteHistory(parsedJSON) {
    var propList = [];
    for (let i = 0; i < parsedJSON.length; i++) {
        var tempProp = new Property(parsedJSON[i].PropertyId, parsedJSON[i].AddressLine1, parsedJSON[i].AddressLine2, parsedJSON[i].City, parsedJSON[i].State, parsedJSON[i].Zip, parsedJSON[i].Description, parsedJSON[i].DayRent, parsedJSON[i].AvaliableStart, parsedJSON[i].AvaliableEnd);

        propList.push(tempProp);
    }

    // for each outer array row
    for (let i = 0; i < propList.length; i++) {
        var tr = document.createElement("tr");

        var td = document.createElement("td");
        var txt = document.createTextNode(propList[i].AddressLine1 + " " + propList[i].City + ", " + propList[i].State + " " + propList[i].Zip);
        td.appendChild(txt);
        tr.appendChild(td);

        var td = document.createElement("td");
        var txt = document.createTextNode(propList[i].Description);
        td.appendChild(txt);
        tr.appendChild(td);

        var td = document.createElement("td");
        var txt = document.createTextNode('$' + propList[i].DayRent + " per day");
        td.appendChild(txt);
        tr.appendChild(td);

        var td = document.createElement("td");
        var txt = document.createTextNode(propList[i].AvaliableStart.substr(0, 10));
        td.appendChild(txt);
        tr.appendChild(td);

        var td = document.createElement("td");
        var txt = document.createTextNode(propList[i].AvaliableEnd.substr(0, 10));
        td.appendChild(txt);
        tr.appendChild(td);

        var td = document.createElement("td");
        var button = document.createElement("button");
        button.innerHTML = "View Property";
        button.addEventListener("click", function () {
            sessionStorage.propertyId = propList[i].LandlordId;
            window.location.href = 'propView.html';
        });
        td.appendChild(button);
        tr.appendChild(td);

        // append row to table
        document.getElementById("quoteHistoryTable").appendChild(tr);
    }
}

// admin functions
// Populates the list with the reports
function populateReportList() {
    const Http = new XMLHttpRequest();
    const url = 'http://localhost:3000/api/report';
    Http.open("GET", url);
    Http.send();

    var parsedJSON = '';

    Http.onreadystatechange = function () {
        if (this.readyState === 4 && parsedJSON !== []) {
            parsedJSON = JSON.parse(Http.responseText);
            displayReports(parsedJSON);
        }
    };
}

function displayReports(parsedJSON) {
    var propList = [];
    for (let i = 0; i < parsedJSON.length; i++) {
        var tempProp = new Report(parsedJSON[i].ReportId, parsedJSON[i].PropertyId, parsedJSON[i].ReportDetails, parsedJSON[i].isResolved);

        propList.push(tempProp);
    }

    // for each outer array row
    for (let i = 0; i < propList.length; i++) {
        var tr = document.createElement("tr");

        var td = document.createElement("td");
        var txt = document.createTextNode(propList[i].ReportDetails);
        td.appendChild(txt);
        tr.appendChild(td);

        var td = document.createElement("td");
        var txt = document.createTextNode(propList[i].isResolved ? 'Yes' : 'No');
        td.appendChild(txt);
        tr.appendChild(td);

        var td = document.createElement("td");
        var button = document.createElement("button");
        button.innerHTML = "View Property";
        button.addEventListener("click", function () {
            sessionStorage.propertyId = propList[i].PropertyId;
            window.location.href = 'propView.html';
        });
        td.appendChild(button);
        tr.appendChild(td);

        var td = document.createElement("td");
        var button = document.createElement("button");
        button.innerHTML = "Dismiss";
        button.addEventListener("click", function () {
            fetch('http://localhost:3000/api/report/' + propList[i].ReportId, {
                method: 'PUT',
                body: [],
                headers: {'Content-Type': 'application/json'}
            });
            window.location.href = window.location.href;
        });
        td.appendChild(button);
        tr.appendChild(td);

        // append row to table
        document.getElementById("quoteHistoryTable").appendChild(tr);
    }
}

// Current Reservations
// Populates the list with the reservations
function populateReservationList() {
    const Http = new XMLHttpRequest();
    const url = 'http://localhost:3000/api/reservation/' + sessionStorage.userId;
    Http.open("GET", url);
    Http.send();

    var parsedJSON = '';

    Http.onreadystatechange = function () {
        if (this.readyState === 4 && parsedJSON !== []) {
            parsedJSON = JSON.parse(Http.responseText);
            displayReservations(parsedJSON);
        }
    };
}

function displayReservations(parsedJSON) {
    var propList = [];
    for (let i = 0; i < parsedJSON.length; i++) {
        var tempProp = new Reservation(parsedJSON[i].ReservationId, parsedJSON[i].PropertyId, parsedJSON[i].ReservationStart, parsedJSON[i].ReservationEnd);

        propList.push(tempProp);
    }

    // for each outer array row
    for (let i = 0; i < propList.length; i++) {
        var tr = document.createElement("tr");

        var td = document.createElement("td");
        var button = document.createElement("button");
        button.innerHTML = "View Property";
        button.addEventListener("click", function () {
            sessionStorage.propertyId = propList[i].PropertyId;
            window.location.href = 'propView.html';
        });
        td.appendChild(button);
        tr.appendChild(td);

        var td = document.createElement("td");
        var txt = document.createTextNode(propList[i].ReservationStart.substr(0, 10));
        td.appendChild(txt);
        tr.appendChild(td);

        var td = document.createElement("td");
        var txt = document.createTextNode(propList[i].ReservationEnd.substr(0, 10));
        td.appendChild(txt);
        tr.appendChild(td);

        var td = document.createElement("td");
        var button = document.createElement("button");
        button.innerHTML = "Cancel";
        button.addEventListener("click", function () {
            alert("A 5% cancellation has been charged to your account");
            fetch('http://localhost:3000/api/reservation/' + propList[i].ReservationId, {
                method: 'PUT',
                body: [],
                headers: {'Content-Type': 'application/json'}
            });
            window.location.href = window.location.href;
        });
        td.appendChild(button);
        tr.appendChild(td);

        // append row to table
        document.getElementById("quoteHistoryTable").appendChild(tr);
    }
}

// reportProperty
function reportProperty(pId = sessionStorage.propertyId, uId = sessionStorage.userId) {
    let newReport = new Report(0, pId, document.getElementById('repDetails').value, false);

    reqJSON = JSON.stringify(newReport);

    fetch('http://localhost:3000/api/report/' + pId + '/' + uId, {
        method: 'PUT',
        body: reqJSON,
        headers: {'Content-Type': 'application/json'}
    });

    alert('Your report has been submitted');
    window.location.href = 'propertyList.html';
    return false;
}

// accountInfo function
// Populate account info form
function populateAccountInfo(id = sessionStorage.userId) {
    const Http = new XMLHttpRequest();
    let url = 'http://localhost:3000/api/user/' + id;
    Http.open("GET", url);
    Http.send();

    var parsedJSON = '';

    Http.onreadystatechange = function () {
        if (this.readyState === 4 && Http.responseText !== '[]') {
            parsedJSON = JSON.parse(Http.responseText);

            document.getElementById('email').value = parsedJSON[0].Email;
            document.getElementById('fName').value = parsedJSON[0].FirstName;
            document.getElementById('mName').value = parsedJSON[0].MiddleInitial;
            document.getElementById('lName').value = parsedJSON[0].LastName;
            document.getElementById('addressl1').value = parsedJSON[0].AddressLine1;
            document.getElementById('addressl2').value = parsedJSON[0].AddressLine2;
            document.getElementById('zip').value = parsedJSON[0].Zip;
            document.getElementById('city').value = parsedJSON[0].City;
            document.getElementById('state').value = parsedJSON[0].State;
        }
    };
}

function encodeImageFileAsURL(element) {
    var file = element.files[0];
    var reader = new FileReader();
    reader.onloadend = function () {
        console.log('RESULT', reader.result)
    };
    reader.readAsDataURL(file);
}

function getUserId(email) {
    const Http = new XMLHttpRequest();
    let url = 'http://localhost:3000/api/user/0';
    Http.open("GET", url);
    Http.send();

    var parsedJSON = '';
    var isCorrect = false;

    Http.onreadystatechange = function () {
        if (this.readyState === 4 && Http.responseText !== '[]') {
            parsedJSON = JSON.parse(Http.responseText);

            for (var i = 0; i < parsedJSON.length; i++) {
                if (parsedJSON[i].Email === email) {
                    sessionStorage.userId = parsedJSON[i].UserId;
                }

            }
        }
    };
}


// Verifies that there is an active user, if not it redirects to the login page
function verifyClientIsLoggedIn() {
    if (document.title !== 'User Login' && document.title !== 'Create an Account') {
        if (typeof sessionStorage.userId === 'undefined') {
            sessionStorage.previousPage = window.location;
            alert('You must log in or create an account to use this service');
            window.location = 'index.html';
        }
    }
}


verifyClientIsLoggedIn();


