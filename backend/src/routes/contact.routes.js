const router = require('express').Router();
const { createContactValidate } = require('../middlewares/contactValidator');
const { ensureAuthenticated } = require('../middlewares/authorization');
const { createContact, updateContact, deleteContact, healthCheck, getAllContacts } = require('../controllers/contact.controller');

router.post('/create', ensureAuthenticated, createContactValidate, createContact);
router.put('/update/:id', ensureAuthenticated, createContactValidate, updateContact);
router.delete('/delete/:id', ensureAuthenticated, deleteContact);
router.get('/health', ensureAuthenticated, healthCheck);
router.get('/all', ensureAuthenticated, getAllContacts);

module.exports = router;