import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { resetPasswordApi } from '../api/authApi';
import Card from '../components/Card';
import Loader from '../components/Loader';
import { PAGE_STYLES } from '../constants/styles';
import { PAGE_VARIABLES } from '../constants/variables';
import SEO from '../components/SEO';

function ResetPassword() {
	const navigate = useNavigate();
	const location = useLocation();
	const email = location.state?.email;
	const otp = location.state?.otp;
	const { resetPassword: styles } = PAGE_STYLES;
	const { resetPassword: variables } = PAGE_VARIABLES;

	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [toast, setToast] = useState(null);

	if (!email || !otp) {
		return (
			<section className={styles.container}>
				<Card title="Error">
					<p className="text-sm text-gray-400 mb-4">Invalid session. Please start from the forgot password page.</p>
					<Link to="/forgot-password" className="btn" style={{ background: '#ff6600', color: '#fff', border: 'none' }}>
						Go to Forgot Password
					</Link>
				</Card>
			</section>
		);
	}

	const showToast = (type, message) => {
		setToast({ type, message });
		setTimeout(() => setToast(null), 3000);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!password || !confirmPassword) {
			setError('Both fields are required');
			return;
		}

		if (password.length < 6) {
			setError('Password must be at least 6 characters');
			return;
		}

		if (password !== confirmPassword) {
			setError('Passwords do not match');
			return;
		}

		setLoading(true);
		setError('');

		try {
			await resetPasswordApi({ email, otp, password });
			showToast('success', 'Password reset successfully!');
			setTimeout(() => navigate('/login'), 1500);
		} catch (err) {
			const errorMsg = err.response?.data?.message || 'Password reset failed. Please try again.';
			setError(errorMsg);
		} finally {
			setLoading(false);
		}
	};

	return (
		<section className={styles.container}>
			<SEO title="Reset Password - Set New Password" description="Set a new secure password for your account." />
			<div className={styles.subContainer}>
				<div className={styles.imgBlock}>
					<img src={variables.IMG_SRC} alt="Reset Password" loading="lazy" className="w-full h-auto object-contain" />
				</div>
				<div className={styles.cardBlock}>
					<Card title="Reset Password">
						<p className="text-sm text-gray-400 mb-4">
							Set a new password for <span style={{ color: '#ff6600' }}>{email}</span>
						</p>
						<form onSubmit={handleSubmit} className={styles.form}>
							{error && <div className={styles.formError}>{error}</div>}

							<input
								type="password"
								placeholder="New Password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className={styles.formInput}
								style={{ background: '#0d0d1a', borderColor: '#2a2a3e', color: '#fff' }}
							/>

							<input
								type="password"
								placeholder="Confirm Password"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
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
										Resetting...
										<Loader />
									</>
								) : (
									'Reset Password'
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

			{toast && (
				<div className={styles.toastContainer}>
					<div className={`${styles.toastAlert} ${toast.type === 'success' ? 'alert-success' : 'alert-error'}`}>
						<span className="text-base">{toast.message}</span>
					</div>
				</div>
			)}
		</section>
	);
}

export default ResetPassword;
