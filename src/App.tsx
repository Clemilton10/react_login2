import './App.css';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Private from './pages/Private';
import { RequireAuth } from './contexts/Auth/RequireAuth';
import { useContext } from 'react';
import { AuthContext } from './contexts/Auth/AuthContext';

function App() {
	const auth = useContext(AuthContext);
	const navigate = useNavigate();
	const handleSignOut = async () => {
		await auth.signout();
		navigate('/private');
	};
	return (
		<>
			<div className="App">
				<header>
					<h1>Header do Site</h1>
					<nav>
						<Link to="/">Home</Link>
						<Link to="/private">Private</Link>
						{auth.user && (
							<a href="#" onClick={handleSignOut}>
								Sair
							</a>
						)}
					</nav>
				</header>
				<hr />
				<Routes>
					<Route path="/" element={<Home />} />
					<Route
						path="/private"
						element={
							<RequireAuth>
								<Private />
							</RequireAuth>
						}
					/>
				</Routes>
			</div>
		</>
	);
}

export default App;
