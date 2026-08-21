import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signupApi } from '../api/authApi';
import Card from '../components/Card';
import { PAGE_STYLES } from '../constants/styles';
import { PAGE_VARIABLES,COMMON_VARIABLES } from '../constants/variables';
import SEO from '../components/SEO';

function Signup() {
	const navigate = useNavigate();
	const { signup: signupStyles } = PAGE_STYLES;
	const { EMPTY_TEXT } = COMMON_VARIABLES;
	const { signup: signupVariables } = PAGE_VARIABLES;
	const [formData, setFormData] = useState({
		name: EMPTY_TEXT,
		email: EMPTY_TEXT,
		password: EMPTY_TEXT
	});

	const [loading, setLoading] = useState(false);
	const [toast, setToast] = useState(null);

	const handleChange = e => {
		setFormData(prev => ({
			...prev,
			[e.target.name]: e.target.value
		}));
	};
	const showToast = (type, message) => {
		setToast({ type, message });

		setTimeout(() => {
			setToast(null);
		}, 3000);
	};
	const handleSubmit = async e => {
		e.preventDefault();

		try {
			setLoading(true);

			// DEBUG: Log form data being sent
			console.log('📝 Form Data Submitted:', formData);
			await signupApi(formData);
			showToast('success', 'Account Created Successfully');

			setTimeout(() => {
				navigate(signupVariables.LOGIN_ROUTE);
			}, 1500);
		} catch (error) {
			// DEBUG: Enhanced error logging
			const errorMsg = error.response?.data?.message || 'Signup Failed';
			showToast('error', errorMsg);
		} finally {
			setLoading(false);
		}
	};

	return (
		<section className={signupStyles.container}>
			<SEO title="Sign Up - Create Your Account" description="Create a free account to start shopping. Get access to exclusive deals and fast checkout." />
			<div className={signupStyles.subContainer}>
				<div className={signupStyles.imgBlock}>
					<img src={signupVariables.IMG_SRC} alt="Signup" loading="lazy" className="w-full h-auto object-contain" />
				</div>
				<div className={signupStyles.cardBlock}>
					<h1 className={signupStyles.cardHeading}>Signup</h1>
					<Card title="Create Account">
						<form onSubmit={handleSubmit} className={signupStyles.form}>
							<input
								type="text"
								name="name"
								placeholder="Full Name"
								value={formData.name}
								onChange={handleChange}
								className={signupStyles.formInput}
								style={{ background: '#0d0d1a', borderColor: '#2a2a3e', color: '#fff' }}
							/>

							<input
								type="email"
								name="email"
								placeholder="Email"
								value={formData.email}
								onChange={handleChange}
								className={signupStyles.formInput}
								style={{ background: '#0d0d1a', borderColor: '#2a2a3e', color: '#fff' }}
							/>

							<input
								type="password"
								name="password"
								placeholder="Password"
								value={formData.password}
								onChange={handleChange}
								className={signupStyles.formInput}
								style={{ background: '#0d0d1a', borderColor: '#2a2a3e', color: '#fff' }}
							/>

							<button
								className="btn"
								style={{ background: '#ff6600', color: '#fff', border: 'none' }}>
								Signup
							</button>
						</form>

						<div className={signupStyles.formAccount}>
							<p>Already have an account?</p>

							<Link
								to={signupVariables.LOGIN_ROUTE}
								className={signupStyles.formAccountLink}
								style={{ color: '#ff6600' }}>
								Login
							</Link>
						</div>
					</Card>
				</div>
			</div>
			{toast && (
				<div className={signupStyles.toastContainer}>
					<div
						className={`${signupStyles.toastAlert} ${
							toast.type === 'success'
								? signupStyles.toastSuccess
								: toast.type === 'error'
								? signupStyles.toastError
								: signupStyles.toastInfo
						}`}>
						<span className={signupStyles.toastMessage}>{toast.message}</span>
					</div>
				</div>
			)}
		</section>
	);
}

export default Signup;
