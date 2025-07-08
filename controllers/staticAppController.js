const karyawans = [];
const gajis = [];


//Login
const model = require("../Models/login");

exports.loginView = (req, res) => {
    res.render("loginViews", {});
};

exports.loginUser = (req, res) => {
    const { email, password } = req.body;
    const user = model.findUserByEmail(email);

    if (user && user.password === password) {
        req.session.isLoggedIn = true; // simpan status login
        req.session.user = user;     
        res.redirect("/index");
    } else {
        res.send("Email atau password salah");
    }
};

// Save Karyawan ================================================================================================================================
exports.getHomePage = (req, res) => {
  res.render("index", { 
    myKaryawans: karyawans,
    myGajis : gajis
  });
};  

exports.getKaryawanPage = (req, res) => {
  res.render("karyawan", { myKaryawans: karyawans });
};

exports.getGajiKaryawanPage = (req, res) => {
  res.render("gajikaryawan");
};

exports.saveKaryawan = (req, res) => {
  const { id, nama, divisi, jabatan, status } = req.body;

  // Validasi ID 
  const idSudahAda = karyawans.some(k => k.id === id);
  if (idSudahAda) {
    return res.status(400).send("ID sudah digunakan. Gunakan ID yang lain.");
  }

  // Save data
  karyawans.push({ id, nama, divisi, jabatan, status });
  return res.render("karyawan");
};


// Save gaji karyawan================================================================================================================================
exports.saveGaji = (req, res) => {
  const { idGaji, idKaryawan, tunjangan, gajiPokok } = req.body;

  // Cek apakah ID Gaji Terpakai apa belum
  const idSudahAda = gajis.some(g => g.idGaji === idGaji);
  if (idSudahAda) {
    return res.status(400).send("ID Gaji sudah digunakan.");
  }

  // Cek apakah ID  karyawan Sama dengan yang sudah disimpan
    const idSudahKarAda = gajis.some(g => g.idKaryawan === idKaryawan);
  if (idSudahKarAda) {
    return res.status(400).send("ID Karyawan sudah Didaftarkan Gunakan yang lain");
  }

  //  Cek apakah ID Karyawan terdaftar di data karyawans
  const karyawanAda = karyawans.some(k => k.id === idKaryawan);
  if (!karyawanAda) {
    return res.status(400).send("ID Karyawan tidak ditemukan di data karyawan.");
  }

  // Simpan cuyyyy
  gajis.push({ idGaji, idKaryawan, tunjangan, gajiPokok });
  return res.render("gajikaryawan", { myGajis: gajis });
};


// Gaji Karyawan Controller Start=====================================================================================================================================
//  GET BY ID Gaji (only one)
exports.findGajiKaryawanByIdGaji = (req, res) => {
  const idGaji = req.query.idGaji;
  const gaji = gajis.find(k => k.idGaji === idGaji);

  if (!gaji) {
    return res.status(404).send("ID Gaji Karyawan tidak ditemukan");
  }

  res.render("resultgaji", { gajikaryawan : gaji });
};

//  GET BY ID Gaji (only one)
exports.findGajiKaryawanByIdKaryawan = (req, res) => {
  const idkaryawan = req.query.idKaryawan;
  const gaji = gajis.find(k => k.idKaryawan === idkaryawan);

  if (!gaji) {
    return res.status(404).send("ID Karyawan tidak ditemukan");
  }

  res.render("resultgaji", { gajikaryawan : gaji });
};

//  GET BY TUNJANGAN
exports.findGajiKaryawanByTunjangan = (req, res) => {
  const tunjangan = req.query.tunjangan;
  const hasil = gajis.filter(k => k.tunjangan.toLowerCase() === tunjangan.toLowerCase());

  if (hasil.length === 0) {
    return res.status(404).send("Tidak ada karyawan dengan tunjangan tersebut");
  }

  res.render("resultgajilist", { gajikaryawans: hasil });
};

