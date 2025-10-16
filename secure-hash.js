// === secure-hash.js ===
// Program kreatif untuk Hashing + Salting + Verifikasi Password
// By: Muh. Rifky 

import readline from "readline";
import crypto from "crypto";
import chalk from "chalk"; // efek warna agar hasil lebih keren

// === Fungsi untuk hashing password dengan salt ===
function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
    return { salt, hash };
}

// === Fungsi verifikasi password ===
function verifyPassword(password, salt, hash) {
    const newHash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
    return newHash === hash;
}

// === Setup input interaktif di terminal ===
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

console.log(chalk.blue.bold("=== SISTEM HASHING PASSWORD DENGAN SALT ===\n"));

rl.question(chalk.yellow("Masukkan password yang ingin di-hash: "), (password) => {
    const hashed = hashPassword(password);

    console.log(chalk.green("\nPassword berhasil di-hash!"));
    console.log(chalk.white("Salt  :"), chalk.cyan(hashed.salt));
    console.log(chalk.white("Hash  :"), chalk.cyan(hashed.hash));

    rl.question(chalk.yellow("\nMasukkan kembali password untuk verifikasi: "), (verify) => {
        const isMatch = verifyPassword(verify, hashed.salt, hashed.hash);

        console.log(chalk.magenta("\n=== HASIL VERIFIKASI ==="));
        if (isMatch) {
            console.log(chalk.green.bold("Password cocok Akses diizinkan."));
        } else {
            console.log(chalk.red.bold("Password salah Akses ditolak."));
        }

        rl.close();
    });
});
