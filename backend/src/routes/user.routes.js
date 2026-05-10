const router = require('express').Router();
const { signUpValidate, signInValidate } = require('../middlewares/authValidator');
const { signUp, signIn, refreshToken } = require('../controllers/user.controller');

router.post('/signup', signUpValidate, signUp);
router.post('/signin', signInValidate, signIn);
router.post('/refresh', refreshToken);
router.get('/health', (req,res) => {
    res.send('Hello World');
});

module.exports = router;