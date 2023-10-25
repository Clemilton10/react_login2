import { useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from '../../contexts/Auth/AuthContext';
import { Data } from '../../types/User';

const Private = () => {
	const auth = useContext(AuthContext);
	const initialized = useRef(false);

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
	const [qtdPages, setQtdPages] = useState<number>(1);
	const [pg, setPg] = useState<number>(1);
	const pgx = useRef();
	const orders = [
		'id',
		'user',
		'dt_registration',
		'dt_update',
		'publisher_id'
	];
	const meanings = ['ASC', 'DESC'];

	const strNumber = (n: any) => {
		if (!n || n == '' || isNaN(n)) {
			n = 0;
		} else {
			if (typeof n === 'string') {
				n = Number(n);
			}
		}
		return n;
	};
	const isInt = (n: any) => {
		n = strNumber(n);
		return Math.round(n) == n;
	};
	const isFloat = (n: any) => {
		n = strNumber(n);
		return Math.round(n) != n;
	};
	const sleep = (tp: number) => {
		return new Promise((resolve) => setTimeout(resolve, tp));
	};
	const handlePrevious = () => {
		let p = pg - 1;
		if (p < 1) {
			p = 1;
		}
		setPg(p);
		handleSearch();
	};
	const handleNext = async () => {
		let p = pg + 1;
		if (p > qtdPages) {
			p = qtdPages;
		}
		setPg(p);
		handleSearch();
	};
	const handleFisrt = () => {
		setPg(1);
		handleSearch();
	};
	const handleLast = () => {
		setPg(qtdPages);
		handleSearch();
	};
	const handlePgText = (e: any) => {
		let p = strNumber(e.target.value);
		if (p < 1) {
			p = 1;
		}
		if (p > qtdPages) {
			p = qtdPages;
		}
		setPg(p);
		handleSearch();
	};

	const handleSearch = async () => {
		await sleep(100);
		let p = strNumber(pgx.current.value);
		const limit = `${(p - 1) * 10},10`;
		const r: Data = await auth.userGet(
			'`id`,`user`,`dt_registration`,`dt_update`,`publisher_id`',
			search,
			dt_ini,
			dt_fin,
			`\`${order}\``,
			meaning,
			limit
		);
		if (r && r.status_id) {
			if (r.status_id < 0) {
				if (r.status_id == -3) {
					window.location.href = window.location.href;
				} else {
					alert('Houve algum erro');
				}
			} else {
				r.qtd = strNumber(r.qtd);
				let dv = r.qtd / 10;
				if (isFloat(dv)) {
					dv = Math.floor(dv) + 1;
				}
				setQtdPages(dv);
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
	const restSubmit = (r: Data) => {
		if (r.status_id) {
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
			console.log(r.status);
		}
	};
	const handleSubmit = async () => {
		if (user_) {
			if (action == 'save') {
				if (password) {
					const r: Data = await auth.userAdd(user_, password);
					restSubmit(r);
				}
			} else if (action == 'edit') {
				const r: Data = await auth.userEdi(Number(id), user_, password);
				restSubmit(r);
			} else {
				const r: Data = await auth.userDel(Number(id));
				restSubmit(r);
			}
		}
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
	useEffect(() => {
		if (!initialized.current) {
			initialized.current = true;
			auth.startToken();
		}
	}, []);

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
				<tbody>
					{user_list.map((l: any, i: number) => (
						<tr key={i}>
							<td
								className="delete"
								onClick={() => handleDelete(i)}
							>
								x
							</td>
							<td onClick={() => handleEdit(i)}>{l.id}</td>
							<td onClick={() => handleEdit(i)}>{l.user}</td>
							<td onClick={() => handleEdit(i)}>
								{l.dt_registration}
							</td>
							<td onClick={() => handleEdit(i)}>{l.dt_update}</td>
							<td onClick={() => handleEdit(i)}>
								{l.publisher_id}
							</td>
							<td className="edit" onClick={() => handleEdit(i)}>
								//
							</td>
						</tr>
					))}
				</tbody>
			</table>
			<div className="pagination">
				<input type="button" value="|<<" onClick={handleFisrt} />
				<input type="button" value="<<" onClick={handlePrevious} />
				<input
					ref={pgx}
					type="text"
					placeholder="Pg"
					value={pg}
					onChange={(e: any) => handlePgText(e)}
				/>
				<input type="button" value={qtdPages} />
				<input type="button" value=">>" onClick={handleNext} />
				<input type="button" value=">>|" onClick={handleLast} />
			</div>
		</>
	);
};
export default Private;
