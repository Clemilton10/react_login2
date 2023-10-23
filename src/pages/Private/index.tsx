import { useContext, useState } from 'react';
import { AuthContext } from '../../contexts/Auth/AuthContext';

const Private = () => {
	const auth = useContext(AuthContext);

	const [action, setAction] = useState('save');
	const [label, setLabel] = useState('Adicionar');
	const [id, setId] = useState('-1');
	const [user_, setUser_] = useState('');
	const [password, setPassword] = useState('');
	const [search, setSearch] = useState('');
	const [dt_ini, setDtIni] = useState('');
	const [dt_fin, setDtFin] = useState('');
	const [order, setOrder] = useState('id');
	const [meaning, setMeaning] = useState('ASC');
	const [user_list, setUserList] = useState<any>([]);
	const orders = [
		'id',
		'user',
		'dt_registration',
		'dt_update',
		'publisher_id'
	];
	const meanings = ['ASC', 'DESC'];

	const handleSubmit = async () => {
		if (user_) {
			let r;
			if (action == 'save') {
				if (password) {
					r = await auth.userAdd(user_, password);
				}
			} else if (action == 'edit') {
				r = await auth.userEdi(Number(id), user_, password);
			} else {
				r = await auth.userDel(Number(id));
			}
			console.log(r);
			if (r && r.status_id) {
				if (r.status_id < 0) {
					if (r.status_id == -3) {
						window.location.href = window.location.href;
					} else {
						alert('Houve algum erro');
					}
				} else {
					alert('Salvo!');
					handleClear();
				}
			} else {
				alert('Houve algum erro');
			}
		}
	};

	const handleSearch = async () => {
		const r = await auth.userGet(
			'`id`,`user`,`dt_registration`,`dt_update`,`publisher_id`',
			search,
			dt_ini,
			dt_fin,
			`\`${order}\``,
			meaning,
			''
		);
		if (r && r.status_id) {
			if (r.status_id < 0) {
				if (r.status_id == -3) {
					window.location.href = window.location.href;
				} else {
					alert('Houve algum erro');
				}
			} else {
				setUserList(r.rows);
			}
		} else {
			alert('Houve algum erro');
		}
	};

	const handleClear = () => {
		setLabel('Adicionar');
		setAction('save');
		setId('-1');
		setUser_('');
		setPassword('');
	};

	const handleEdit = (x: number) => {
		setLabel('Editar');
		setAction('edit');
		setId(String(user_list[x].id));
		setUser_(user_list[x].user);
		setPassword('');
	};

	const handleDelete = (x: number) => {
		setLabel('Excluir');
		setAction('delete');
		setId(String(user_list[x].id));
		setUser_(user_list[x].user);
		setPassword('');
	};

	return (
		<>
			<div className="content">
				<h1>Private</h1>
				<input
					type="text"
					value={id}
					placeholder="Id"
					onChange={(e) => setId(e.target.value)}
				/>
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
				<input type="button" value={label} onClick={handleSubmit} />
				<input
					type="text"
					value={search}
					placeholder="Search"
					onChange={(e) => setSearch(e.target.value)}
				/>
				<input
					type="text"
					value={dt_ini}
					placeholder="Dt Inicial"
					onChange={(e) => setDtIni(e.target.value)}
				/>
				<input
					type="text"
					value={dt_fin}
					placeholder="Dt Final"
					onChange={(e) => setDtFin(e.target.value)}
				/>
				<select onChange={(e) => setOrder(e.target.value)}>
					{orders.map((o) =>
						o == order ? (
							<option key={o} defaultValue={o}>
								{o}
							</option>
						) : (
							<option key={o} value={o}>
								{o}
							</option>
						)
					)}
				</select>
				<select onChange={(e) => setMeaning(e.target.value)}>
					{meanings.map((m) =>
						m == meaning ? (
							<option key={m} defaultValue={m}>
								{m}
							</option>
						) : (
							<option key={m} value={m}>
								{m}
							</option>
						)
					)}
				</select>
				<input type="button" value="Search" onClick={handleSearch} />
			</div>
			<table
				border={0}
				cellSpacing={0}
				cellPadding={0}
				width={1024}
				className="table"
			>
				{user_list.map((l: any, i: number) => (
					<tr key={i}>
						<td className="delete" onClick={() => handleDelete(i)}>
							x
						</td>
						<td onClick={() => handleEdit(i)}>{l.id}</td>
						<td onClick={() => handleEdit(i)}>{l.user}</td>
						<td onClick={() => handleEdit(i)}>
							{l.dt_registration}
						</td>
						<td onClick={() => handleEdit(i)}>{l.dt_update}</td>
						<td onClick={() => handleEdit(i)}>{l.publisher_id}</td>
						<td className="edit" onClick={() => handleEdit(i)}>
							//
						</td>
					</tr>
				))}
			</table>
		</>
	);
};
export default Private;
