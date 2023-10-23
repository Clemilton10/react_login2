import { ChangeEvent, useContext, useState } from 'react';
import { AuthContext } from '../../contexts/Auth/AuthContext';
import { useNavigate } from 'react-router-dom';

const Private = () => {
	const auth = useContext(AuthContext);
	const navigate = useNavigate();

	const [user_, setUser_] = useState('');
	const [password, setPassword] = useState('');

	const handleSubmit = async () => {
		if (user_ && password) {
			const r = await auth.userAdd(user_, password);
			if (r && r.status_id) {
				if (r.status_id < 0) {
					if (r.status_id == -3) {
						window.location.href = window.location.href;
					} else {
						alert('Não deu certo');
					}
				} else {
					alert('Salvo!');
				}
			} else {
				alert('Não deu certo');
			}
		}
	};

	return (
		<div>
			<h1>Private</h1>
			<input
				type="text"
				value={user_}
				placeholder="User"
				onChange={(e) => setUser_(e.target.value)}
			/>
			<input
				type="password"
				value={password}
				placeholder="Senha"
				onChange={(e) => setPassword(e.target.value)}
			/>
			<input type="button" value="Entrar" onClick={handleSubmit} />
		</div>
	);
};
export default Private;
