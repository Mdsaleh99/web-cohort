
# 🧠 Node.js `crypto` Module In-Depth Guide

The `crypto` module provides cryptographic functionality in Node.js, including a set of wrappers for OpenSSL's hash, HMAC, cipher, decipher, sign, and verify functions.

## 📦 Importing the Crypto Module

```js
const crypto = require('crypto');
```

---

## 🧩 Key Features & Use Cases

### 1. 🔐 Hashing

Used for securely storing passwords, data integrity, etc.

- **Supported Algorithms:** `sha256`, `sha512`, `md5`, etc.

#### Example: SHA256 Hash

```js
const hash = crypto.createHash('sha256')
                   .update('hello world')
                   .digest('hex');
console.log(hash);
```

#### Use Cases:

- Password hashing (though `bcrypt` or `argon2` are recommended for better security)
- Verifying file integrity (checksums)
- Ensuring message content hasn’t been tampered with

---

### 2. 🔑 HMAC (Hash-based Message Authentication Code)

Used to verify the integrity and authenticity of a message with a secret key.

#### Example:

```js
const hmac = crypto.createHmac('sha256', 'secret-key')
                   .update('my data')
                   .digest('hex');
console.log(hmac);
```

#### Use Cases:

- API authentication (e.g., AWS signed requests)
- JWT alternatives
- Securing messages across network

---

### 3. 🔐 Symmetric Encryption/Decryption

Same key is used to encrypt and decrypt data (AES is commonly used).

#### Example:

```js
const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

const cipher = crypto.createCipheriv(algorithm, key, iv);
let encrypted = cipher.update('my secret data', 'utf8', 'hex');
encrypted += cipher.final('hex');

const decipher = crypto.createDecipheriv(algorithm, key, iv);
let decrypted = decipher.update(encrypted, 'hex', 'utf8');
decrypted += decipher.final('utf8');

console.log({ encrypted, decrypted });
```

#### Use Cases:

- Encrypting sensitive data before storing
- Secure file storage and transmission

---

### 4. 🧾 Key Pair Generation (Asymmetric Crypto)

Generate RSA or EC key pairs for signing/verifying.

#### Example:

```js
crypto.generateKeyPair('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
}, (err, publicKey, privateKey) => {
  console.log(publicKey);
  console.log(privateKey);
});
```

#### Use Cases:

- Digital signatures
- Secure key exchange (e.g., in HTTPS, SSH)

---

### 5. ✍️ Digital Signing and Verification

#### Example:

```js
const { generateKeyPairSync, createSign, createVerify } = crypto;

const { privateKey, publicKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
});

const sign = createSign('SHA256');
sign.update('some data');
sign.end();

const signature = sign.sign(privateKey, 'hex');

const verify = createVerify('SHA256');
verify.update('some data');
verify.end();

console.log('Is signature valid?', verify.verify(publicKey, signature, 'hex'));
```

#### Use Cases:

- JWT verification
- Validating digital certificates
- Message verification

---

### 6. 🔢 Random Bytes

Used to generate secure tokens or keys.

#### Example:

```js
const token = crypto.randomBytes(16).toString('hex');
console.log(token);
```

#### Use Cases:

- Session tokens
- API keys
- Password reset tokens

---

## 🔍 How Hashing Works Internally

- Input is passed into the hash function.
- Output is a fixed-size digest (e.g. 256-bit for SHA-256).
- Same input always gives same output (deterministic).
- Hashing is **one-way** — cannot be reversed.

#### Example:

```js
const input = "password123";
const hash1 = crypto.createHash("sha256").update(input).digest("hex");
const hash2 = crypto.createHash("sha256").update(input).digest("hex");
console.log(hash1 === hash2); // true
```

---

## ⚠️ Security Notes

- Never use raw hashes for passwords — **always use salt**.
- Prefer libraries like **bcrypt** or **argon2** for password hashing.
- Use `.env` files to store secrets, **never hardcode them**.
- Use `crypto.randomBytes()` instead of `Math.random()`.

---

## 🧂 What is a Salt?

A **salt** is a random string added to the password before hashing.

#### Example:

```js
const password = 'password123';
const salt = crypto.randomBytes(16).toString('hex');
const saltedPassword = password + salt;

const hash = crypto.createHash('sha256').update(saltedPassword).digest('hex');
console.log({ salt, hash });
```

#### Benefit:

Even if two users have the same password, the hashes will be different.

---

## 🔐 Using `bcrypt` for Password Hashing

```js
const bcrypt = require('bcrypt');
const password = 'password123';
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
  console.log('Hashed password:', hash);

  bcrypt.compare('password123', hash, (err, result) => {
    console.log('Password match:', result); // true
  });
});
```

---

## 🔚 TL;DR Summary

| Feature           | Function            | Use Case                            |
|-------------------|---------------------|--------------------------------------|
| Hashing           | `createHash()`      | Data integrity, password hashes      |
| HMAC              | `createHmac()`      | Signed API requests                  |
| Encryption        | `createCipheriv()`  | Secure file/data encryption          |
| Decryption        | `createDecipheriv()`| Decrypt AES encrypted data           |
| Signing           | `createSign()`      | Digital signature                    |
| Verification      | `createVerify()`    | Verify digital signature             |
| Key Generation    | `generateKeyPair()` | Create RSA/EC key pairs              |
| Random Values     | `randomBytes()`     | Secure tokens and secrets            |

---

## 🛠️ Suggested Project Ideas

- 🔐 Password Manager (with AES encryption + bcrypt password)
- 💬 Encrypted Messaging App (with symmetric crypto)
- ✅ JWT Alternative with HMAC
- 📁 Secure File Storage with Encryption

---

## 📚 More Resources

- [Node.js Crypto Docs](https://nodejs.org/api/crypto.html)
- [OWASP Password Storage Cheatsheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
- [bcrypt GitHub](https://github.com/kelektiv/node.bcrypt.js)

---

> **Note**: Always stay updated with latest security practices.
