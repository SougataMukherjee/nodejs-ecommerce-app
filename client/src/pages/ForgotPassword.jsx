import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { forgotPasswordApi } from '../api/authApi';
import Card from '../components/Card';
import Loader from '../components/Loader';
import { PAGE_STYLES } from '../constants/styles';
import { PAGE_VARIABLES } from '../constants/variables';
import SEO from '../components/SEO';

function ForgotPassword() {
	const navigate = useNavigate();
	const [email, setEmail] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const { forgotPassword: styles } = PAGE_STYLES;
	const { forgotPassword: variables } = PAGE_VARIABLES;

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!email) {
			setError('Email is required');
			return;
		}

		setLoading(true);
		setError('');

		try {
			await forgotPasswordApi({ email });
			navigate('/otp-verify', { state: { email } });
		} catch (err) {
			const errorMsg = err.response?.data?.message || 'Failed to send OTP. Please try again.';
			setError(errorMsg);
		} finally {
			setLoading(false);
		}
	};

	return (
		<section className={styles.container}>
			<SEO title="Forgot Password - Reset Your Password" description="Forgot your password? Enter your email to receive a verification code and reset your password." />
			<div className={styles.subContainer}>
				<div className={styles.imgBlock}>
					<img src={variables.IMG_SRC} alt="Forgot Password" loading="lazy" className="w-full h-auto object-contain" />
				</div>
				<div className={styles.cardBlock}>
					<Card title="Forgot Password">
						<p className="text-sm text-gray-400 mb-4">
							Enter your registered email to receive an OTP.
						</p>
						<form onSubmit={handleSubmit} className={styles.form}>
							{error && <div className={styles.formError}>{error}</div>}

							<input
								type="email"
								placeholder="Email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className={styles.formInput}
								style={{ background: '#0d0d1a', borderColor: '#2a2a3e', color: '#fff' }}
							/>

							<button
								type="submit"
								className="btn"
								style={{ background: '#ff6600', color: '#fff', border: 'none' }}
								disabled={loading}>
								{loading ? (
									<>
										Sending OTP...
										<Loader />
									</>
								) : (
									'Send OTP'
								)}
							</button>
						</form>

						<div className={styles.formAccount}>
							<Link to="/login" className={styles.formAccountLink} style={{ color: '#ff6600' }}>
								Back to Login
							</Link>
						</div>
					</Card>
				</div>
			</div>
		</section>
	);
}

export default ForgotPassword;
