const session = require("express-session");
const port = 3000
  express = require("express")
  layouts = require("express-ejs-layouts");
const app = express();
const path = require("path");
app.use(session({
  secret: 'rahasiaSuperAman',
  resave: false,
  saveUninitialized: true,
}));

app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

function isAuthenticated(req, res, next) {
  if (req.session.isLoggedIn) {
    next();
  } else {
    res.redirect('/'); 
  }
}


app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')));
app.use('/html', express.static('./public'));
app.set("view engine", "ejs");
app.use(layouts);
app.use(express.static("views"));


// Parse URL encoded data and use JSON format.
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const staticAppController = require("./controllers/staticAppController");
const errorController = require("./controllers/errorController");
const { findUserByEmail } = require("./Models/login");


//Login
app.get("/", staticAppController.loginView);
app.post("/login", staticAppController.loginUser);
app.get("/index", isAuthenticated, staticAppController.getHomePage);

app.get("/Karyawan", isAuthenticated, staticAppController.getKaryawanPage);
app.post("/Karyawan", isAuthenticated, staticAppController.saveKaryawan);
app.get("/Karyawan/id", isAuthenticated, staticAppController.findKaryawanById);
app.get("/Karyawan/nama", isAuthenticated, staticAppController.findKaryawanByNama);
app.post("/Karyawan/update", isAuthenticated, staticAppController.updateKaryawan);
app.post("/Karyawan/delete", isAuthenticated, staticAppController.deleteKaryawan);
app.get("/Karyawan/jabatan", isAuthenticated, staticAppController.findKaryawanByJabatan);
app.get("/Karyawan/divisi", isAuthenticated, staticAppController.findKaryawanByDivisi);
app.get("/Karyawan/status", isAuthenticated, staticAppController.findKaryawanByStatus);

app.get("/GajiKaryawan", isAuthenticated, staticAppController.getGajiKaryawanPage);
app.post("/GajiKaryawan", isAuthenticated, staticAppController.saveGaji);
app.get("/GajiKaryawan/idGaji", isAuthenticated, staticAppController.findGajiKaryawanByIdGaji);
app.get("/GajiKaryawan/idKaryawan", isAuthenticated, staticAppController.findGajiKaryawanByIdKaryawan);
app.get("/GajiKaryawan/tunjangan", isAuthenticated, staticAppController.findGajiKaryawanByTunjangan);
app.get("/GajiKaryawan/gajiPokok", isAuthenticated, staticAppController.findGajiKaryawanByGajiPokok);
app.post("/GajiKaryawan/update", isAuthenticated, staticAppController.updateGaji);
app.post("/GajiKaryawan/delete", isAuthenticated, staticAppController.deleteGajiKaryawan);




app.use(errorController.pageNotFoundError);
app.use(errorController.internalServerError);


app.listen(port, () => {
  console.log(`The Express.js server has started is listening on port number: ${port}`);
});