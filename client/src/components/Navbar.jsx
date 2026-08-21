import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAuth from '../hooks/useAuth';
import { getCart } from '../api/cartApi';
import { queryClient } from '../store/store';
import { getAvatar, updateAvatar } from '../api/avatarApi';
import RollingText from './RollingText';

const DEFAULT_AVATAR = 'https://img.daisyui.com/images/profile/demo/superperson@192.webp';

function Navbar() {
	const { isAuthenticated, isAdmin, user, logout } = useAuth();
	const { data: cartResponse } = useQuery({
		queryKey: ['cart'],
		queryFn: () => getCart(),
		enabled: isAuthenticated,
		refetchOnMount: 'always',
	});
	const cartCount = cartResponse?.data?.length || 0;
	const navigate = useNavigate();
	const [avatarUrl, setAvatarUrl] = useState(DEFAULT_AVATAR);
	const [previewUrl, setPreviewUrl] = useState(null);
	const [uploading, setUploading] = useState(false);
	const [drawerOpen, setDrawerOpen] = useState(false);

	useEffect(() => {
		if (isAuthenticated) {
			getAvatar()
				.then((data) => {
					if (data?.image) setAvatarUrl(data.image);
					else setAvatarUrl(DEFAULT_AVATAR);
				})
				.catch(() => setAvatarUrl(DEFAULT_AVATAR));
		} else {
			setAvatarUrl(DEFAULT_AVATAR);
		}
	}, [isAuthenticated, user?.id]);

	useEffect(() => {
		if (drawerOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
		return () => { document.body.style.overflow = ''; };
	}, [drawerOpen]);

	const handleFileChange = (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onloadend = () => setPreviewUrl(reader.result);
		reader.readAsDataURL(file);
	};

	const handleSave = async () => {
		if (!previewUrl) return;
		setUploading(true);
		try {
			const data = await updateAvatar(previewUrl);
			setAvatarUrl(data.image || previewUrl);
			setPreviewUrl(null);
			setDrawerOpen(false);
		} catch (err) {
			console.error('Failed to update avatar', err);
		} finally {
			setUploading(false);
		}
	};

	const handleLogout = () => {
		logout();
		queryClient.clear();
		navigate('/login');
	};

	return (
		<>
			<nav className="navbar flex items-center justify-between px-12 shadow-sm sticky top-0 z-50" style={{ background: 'rgba(15, 23, 42, 0.5)', borderBottom: '1px solid #2a2a3e' }} aria-label="Main navigation">
				<div className="navbar-start hidden md:flex">
					<Link to="/" className="btn btn-ghost text-xl"><img className='h-12' src='/images/shopping.png' alt="Ecommerce App Home" loading="lazy" /></Link>
				</div>
				<div className="navbar-start md:navbar-center flex items-center gap-1">
					<div className="megamenu megamenu-full" id="my-megamenu-4" popover>
						<span className="megamenu-active"></span>
						{isAdmin && (
							<Link to="/dashboard" className="inline-flex items-center min-h-[48px] min-w-[48px] px-3 text-white hover:text-orange-400">
								<RollingText>Dashboard</RollingText>
							</Link>
						)}
						<Link to="/products" className="inline-flex items-center min-h-[48px] min-w-[48px] px-3 text-white hover:text-orange-400">
							<RollingText>Products</RollingText>
						</Link>
						<Link to="/cart" className="inline-flex items-center min-h-[48px] min-w-[48px] px-3 text-white hover:text-orange-400">
							<RollingText>{`Cart${cartCount > 0 ? ` (${cartCount})` : ''}`}</RollingText>
						</Link>
					</div>
				</div>
				<div className="navbar-end flex items-center gap-4">
					{!isAuthenticated ? (
						<Link to="/login" className="btn px-4 min-h-[48px]" style={{ background: '#ff6600', color: '#fff', border: 'none' }}>
							Login
						</Link>
					) : (
						<>
							<button className="btn btn-ghost text-white hover:text-orange-400 min-h-[48px] min-w-[48px]" onClick={handleLogout}>
								Logout
							</button>
							<button className="avatar cursor-pointer min-h-[48px] min-w-[48px] flex items-center justify-center bg-transparent border-none" onClick={() => setDrawerOpen(true)} aria-label="Open profile">
								<div className="w-8 rounded">
									<img src={avatarUrl} alt="Your avatar" loading="lazy" />
								</div>
							</button>
						</>
					)}
				</div>
			</nav>

			{/* Profile Drawer */}
			<div className={`fixed inset-0 z-[100] ${drawerOpen ? 'visible' : 'invisible pointer-events-none'}`}>
				<div
					className={`absolute inset-0 bg-black/50 transition-opacity ${drawerOpen ? 'opacity-100' : 'opacity-0'}`}
					onClick={() => setDrawerOpen(false)}
				/>
				<div className={`absolute right-0 top-0 h-full w-80 bg-base-200 p-6 flex flex-col items-center gap-4 overflow-y-auto transition-transform ${drawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
					<h2 className="text-2xl font-bold">Profile</h2>
					<div className="avatar">
						<div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
							<img src={previewUrl || avatarUrl} alt="Profile" loading="lazy" />
						</div>
					</div>
					<input
						type="file"
						accept="image/*"
						className="file-input file-input-bordered file-input-sm w-full max-w-xs"
						onChange={handleFileChange}
					/>
					<div className="form-control w-full max-w-xs">
						<label className="label"><span className="label-text">Name</span></label>
						<input type="text" className="input input-bordered w-full" value={user?.name || ''} readOnly />
					</div>
					<div className="form-control w-full max-w-xs">
						<label className="label"><span className="label-text">Email</span></label>
						<input type="text" className="input input-bordered w-full" value={user?.email || ''} readOnly />
					</div>
					<button
						className="btn btn-neutral w-full max-w-xs mt-2"
						onClick={handleSave}
						disabled={!previewUrl || uploading}
					>
						{uploading ? 'SAVING...' : 'UPDATE'}
					</button>
				</div>
			</div>
		</>
	);
}

export default Navbar;