//  GET BY Gaji Pokok
exports.findGajiKaryawanByGajiPokok = (req, res) => {
  const gajiPokok = req.query.gajiPokok;
  const hasil = gajis.filter(k => k.gajiPokok.toLowerCase() === gajiPokok.toLowerCase());

  if (hasil.length === 0) {
    return res.status(404).send("Tidak ada karyawan dengan tunjangan tersebut");
  }

  res.render("resultgajilist", { gajikaryawans: hasil });
};

// UPDATE GAJI CUYYY
exports.updateGaji = (req, res) => {
  const { idGaji, tunjangan, gajiPokok } = req.body;

  // Cari index data gaji berdasarkan id Gaji
  const index = gajis.findIndex(g => g.idGaji === idGaji);

  if (index === -1) {
    return res.status(404).send("Gaji dengan ID tersebut tidak ditemukan.");
  }

  gajis[index].tunjangan = tunjangan;
  gajis[index].gajiPokok = gajiPokok;

  res.render("gajikaryawan", { myGajis: gajis });
};

//  DELETE
exports.deleteGajiKaryawan = (req, res) => {
  const { idGaji } = req.body;
  const index = gajis.findIndex(k => k.idGaji === idGaji);

  if (index === -1) {
    return res.status(404).send("ID Gaji Karyawan tidak ditemukan");
  }

  gajis.splice(index, 1);
  res.render("gajikaryawan");
};

//Gaji karyawan Controler end ================================================================================================================================


// Karyawan Controller Start====================================================================================================================================================================
//  GET BY ID (only one)
exports.findKaryawanById = (req, res) => {
  const id = req.query.name;
  const karyawan = karyawans.find(k => k.id === id);

  if (!karyawan) {
    return res.status(404).send("Karyawan tidak ditemukan");
  }

  res.render("result", { karyawan });
};

//  GET BY NAMA (bisa banyak)
exports.findKaryawanByNama = (req, res) => {
  const nama = req.query.name;
  const hasil = karyawans.filter(k => k.nama.toLowerCase() === nama.toLowerCase());

  if (hasil.length === 0) {
    return res.status(404).send("Tidak ada karyawan dengan nama tersebut");
  }

  res.render("resultList", { karyawans: hasil });
};

//  GET BY JABATAN
exports.findKaryawanByJabatan = (req, res) => {
  const jabatan = req.query.name;
  const hasil = karyawans.filter(k => k.jabatan.toLowerCase() === jabatan.toLowerCase());

  if (hasil.length === 0) {
    return res.status(404).send("Tidak ada karyawan dengan jabatan tersebut");
  }

  res.render("resultList", { karyawans: hasil });
};

//  GET BY DIVISI
exports.findKaryawanByDivisi = (req, res) => {
  const divisi = req.query.name;
  const hasil = karyawans.filter(k => k.divisi.toLowerCase() === divisi.toLowerCase());

  if (hasil.length === 0) {
    return res.status(404).send("Tidak ada karyawan dengan divisi tersebut");
  }

  res.render("resultList", { karyawans: hasil });
};

// GET BY STATUS
exports.findKaryawanByStatus = (req, res) => {
  const status = req.query.status;
  const hasil = karyawans.filter(k => k.status.toLowerCase() === status.toLowerCase());

  if (hasil.length === 0) {
    return res.status(404).send("Tidak ada karyawan dengan status tersebut");
  }

  res.render("resultList", { karyawans: hasil });
};


// UPDATE
exports.updateKaryawan = (req, res) => {
  const { id, nama, divisi, jabatan, status } = req.body;
  const index = karyawans.findIndex(k => k.id === id);

  if (index === -1) {
    return res.status(404).send("Karyawan tidak ditemukan");
  }

  karyawans[index] = { id, nama, divisi, jabatan, status };
  res.render("karyawan");
};

//  DELETE
exports.deleteKaryawan = (req, res) => {
  const { id } = req.body;
  const index = karyawans.findIndex(k => k.id === id);

  if (index === -1) {
    return res.status(404).send("Karyawan tidak ditemukan");
  }

  karyawans.splice(index, 1);
  res.render("karyawan");
};
// Karyawan controller End ================================================================================================================================


