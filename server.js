const db = require("./database"); // Import koneksi database
const bodyParser = require("body-parser");
const express = require("express");
const bcrypt = require("bcrypt");
const session = require("express-session");

const app = express();

const multer = require("multer");
const path = require("path");

// Konfigurasi penyimpanan file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "uploads"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// Filter file
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "application/pdf"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Format file tidak didukung"), false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 5MB
  fileFilter: fileFilter,
});

// Middleware upload
const uploadMiddleware = upload.single("bukti_pembayaran");

const setDefaultUserId = (req, res, next) => {
  if (req.session.userId) {
    req.body.user_id = req.session.userId;
  } else {
    return res.status(401).send("Anda belum login");
  }
  next();
};

const getusername_game = (req, res, next) => {
  if (!req.body.username_game) {
    db.query(
      "SELECT username_game FROM users WHERE id = ?",
      [req.session.userId],
      (err, results) => {
        if (err) {
          console.error("Error getting username game:", err);
          return res.status(500).send("Error getting username game");
        }
        req.body.username_game = results[0]?.username_game || "";
        next();
      }
    );
  } else {
    next();
  }
};

const PORT = process.env.PORT || 3000;
app.use(bodyParser.json({ limit: "20mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "20mb",
    extended: true,
  })
);
app.use(
  session({ secret: "your_secret_key", resave: false, saveUninitialized: true })
);

// Set view engine to EJS
app.set("view engine", "ejs");

// Set the directory for EJS views
app.set("views", path.join(__dirname, "views"));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));

// Define routes
app.get("/", (req, res) => {
  res.render("index", { userId: req.session.userId });
});

app.get("/akun", (req, res) => {
  res.render("akun", { userId: req.session.userId });
});

// Rute untuk login
app.post("/akun", (req, res) => {
  const { login, password } = req.body; // login bisa berupa username atau email
  // Logika untuk memeriksa username/email dan password di database

  db.query(
    "SELECT * FROM users WHERE (username = ? OR email = ?)",
    [login, login],
    async (err, results) => {
      if (err) {
        return res.status(500).send("Error checking credentials");
      }
      if (results.length > 0) {
        const user = results[0];
        // Verifikasi password
        const match = await bcrypt.compare(password, user.password_hash);
        if (match) {
          req.session.userId = user.id; // Simpan ID pengguna di sesi
          return res.redirect("/"); // Arahkan ke beranda setelah login
        } else {
          return res.status(401).send("Invalid username/email or password");
        }
      } else {
        return res.status(401).send("Invalid username/email or password");
      }
    }
  );
});

app.post("/register", async (req, res) => {
  const { username, email, password, username_game } = req.body;

  // Hash password sebelum menyimpannya
  const passwordHash = await bcrypt.hash(password, 10);

  db.query(
    "INSERT INTO users (username, email, password_hash, username_game) VALUES (?, ?, ?, ?)",
    [username, email, passwordHash, username_game],
    (err) => {
      if (err) {
        console.error("Error registering user:", err);
        return res.status(500).send("Error registering user");
      }
      return res.redirect("/akun");
    }
  );
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Error logging out");
    }
    res.redirect("/"); // Arahkan ke beranda setelah logout
  });
});

app.get("/mobile-legends", (req, res) => {
  if (req.session.userId) {
    db.query(
      "SELECT username_game FROM users WHERE id = ?",
      [req.session.userId],
      (err, results) => {
        if (err) {
          console.error("Error getting username game:", err);
          return res.status(500).send("Error getting username game");
        }
        const usernameGame = results[0].username_game;
        res.render("mobile-legends", {
          userId: req.session.userId,
          username_game: usernameGame,
        });
      }
    );
  } else {
    res.render("mobile-legends", { userId: null, username_game: null });
  }
});

app.get("/free-fire", (req, res) => {
  if (req.session.userId) {
    db.query(
      "SELECT username_game FROM users WHERE id = ?",
      [req.session.userId],
      (err, results) => {
        if (err) {
          console.error("Error getting username game:", err);
          return res.status(500).send("Error getting username game");
        }
        const usernameGame = results[0].username_game;
        res.render("free-fire", {
          userId: req.session.userId,
          username_game: usernameGame,
        });
      }
    );
  } else {
    res.render("free-fire", { userId: null, username_game: null });
  }
});

app.get("/pubg-mobile", (req, res) => {
  if (req.session.userId) {
    db.query(
      "SELECT username_game FROM users WHERE id = ?",
      [req.session.userId],
      (err, results) => {
        if (err) {
          console.error("Error getting username game:", err);
          return res.status(500).send("Error getting username game");
        }
        const usernameGame = results[0].username_game;
        res.render("pubg-mobile", {
          userId: req.session.userId,
          username_game: usernameGame,
        });
      }
    );
  } else {
    res.render("pubg-mobile", { userId: null, username_game: null });
  }
});

app.get("/cek-transaksi", (req, res) => {
  if (!req.session.userId) {
    return res.redirect("/akun");
  }

  db.query(
    "SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC",
    [req.session.userId],
    (err, results) => {
      if (err) {
        console.error("Error fetching transactions:", err);
        return res.status(500).send("Error fetching transactions");
      }
      res.render("cek-transaksi", {
        userId: req.session.userId,
        transactions: results,
      });
    }
  );
});

