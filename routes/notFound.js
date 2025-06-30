const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('error', { error: '404', title: 'Página não encontrada', description: 'Esta página não existe ou não foi implementada ainda' });
});

module.exports = router;
