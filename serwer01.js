var http = require("http")
var express = require("express")
var app = express()
const PORT = 3000;
var hbs = require('express-handlebars');
var path = require("path")
var bodyParser = require("body-parser")
app.use(express.static('static'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var Datastore = require('nedb'),
session = require('express-session'),
NedbStore = require('connect-nedb-session')(session);


app.use(session({ secret: 'yoursecret'
	, resave: false
	, saveUninitialized: false
	, cookie: { path: '/'
		, httpOnly: true
		, maxAge: 365 * 24 * 3600 * 1000   // One year for example
	}
	, store: new NedbStore({ filename: 'dbs/sessions.db', corruptAlertThreshold: 1 })
}));

var coll1 = new Datastore({
    filename: 'uczniowie.db',
    autoload: true
});

var coll2 = new Datastore({
    filename: 'oceny.db',
    autoload: true
});

var coll3 = new Datastore({
    filename: 'uzytkownicy.db',
    autoload: true
});

function sprawdzzalog(req, res, next) {
	if(req.session.actual){
		next();
	} else {
		var error = new Error('NIEZALOGOWANY!');
		console.log(req.session.actual);
		next(error);
	}
}

app.get("/admin",sprawdzzalog, function (req, res) {
  coll1.find({}, function (err, docs) {
    coll2.find({}, function (err, tx) {
      res.render('admin.hbs',{ rak: docs,lista:tx});

  });

  });
})

app.get("/unknown", function (req, res) {
  coll1.find({}, function (err, docs) {
    coll2.find({}, function (err, tx) {
      res.render('unknown.hbs',{ rak: docs,lista:tx});

  });

  });
})


app.post('/wyszukaj', (req, res) => {
  coll1.find({ imie: req.body.imie_ucznia} || {nazwisko: req.body.nazwisko_ucznia}, function (err, docs) {
    console.log(docs)
    coll2.find({}, function (err, tx) {
      res.render('wyszukaj.hbs',{ rak: docs,lista:tx});

  });
    // docs is an array containing documents Mars, Earth, Jupiter
    // If no document is found, docs is equal to []
  });

});




app.post('/dodaj', (req, res) => {

  var tmp =
  {
    imie: req.body.imie_ucznia, nazwisko: req.body.nazwisko_ucznia
  }

  coll1.insert(tmp, function (err, newDoc) {});
  res.redirect("/admin")
})

app.post('/dodajoc', (req, res) => {

  var tmp2 =
  {
    ocena: req.body.ocena
  }

  coll2.insert(tmp2, function (err, newDoc) {});
  res.redirect("/admin")
})

app.post('/usun', (req, res) => {

  coll1.remove({ imie: req.body.imie_ucznia, nazwisko: req.body.nazwisko_ucznia}, { multi: true }, function (err, numRemoved) {
    console.log("usunięto dokumentów: ",numRemoved)
    res.redirect("/admin")
});



  });
app.post('/edit', (req, res) => {

  coll1.remove({ imie: req.body.imie_ucznia, nazwisko: req.body.nazwisko_ucznia}, { multi: true }, function (err, numRemoved) {

    res.redirect("/edit")
});
})

app.get("/edit",sprawdzzalog, function (req, res) {
  res.render('edit.hbs');
})
  app.post('/usunoc', (req, res) => {

    coll2.remove({ ocena: req.body.ocena}, { multi: true }, function (err, numRemoved) {
      console.log("usunięto dokumentów: ",numRemoved)
      res.redirect("/admin")
  });

    })

app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', hbs({ defaultLayout: 'main.hbs' }));
app.set('view engine', 'hbs');


app.get("/", function (req, res) {
    res.render('index.hbs');
})

app.get("/login", function (req, res) {
    res.render('login.hbs');
})

app.get("/add",sprawdzzalog, function (req, res) {
    res.render('add.hbs');
})

app.get("/add2",sprawdzzalog, function (req, res) {
    res.render('add2.hbs');
})


app.post("/redirect", function (req, res) {
    res.redirect('/add');
})

app.post("/redirect2", function (req, res) {
    res.redirect('/add2');
})

app.post("/zalogo", function (req, res) {
    res.redirect('/login');
})

app.post("/unknownlog", function (req, res) {
    res.redirect('/unknown');
})

app.get("/unknown", function (req, res) {
    res.render('unknown.hbs');
})

app.post('/login', (req, res) => {
    if(!req.body.login || !req.body.password)
    {
      res.render("login.hbs",{error: 'ERROR!'})
    }
    else
      {
        coll3.find({}, (err,docs) => {
          docs.filter((value,index) => {
            if(value.login == req.body.login && value.password == req.body.password)
            {
              req.session.actual = value;
              res.redirect("/admin");
            }
            else
            {
              res.redirect("/login")
            }
          });
        });
      }
});


app.get('/item/:id',(req, res) => {
	var id  = req.params.id;
	coll1.find({ _id: id }, function (err, docs) {
		res.render('element.hbs', docs[0]);
	});
});


app.get('/logout', (req, res) => {
	req.session.actual = null;
	res.redirect('/login');
});

app.get("/admin",sprawdzzalog, function (req, res) {
  if(zalogowany == true)
  {
      res.render('admin.hbs');
  }
  else {
  res.render('login.hbs')
  }

})
var admin =
{
  login: "admin", password: "admin"
}

var uczen1 =
{
  imie: "Marcin", nazwisko: "Malton"
}

var uczen2 =
{
  imie: "Maciej", nazwisko: "Kurka"
}

var uczen3 =
{
  imie: "Joanna", nazwisko: "Madej"
}

var uczen4 =
{
  imie: "Marta", nazwisko: "Kowalska"
}

var jedynka =
{
  ocena: "niedostateczna"
}

var dwojka =
{
  ocena: "dopuszczajaca"
}

var trojka =
{
  ocena: "dostateczna"
}

var czworka =
{
  ocena: "dobra"
}

var piatka =
{
  ocena: "bardzo dobra"
}

var szostka =
{
  ocena: "celujaca"
}

coll1.remove({}, { multi: true }, function (err, numRemoved) {});

coll2.remove({}, { multi: true }, function (err, numRemoved) {})

coll3.remove({}, { multi: true }, function (err, numRemoved) {})

coll1.insert(uczen1, function (err, newDoc) {});

coll1.insert(uczen2, function (err, newDoc) {});

coll1.insert(uczen3, function (err, newDoc) {});

coll1.insert(uczen4, function (err, newDoc) {});

coll2.insert(jedynka, function (err, newDoc) {});

coll2.insert(dwojka, function (err, newDoc) {});

coll2.insert(trojka, function (err, newDoc) {});

coll2.insert(czworka, function (err, newDoc) {});

coll2.insert(piatka, function (err, newDoc) {});

coll2.insert(szostka, function (err, newDoc) {});

coll3.insert(admin, function (err, newDoc) {});



app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT )
})
