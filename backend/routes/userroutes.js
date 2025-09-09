const express = require('express');
const User = require('../model/user');
const router = express.Router();
const bcrypt = require('bcrypt');

// Register a new user
router.post('/signup', async (req, res) => {
    const { email, password, address, libraryId, contact } = req.body;

    if (!email || !password || !address || !libraryId || !contact) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const existingUser = await User.findOne({
            $or: [{ email }, { libraryId }]
        });

        if (existingUser) {
            return res.status(409).json({ message: 'Email or Library ID already registered' });
        }

        const newUser = new User({ email, password, address, libraryId, contact });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// User login (simple version)
router.post('/', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

        res.json({ message: 'Login successful', user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error logging in' });
    }
});

module.exports = router;
