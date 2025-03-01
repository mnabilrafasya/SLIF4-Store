const mysql = require('mysql');

// Konfigurasi koneksi database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', 
  database: 'slif4_store',
});

// Koneksi ke database
db.connect((err) => {
  if (err) {
    console.error('Koneksi ke database gagal:', err);
    process.exit(1); // Exit jika koneksi gagal
  }
  console.log('Terhubung ke database MySQL');
});

module.exports = db;
