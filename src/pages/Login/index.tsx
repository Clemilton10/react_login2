import { ChangeEvent, useContext, useState } from 'react';
import { AuthContext } from '../../contexts/Auth/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
	const auth = useContext(AuthContext);
	const navigate = useNavigate();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const handleEmail = (e: ChangeEvent<HTMLInputElement>) => {
		setEmail(e.target.value);
	};

	const handleLogin = async () => {
		if (email && password) {
			const isLogged = await auth.signin(email, password);
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
				value={email}
				placeholder="E-mail"
				onChange={handleEmail}
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
