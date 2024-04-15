const { remote } = require('electron');
const path = require('path');
const fs = require('fs/promises');
const { encrypt, decrypt } = require('./crypto');

const passwordsFileName = '.passwords.json';
const passwordsFilePath = path.join(remote.app.getAppPath(), passwordsFileName);

document.getElementById('fileInput').addEventListener('change', (event) => {
  const filePath = event.target.files[0].path;
  document.getElementById('selectedFile').innerText = `Selected File: ${filePath}`;
});

function updateProgressBar(progress, status) {
  const progressBar = document.getElementById('progress');
  const progressBarText = document.getElementById('progress-text');

  progressBar.style.width = `${progress}%`;
  progressBarText.innerText = `${progress}% - ${status}`;
}

function configurePassword() {
  try {
    // Check if the password file exists
    fs.accessSync(passwordsFilePath);

    // Password file exists, show Change Password and Remove Password buttons
    document.getElementById('create-password').style.display = 'none';
    document.getElementById('change-password').style.display = 'inline-block';
    document.getElementById('remove-password').style.display = 'inline-block';
  } catch (error) {
    // Password file doesn't exist, show Create Password button
    document.getElementById('create-password').style.display = 'inline-block';
    document.getElementById('change-password').style.display = 'none';
    document.getElementById('remove-password').style.display = 'none';
  }
}


function openPasswordModal(action) {
  const modal = document.getElementById('passwordModal');
  const content = document.getElementById('password-config-content');

  // Clear existing content
  content.innerHTML = '';

  // Update modal based on action
  if (action === 'create') {
    content.innerHTML = `
      <div>New Password:</div>
      <input type="password" class="password-input" id="newPassword" />
      <div>Confirm Password:</div>
      <input type="password" class="password-input" id="confirmPassword" />
    `;
  } else if (action === 'change') {
    content.innerHTML = `
      <div>Current Password:</div>
      <input type="password" class="password-input" id="currentPassword" />
      <div>New Password:</div>
      <input type="password" class="password-input" id="newPassword" />
      <div>Confirm Password:</div>
      <input type="password" class="password-input" id="confirmPassword" />
    `;
  } else if (action === 'remove') {
    content.innerHTML = `
      <div>Current Password:</div>
      <input type="password" class="password-input" id="currentPassword" />
    `;
  }

  modal.style.display = 'flex';
}

function closePasswordModal() {
  const modal = document.getElementById('passwordModal');
  modal.style.display = 'none';
}

async function submitPasswordConfig() {
  const newPassword = document.getElementById('newPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const currentPassword = document.getElementById('currentPassword').value;

  if (newPassword && newPassword === confirmPassword) {
    // Save the password
    await fs.writeFile(passwordsFilePath, JSON.stringify({ password: newPassword }));
  } else if (currentPassword) {
    // Implement logic to check and remove the password if it matches the current password
    // For now, let's just log a message
    console.log('Password removal logic goes here.');
  }

  // After handling the configuration, close the modal
  closePasswordModal();
  configurePassword(); // Ensure password configuration is updated after submission
}



document.getElementById('settings-tab').addEventListener('click', () => {
  const settingsMenu = document.getElementById('settings-menu');
  settingsMenu.style.display = (settingsMenu.style.display === 'block') ? 'none' : 'block';

  // Ensure the password configuration is updated when settings are opened
  configurePassword();
});

function configurePassword() {
  try {
    // Check if the password file exists
    fs.accessSync(passwordsFilePath);

    // Password file exists, show Change Password and Remove Password buttons
    document.getElementById('create-password').style.display = 'none';
    document.getElementById('change-password').style.display = 'inline-block';
    document.getElementById('remove-password').style.display = 'inline-block';
  } catch (error) {
    // Password file doesn't exist, show Create Password button
    document.getElementById('create-password').style.display = 'inline-block';
    document.getElementById('change-password').style.display = 'none';
    document.getElementById('remove-password').style.display = 'none';
  }
}



document.getElementById('configure-password').addEventListener('click', () => {
  openPasswordModal('create');
});

document.getElementById('change-password').addEventListener('click', () => {
  openPasswordModal('change');
});

document.getElementById('remove-password').addEventListener('click', () => {
  openPasswordModal('remove');
});

document.getElementById('create-password-btn').addEventListener('click', submitPasswordConfig);

document.getElementById('configure-encryption-location').addEventListener('click', () => {
  configureFileLocation('encryption');
});

document.getElementById('configure-decryption-location').addEventListener('click', () => {
  configureFileLocation('decryption');
});

document.getElementById('encrypt-btn').addEventListener('click', async () => {
  const filePath = document.getElementById('fileInput').files[0].path;
  const defaultFolderName = 'encrypted';
  const outputFolderPath = remote.dialog.showSaveDialogSync({
    defaultPath: path.join(path.dirname(filePath), defaultFolderName),
    buttonLabel: 'Save Encrypted Folder',
    properties: ['createDirectory'],
  });

  if (outputFolderPath) {
    updateProgressBar(0, 'Encryption starting...');
    await encrypt(filePath, outputFolderPath, (progress, status) => {
      updateProgressBar(progress, status);
    });
    updateProgressBar(100, 'Encryption complete');
  }
});

document.getElementById('decrypt-btn').addEventListener('click', async () => {
  const filePath = document.getElementById('fileInput').files[0].path;
  const defaultFolderName = 'decrypted';
  const outputFolderPath = remote.dialog.showSaveDialogSync({
    defaultPath: path.join(path.dirname(filePath), defaultFolderName),
    buttonLabel: 'Save Decrypted Folder',
    properties: ['createDirectory'],
  });

  if (outputFolderPath) {
    updateProgressBar(0, 'Decryption starting...');
    await decrypt(filePath, outputFolderPath, (progress, status) => {
      updateProgressBar(progress, status);
    });
    updateProgressBar(100, 'Decryption complete');
  }
});

// Ensure the password configuration is updated when the app starts
configurePassword();
