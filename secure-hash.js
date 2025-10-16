// === secure-hash.js ===
// Program interaktif untuk Hashing + Salting + Multi Verifikasi Password
// By: Muh. Rifky

import readline from "readline";
import crypto from "crypto";
import chalk from "chalk";

// === Fungsi input password (tanpa masking) ===
function askVisible(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question(chalk.yellow(question), (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

// === Fungsi hashing password dengan salt ===
function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return { salt, hash };
}

// === Fungsi verifikasi password ===
function verifyPassword(password, salt, hash) {
  const newHash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return newHash === hash;
}

// === Fungsi verifikasi dengan batas percobaan ===
async function multiTryVerify(hashedData, maxAttempts = 5 ) {
  console.log(chalk.blueBright(`\n verifikasi dulu gays ${maxAttempts} kali percobaan.`));
  console.log(chalk.gray("Ketik 'q' lalu Enter untuk keluar ya .\n"));

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const input = await askVisible(`Percobaan ${attempt}/${maxAttempts} — Masukkan password: `);

    if (input.trim().toLowerCase() === "q") {
      console.log(chalk.gray("\n Dibatalkan oleh pengguna."));
      return false;
    }

    const isMatch = verifyPassword(input, hashedData.salt, hashedData.hash);
    if (isMatch) {
      console.log(chalk.green.bold("\n Password benar Akses diizinkan."));
      return true;
    } else {
      console.log(chalk.red.bold("Password salah."));
      if (attempt < maxAttempts) {
        console.log(chalk.yellow("Silahkan Coba lagi atau ketik 'q' untuk keluar.\n"));
      } else {
        console.log(chalk.redBright("Batas percobaan habis. Akses ditolak."));
      }
    }
  }
  return false;
}

// === Main program ===
console.log(chalk.cyan.bold("\n=== SISTEM HASHING PASSWORD DENGAN SALT ===\n"));

const pw = await askVisible(" Masukkan password yang ingin di-hash: ");
const hashed = hashPassword(pw);

console.log(chalk.green("\nPassword berhasil di-hash!"));
console.log(chalk.white("Salt  :"), chalk.cyan(hashed.salt));
console.log(chalk.white("Hash  :"), chalk.cyan(hashed.hash));

await multiTryVerify(hashed, 5);
process.exit(0);
