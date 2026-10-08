const express = require('express');
const path = require('node:path');

const router = express.Router();
const frontendDirectory = path.resolve(__dirname, '../../../todo-firebase');

router.get(['/', '/index.html'], (req, res) => {
  res.sendFile('index.html', { root: frontendDirectory });
});

for (const file of ['globals.css', 'app.js', 'todo-db.js']) {
  router.get(`/${file}`, (req, res) => {
    res.sendFile(file, { root: frontendDirectory });
  });
}

module.exports = router;
