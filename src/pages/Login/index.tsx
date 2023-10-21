import { ChangeEvent, useContext, useState } from 'react';
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
		<div>
			<h2>Login</h2>
			<input
				type="text"
				value={user_}
				placeholder="User"
				onChange={handleUser_}
				style={{ padding: '10px', outline: 'none' }}
			/>
			<input
				type="password"
				value={password}
				placeholder="Senha"
				onChange={(e) => setPassword(e.target.value)}
				style={{ padding: '10px', outline: 'none' }}
			/>
			<input
				type="button"
				value="Entrar"
				onClick={handleLogin}
				style={{ padding: '10px' }}
			/>
		</div>
	);
};
