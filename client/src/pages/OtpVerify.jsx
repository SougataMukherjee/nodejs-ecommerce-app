import { useState, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { verifyOtpApi } from '../api/authApi';
import Card from '../components/Card';
import Loader from '../components/Loader';
import { PAGE_STYLES } from '../constants/styles';
import { PAGE_VARIABLES } from '../constants/variables';
import SEO from '../components/SEO';

const OTP_LENGTH = 6;

function OtpVerify() {
	const navigate = useNavigate();
	const location = useLocation();
	const email = location.state?.email;
	const { otpVerify: styles } = PAGE_STYLES;
	const { otpVerify: variables } = PAGE_VARIABLES;

	const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const inputRefs = useRef([]);

	if (!email) {
		return (
			<section className={styles.container}>
				<Card title="Error">
					<p className="text-sm text-gray-400 mb-4">No email provided. Please start from the forgot password page.</p>
					<Link to="/forgot-password" className="btn" style={{ background: '#ff6600', color: '#fff', border: 'none' }}>
						Go to Forgot Password
					</Link>
				</Card>
			</section>
		);
	}

	const handleChange = (index, value) => {
		if (!/^\d*$/.test(value)) return;

		const newOtp = [...otp];
		newOtp[index] = value.slice(-1);
		setOtp(newOtp);

		if (value && index < OTP_LENGTH - 1) {
			inputRefs.current[index + 1]?.focus();
		}
	};

	const handleKeyDown = (index, e) => {
		if (e.key === 'Backspace' && !otp[index] && index > 0) {
			inputRefs.current[index - 1]?.focus();
		}
	};

	const handlePaste = (e) => {
		e.preventDefault();
		const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
		const newOtp = [...otp];
		for (let i = 0; i < pastedData.length; i++) {
			newOtp[i] = pastedData[i];
		}
		setOtp(newOtp);
		const nextIndex = Math.min(pastedData.length, OTP_LENGTH - 1);
		inputRefs.current[nextIndex]?.focus();
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const otpValue = otp.join('');

		if (otpValue.length !== OTP_LENGTH) {
			setError('Please enter the complete OTP');
			return;
		}

		setLoading(true);
		setError('');

		try {
			await verifyOtpApi({ email, otp: otpValue });
			navigate('/reset-password', { state: { email, otp: otpValue } });
		} catch (err) {
			const errorMsg = err.response?.data?.message || 'Invalid OTP. Please try again.';
			setError(errorMsg);
		} finally {
			setLoading(false);
		}
	};

	return (
		<section className={styles.container}>
			<SEO title="Verify OTP - Confirm Your Identity" description="Enter the OTP sent to your email to verify your identity and proceed with password reset." />
			<div className={styles.subContainer}>
				<div className={styles.imgBlock}>
					<img src={variables.IMG_SRC} alt="OTP Verify" loading="lazy" className="w-full h-auto object-contain" />
				</div>
				<div className={styles.cardBlock}>
					<Card title="Verify OTP">
						<p className="text-sm text-gray-400 mb-4">
							Enter the 6-digit OTP sent to <span style={{ color: '#ff6600' }}>{email}</span>
						</p>
						<form onSubmit={handleSubmit} className={styles.form}>
							{error && <div className={styles.formError}>{error}</div>}

							<div className={styles.otpContainer} onPaste={handlePaste}>
								{otp.map((digit, index) => (
									<input
										key={index}
										ref={(el) => (inputRefs.current[index] = el)}
										type="text"
										inputMode="numeric"
										maxLength={1}
										value={digit}
										onChange={(e) => handleChange(index, e.target.value)}
										onKeyDown={(e) => handleKeyDown(index, e)}
										className={styles.otpInput}
										style={{ background: '#0d0d1a', borderColor: '#2a2a3e', color: '#fff' }}
									/>
								))}
							</div>

							<button
								type="submit"
								className="btn"
								style={{ background: '#ff6600', color: '#fff', border: 'none' }}
								disabled={loading}>
								{loading ? (
									<>
										Verifying...
										<Loader />
									</>
								) : (
									'Verify OTP'
								)}
							</button>
						</form>

						<div className={styles.formAccount}>
							<Link to="/forgot-password" className={styles.formAccountLink} style={{ color: '#ff6600' }}>
								Resend OTP
							</Link>
						</div>
					</Card>
				</div>
			</div>
		</section>
	);
}

export default OtpVerify;
