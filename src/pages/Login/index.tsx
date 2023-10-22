import { ChangeEvent, useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../contexts/Auth/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
	const auth = useContext(AuthContext);
	const navigate = useNavigate();

	const [user_, setUser_] = useState('');
	const [password, setPassword] = useState('');

	const handleUser_ = (e: ChangeEvent<HTMLInputElement>) => {
		setUser_(e.target.value);
	};

	useEffect(() => {
		if (auth.user_?.user_) {
			setUser_(auth.user_.user_);
		} else {
			const vuser_ = localStorage.getItem('user');
			if (vuser_) {
				setUser_(vuser_);
			}
		}
	}, []);

	const handleLogin = async () => {
		if (user_ && password) {
			const isLogged = await auth.signin(user_, password);
			if (isLogged) {
				navigate('/private');
			} else {
				alert('Não deu certo!');
			}
		}
	};

	return (
		<div className="content">
			<h2>Login</h2>
			<input
				type="text"
				value={user_}
				placeholder="User"
				onChange={handleUser_}
			/>
			<input
				type="password"
				value={password}
				placeholder="Senha"
				onChange={(e) => setPassword(e.target.value)}
			/>
			<input type="button" value="Entrar" onClick={handleLogin} />
		</div>
	);
};