app.post("/cek-transaksi", setDefaultUserId, getusername_game, (req, res) => {
  const { game_name, nominal } = req.body; // Ambil game_name dari body
  const user_id = req.session.userId;
  const username_game = req.body.username_game;
  const status = "pending"; // Tambahkan status pending

  if (!game_name || !nominal) {
    return res.status(400).send("Data transaksi tidak lengkap");
  }

  console.log("Data transaksi:", {
    user_id,
    game_name,
    username_game,
    nominal,
  });

  db.query(
    "INSERT INTO transactions (user_id, game_name, username_game, nominal, status) VALUES (?, ?, ?, ?, ?)",
    [user_id, game_name, username_game, nominal, status],
    (err, results) => {
      if (err) {
        console.error("Error saving transaction:", err);
        return res.status(500).send("Error saving transaction");
      }
      const transaction_id = results.insertId;
      res.send(`Transaksi Berhasil! ID Transaksi: ${transaction_id}`);
    }
  );
});

app.post(
  "/upload-bukti-pembayaran/:id",
  setDefaultUserId,
  (req, res, next) => {
    // Validasi kepemilikan transaksi
    db.query(
      "SELECT * FROM transactions WHERE id = ? AND user_id = ?",
      [req.params.id, req.session.userId],
      (err, results) => {
        if (err || results.length === 0) {
          return res.status(403).send("Akses ditolak");
        }
        next();
      }
    );
  },
  uploadMiddleware,
  (req, res) => {
    // Update database
    db.query(
      "UPDATE transactions SET bukti_pembayaran = ?, status = ? WHERE id = ?",
      [req.file.filename, "completed", req.params.id],
      (err) => {
        if (err) {
          console.error("Error mengupdate transaksi:", err);
          return res.status(500).send("Gagal mengupload bukti");
        }
        res.redirect("/cek-transaksi");
      }
    );
  }
);

app.post("/batalkan-transaksi/:id", (req, res) => {
  db.query(
    "DELETE FROM transactions WHERE id = ? AND user_id = ?",
    [req.params.id, req.session.userId],
    (err) => {
      if (err) return res.status(500).send("Gagal membatalkan transaksi");
      res.redirect("/cek-transaksi");
    }
  );
});

app.get("/profil", (req, res) => {
  if (!req.session.userId) {
    return res.redirect("/akun");
  }
  db.query(
    "SELECT * FROM users WHERE id = ?",
    [req.session.userId],
    (err, results) => {
      if (err) {
        console.error("Error fetching profile:", err);
        return res.status(500).send("Error fetching profile");
      }
      if (results.length === 0) {
        return res.status(404).send("User tidak ditemukan");
      }
      res.render("profil", { user: results[0], userId: req.session.userId });
    }
  );
});

app.post("/profil", async (req, res) => {
  if (!req.session.userId) {
    return res.redirect("/akun");
  }
  const { username, email, username_game, password } = req.body;
  const updateFields = [];
  const values = [];

  if (username) {
    updateFields.push("username = ?");
    values.push(username);
  }
  if (email) {
    updateFields.push("email = ?");
    values.push(email);
  }
  if (username_game) {
    updateFields.push("username_game = ?");
    values.push(username_game);
  }
  if (password) {
    const passwordHash = await bcrypt.hash(password, 10);
    updateFields.push("password_hash = ?");
    values.push(passwordHash);
  }

  if (updateFields.length === 0) {
    return res.redirect("/profil");
  }

  values.push(req.session.userId);
  db.query(
    `UPDATE users SET ${updateFields.join(", ")} WHERE id = ?`,
    values,
    (err) => {
      if (err) {
        console.error("Error updating profile:", err);
        return res.status(500).send("Error updating profile");
      }
      res.redirect("/profil");
    }
  );
});

app.post("/update-password", async (req, res) => {
  if (!req.session.userId) {
    return res.redirect("/akun");
  }
  const { old_password, new_password } = req.body;

  try {
    db.query(
      "SELECT password_hash FROM users WHERE id = ?",
      [req.session.userId],
      async (err, results) => {
        if (err) {
          console.error("Error fetching user password:", err);
          return res.status(500).send("Error fetching user password");
        }
        if (results.length === 0) {
          return res.status(404).send("User tidak ditemukan");
        }

        const user = results[0];

        // Periksa password lama
        const isMatch = await bcrypt.compare(old_password, user.password_hash);
        if (!isMatch) {
          return res.status(400).send("Password lama salah");
        }

        // Hash password baru dan update
        const hashedPassword = await bcrypt.hash(new_password, 10);
        db.query(
          "UPDATE users SET password_hash= ? WHERE id = ?",
          [hashedPassword, req.session.userId],
          (err) => {
            if (err) {
              console.error("Error updating password:", err);
              return res.status(500).send("Gagal mengubah password.");
            }
            res.redirect("/profil");
          }
        );
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).send("Gagal mengubah password.");
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
