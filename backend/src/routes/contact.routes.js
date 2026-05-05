const router = require('express').Router();
const { createContactValidate } = require('../middlewares/contactValidator');
const { ensureAuthenticated } = require('../middlewares/authorization');
const { createContact, updateContact, deleteContact, healthCheck } = require('../controllers/contact.controller');

router.post('/create', ensureAuthenticated, createContactValidate, createContact);
router.put('/update/:id', ensureAuthenticated, createContactValidate, updateContact);
router.delete('/delete/:id', ensureAuthenticated, deleteContact);
router.get('/health', ensureAuthenticated, healthCheck);

module.exports = router;