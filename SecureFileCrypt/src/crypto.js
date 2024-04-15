const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

function encrypt(filePath, outputFolderPath, progressCallback) {
  const algorithm = 'aes-256-cbc';
  const key = crypto.randomBytes(32);
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv(algorithm, key, iv);

  const input = fs.readFileSync(filePath, 'utf-8');
  const encryptedData = Buffer.concat([cipher.update(input, 'utf-8'), cipher.final()]);

  // Create the output folder if it doesn't exist
  if (!fs.existsSync(outputFolderPath)) {
    fs.mkdirSync(outputFolderPath);
  }

  // Determine the output file path within the folder
  const outputFilePath = path.join(outputFolderPath, 'encrypted_file.txt');

  // Save encrypted data to a file
  fs.writeFileSync(outputFilePath, encryptedData);

  console.log('Encryption successful. Encrypted file:', outputFilePath);
  progressCallback(100, 'Encryption complete'); // Notify completion
}

function decrypt(filePath, outputFolderPath, progressCallback) {
  const algorithm = 'aes-256-cbc';
  const key = crypto.randomBytes(32);
  const iv = crypto.randomBytes(16);

  const decipher = crypto.createDecipheriv(algorithm, key, iv);

  const encryptedData = fs.readFileSync(filePath);
  const decryptedData = Buffer.concat([decipher.update(encryptedData), decipher.final()]);

  // Create the output folder if it doesn't exist
  if (!fs.existsSync(outputFolderPath)) {
    fs.mkdirSync(outputFolderPath);
  }

  // Determine the output file path within the folder
  const outputFilePath = path.join(outputFolderPath, 'decrypted_file.txt');

  // Save decrypted data to a file
  fs.writeFileSync(outputFilePath, decryptedData.toString('utf-8'));

  console.log('Decryption successful. Decrypted file:', outputFilePath);
  progressCallback(100, 'Decryption complete'); // Notify completion
}

module.exports = { encrypt, decrypt };
