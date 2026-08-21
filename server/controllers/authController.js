const axios = require('axios');
const jwt = require('jsonwebtoken');

const DB_URL = require('../config/db');
const sendEmail = require('../utils/sendEmail');

exports.signup = async (req, res) => {
	try {
		const { name, email, password } = req.body;

		// DEBUG: Log incoming request
		console.log('🔵 [SIGNUP] Request received:', { name, email, password: '***' });

		// Validate required fields
		if (!name || !email || !password) {
			console.warn('⚠️ [SIGNUP] Validation failed - Missing required fields');
			return res.status(400).json({
				message: 'Name, email, and password are required'
			});
		}

		// DEBUG: Check if DB connection works
		console.log(
			'🔍 [SIGNUP] Checking if email already exists at:',
			`${DB_URL}/users?email=${email}`
		);

		// Check if user already exists
		const { data: existingUsers } = await axios.get(`${DB_URL}/users?email=${email}`);

		console.log('🔍 [SIGNUP] Existing users found:', existingUsers.length);

		if (existingUsers.length > 0) {
			console.warn('⚠️ [SIGNUP] Email already registered');
			return res.status(400).json({
				message: 'Email already registered'
			});
		}

		// DEBUG: Creating new user
		console.log('✅ [SIGNUP] Creating new user...');

		// Create new user
		const { data } = await axios.post(`${DB_URL}/users`, {
			name,
			email,
			password,
			role: 'user'
		});

		console.log('✅ [SIGNUP] User created successfully:', data.id);

		res.status(201).json({
			message: 'Signup successful',
			user: data
		});
	} catch (error) {
		console.error('❌ [SIGNUP] Error Details:', {
			message: error.message,
			code: error.code,
			url: error.config?.url,
			status: error.response?.status,
			responseData: error.response?.data,
			stack: error.stack
		});

		res.status(500).json({
			message: 'Signup failed',
			error: error.message,
			details: error.response?.data || 'No additional details'
		});
	}
};

exports.login = async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({
				message: 'Email and password are required'
			});
		}

		const { data } = await axios.get(`${DB_URL}/users?email=${email}`);

		const user = data[0];

		if (!user || user.password !== password) {
			return res.status(401).json({
				message: 'Invalid Credentials'
			});
		}

		const token = jwt.sign(
			{
				id: user.id,
				role: user.role
			},
			'secret',
			{
				expiresIn: '1d'
			}
		);

		const otp = Math.floor(100000 + Math.random() * 900000).toString();

		const message = `
        Welcome to Sam Shopping, ${user.name}!
        Thank you for logging in.
        Your OTP for Sam Shopping is: ${otp}
        `;

		await sendEmail(email, 'Welcome to Sam Shopping - Your OTP', message);

		res.json({
			message: 'Login successful',
			token,
			user
		});
	} catch (error) {
		console.error('Login error:', error.message);
		res.status(500).json({
			message: 'Login failed',
			error: error.message
		});
	}
};

// In-memory OTP store (key: email, value: { otp, expiresAt })
const otpStore = new Map();

exports.forgotPassword = async (req, res) => {
	try {
		const { email } = req.body;

		if (!email) {
			return res.status(400).json({ message: 'Email is required' });
		}

		const { data } = await axios.get(`${DB_URL}/users?email=${email}`);
		const user = data[0];

		if (!user) {
			return res.status(404).json({ message: 'No account found with this email' });
		}

		const otp = Math.floor(100000 + Math.random() * 900000).toString();
		otpStore.set(email, { otp, expiresAt: Date.now() + 10 * 60 * 1000 });

		const message = `
Hi ${user.name},

Your OTP for password reset is: ${otp}

This OTP is valid for 10 minutes.
Do not share it with anyone.
`;

		await sendEmail(email, 'Password Reset OTP - Sam Shopping', message);

		res.json({ message: 'OTP sent to your email' });
	} catch (error) {
		console.error('Forgot password error:', error.message);
		res.status(500).json({ message: 'Failed to send OTP', error: error.message });
	}
};

exports.verifyOtp = async (req, res) => {
	try {
		const { email, otp } = req.body;

		if (!email || !otp) {
			return res.status(400).json({ message: 'Email and OTP are required' });
		}

		const stored = otpStore.get(email);

		if (!stored) {
			return res.status(400).json({ message: 'No OTP found. Please request a new one.' });
		}

		if (Date.now() > stored.expiresAt) {
			otpStore.delete(email);
			return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
		}

		if (stored.otp !== otp) {
			return res.status(400).json({ message: 'Invalid OTP' });
		}

		res.json({ message: 'OTP verified successfully' });
	} catch (error) {
		console.error('Verify OTP error:', error.message);
		res.status(500).json({ message: 'OTP verification failed', error: error.message });
	}
};

exports.resetPassword = async (req, res) => {
	try {
		const { email, otp, password } = req.body;

		if (!email || !otp || !password) {
			return res.status(400).json({ message: 'Email, OTP, and new password are required' });
		}

		if (password.length < 6) {
			return res.status(400).json({ message: 'Password must be at least 6 characters' });
		}

		const stored = otpStore.get(email);

		if (!stored || stored.otp !== otp || Date.now() > stored.expiresAt) {
			return res.status(400).json({ message: 'Invalid or expired OTP. Please start over.' });
		}

		const { data } = await axios.get(`${DB_URL}/users?email=${email}`);
		const user = data[0];

		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		await axios.patch(`${DB_URL}/users/${user.id}`, { password });

		otpStore.delete(email);

		res.json({ message: 'Password reset successfully' });
	} catch (error) {
		console.error('Reset password error:', error.message);
		res.status(500).json({ message: 'Password reset failed', error: error.message });
	}
};
