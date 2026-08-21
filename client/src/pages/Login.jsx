import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginApi } from '../api/authApi';
import useAuth from '../hooks/useAuth';
import { queryClient } from '../store/store';
import Card from '../components/Card';
import Loader from '../components/Loader';
import { PAGE_STYLES } from '../constants/styles';
import { PAGE_VARIABLES,COMMON_VARIABLES } from '../constants/variables';
import SEO from '../components/SEO';

function Login() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const navigate = useNavigate();
	const { login } = useAuth();
  const { login: loginStyles } = PAGE_STYLES;
  const { login: loginVariables } = PAGE_VARIABLES;
  const { EMPTY_TEXT } = COMMON_VARIABLES;

	const handleLogin = async e => {
		e.preventDefault();

		if (!email || !password) {
			setError(loginVariables.REQUIRED_ERROR);
			return;
		}

		setLoading(true);
		setError('');

		try {
			const response = await loginApi({ email, password });

			// Store token and user in auth store
			login({
				token: response.data.token,
				user: response.data.user
			});

			queryClient.clear();
			navigate(loginVariables.PRODUCTS_ROUTE);
		} catch (err) {
			const errorMsg = err.response?.data?.message || 'Login failed. Please try again.';
			setError(errorMsg);
		} finally {
			setLoading(false);
		}
	};

	return (
		<section className={loginStyles.container}>
			<SEO title="Login - Access Your Account" description="Log in to your account to shop, track orders, and manage your profile." />
			<div className={loginStyles.subContainer}>
				<div className={loginStyles.imgBlock}>
					<img src={loginVariables.IMG_SRC} alt="Login" loading="lazy" className="w-full h-auto object-contain" />
				</div>
				<div className={loginStyles.cardBlock}>
					<Card title="Login">
						<form onSubmit={handleLogin} className={loginStyles.form}>
							{error && <div className={loginStyles.formError}>{error}</div>}

							<input
								type="email"
								placeholder="Email"
								value={email}
								onChange={e => setEmail(e.target.value)}
								className={loginStyles.formInput}
								style={{ background: '#0d0d1a', borderColor: '#2a2a3e', color: '#fff' }}
							/>

							<input
								type="password"
								placeholder="Password"
								value={password}
								onChange={e => setPassword(e.target.value)}
								className={loginStyles.formInput}
								style={{ background: '#0d0d1a', borderColor: '#2a2a3e', color: '#fff' }}
							/>

							<button
								type="submit"
								className="btn"
								style={{ background: '#ff6600', color: '#fff', border: 'none' }}
								disabled={loading}>
								{loading ? (
									<>
										Login
										<Loader />
									</>
								) : (
									'Login'
								)}
							</button>
						</form>

						<div className={loginStyles.formAccount}>
							<p>Don't have an account?</p>

							<Link to={loginVariables.SIGNUP_ROUTE} className={loginStyles.formAccountLink} style={{ color: '#ff6600' }}>
								Signup
							</Link>
						</div>

						<div className="text-center mt-1">
							<Link to="/forgot-password" className={loginStyles.formAccountLink} style={{ color: '#ff6600' }}>
								Forgot Password?
							</Link>
						</div>
					</Card>
				</div>
			</div>
		</section>
	);
}

export default Login;
