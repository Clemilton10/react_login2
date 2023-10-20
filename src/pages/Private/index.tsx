import { useContext } from 'react';
import { AuthContext } from '../../contexts/Auth/AuthContext';

const Private = () => {
	const auth = useContext(AuthContext);
	return (
		<div>
			<h1>Private</h1>
			Olá {auth.user?.name}, tudo bem?
		</div>
	);
};
export default Private;
