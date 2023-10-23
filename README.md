# Login

Site da API

[https://reqres.in/](https://reqres.in/)

## instalação servidor Vite

```sh
# Criar Pasta do projeto
yarn create vite login2 --template react-ts

# Entrar na pasta e instalar pacotes necessários
cd login2
yarn

# Rodar aplicação
yarn dev

# Instalando o ANT DESIGN
yarn add antd

# Instalando o Axios para API
yarn add axios

# Instalando o sistema de rotas
yarn add react-router-dom
yarn add -D @types/react-router-dom
yarn add -D @types/node
```

## Instalador Servidor Node

```sh
# Criar servidor
mkdir mysql_server
cd mysql_server

npm init
npm install

# Instalar pacotes necessários
npm install -g nodemon
npm install -D express
npm install -D cors
npm install -D jsonwebtoken
npm install -D mysql
npm install -D sha1
npm install -D md5
npm install -D basic-ftp
npm install -D ftp

# Rodar o servidor
node mysql_server.js
nodemon mysql_server.js localhost 99
```

### mysql_server.sql

```sql
DROP DATABASE IF EXISTS `mysql_server`;

CREATE DATABASE
    `mysql_server` CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;

START TRANSACTION;

SET NAMES 'utf8mb4';

USE `mysql_server`;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";

START TRANSACTION;

SET FOREIGN_KEY_CHECKS=0;

CREATE TABLE
    `users` (
        `id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        `user` VARCHAR(255) NOT NULL UNIQUE,
        `passwd` VARCHAR(255) NOT NULL,
        `hash` VARCHAR(1024) NOT NULL,
        `dt_registration` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        `dt_update` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        `publisher_id` BIGINT NOT NULL DEFAULT 1
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

DELIMITER $$
CREATE TRIGGER `tg_users_insert` BEFORE INSERT ON `users`
FOR EACH ROW BEGIN
	SET NEW.`dt_registration` = NOW();
	SET NEW.`dt_update` = now();
	END $$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER `tg_users_update` BEFORE UPDATE ON `users`
FOR EACH ROW BEGIN
	SET NEW.`dt_update` = NOW();
	end $$
DELIMITER ;

INSERT INTO
    `users`(`id`, `user`, `passwd`)
VALUES (
        1,
        'COADM',
        'c0de340982622c75659531ee00dd94b3d4bc0c8b'
    ), (
        2,
        'COCAD',
        '4f5310766729133668ae313a574ac60ce807402e'
    ), (
        3,
        'COTV',
        '62d7e220e8b67e3ad92548bd9aa7822f2bbea5b2'
    ), (
        4,
        'AGADM',
        'c0de340982622c75659531ee00dd94b3d4bc0c8b'
    ), (
        5,
        'AGCAD',
        '4f5310766729133668ae313a574ac60ce807402e'
    ), (
        6,
        'AGTV',
        '62d7e220e8b67e3ad92548bd9aa7822f2bbea5b2'
    );

ALTER TABLE `users`
	ADD CONSTRAINT fk_users_publisher FOREIGN KEY (`publisher_id`) REFERENCES `users` (`id`);

COMMIT;

SET FOREIGN_KEY_CHECKS=1;
```

### mysql_server.js

```js
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const express = require('express');
//const { makeDb } = require('mysql-async-simple');
const util = require('util');
//npm install mysql2
//const Mysql = require('mysql2/promise');
const mysql = require('mysql');
const cors = require('cors');
const sha1 = require('sha1');
const md5 = require('md5');
const jwt = require('jsonwebtoken');
function bin2hex(bin) {
	return Buffer.from(bin).toString('hex');
}

// Server Express
const app = express();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// Connecting in MySQL Server
/*
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
flush privileges;
*/

const MySQL = {
	data: {
		host: 'localhost',
		user: 'root',
		password: '277908',
		database: 'mysql_server',
		waitForConnections: true,
		connectionLimit: 100,
		queueLimit: 0
	},
	exec: async (sql, params) => {
		const db = mysql.createConnection(MySQL.data);
		try {
			db.connect((err) => {
				if (err) {
					return {
						status_id: -1,
						status: 'Erro ao conectar ao banco',
						error: err
					};
				}
			});
		} catch (er) {
			return {
				status_id: -1,
				status: 'Erro ao conectar ao banco',
				error: er
			};
		}
		return new Promise(function (resolve, reject) {
			try {
				db.query(sql, params, function (error) {
					if (error) {
						reject({
							status_id: -2,
							status: 'Erro ao executar',
							error: error
						});
						return;
					} else {
						resolve({
							status_id: 1,
							status: 'success',
							id: this.lastID
						});
						return;
					}
				});
			} catch (er) {
				reject({
					status_id: -2,
					status: 'Erro ao executar',
					error: error
				});
				return;
			}
		});
	},
	get: async (sql, params) => {
		const db = mysql.createConnection(MySQL.data);
		try {
			db.connect((err) => {
				if (err) {
					return {
						status_id: -1,
						status: 'Erro ao conectar ao banco',
						error: err
					};
				}
			});
		} catch (er) {
			return {
				status_id: -1,
				status: 'Erro ao conectar ao banco',
				error: er
			};
		}
		return new Promise(function (resolve, reject) {
			try {
				db.query(sql, params, (err, results, fields) => {
					if (err) {
						reject({
							status_id: -2,
							status: 'Erro ao buscar',
							error: err
						});
						return;
					} else {
						if (results === undefined) {
							reject('undefined');
							return;
						} else {
							let rows = Object.values(
								JSON.parse(JSON.stringify(results))
							);
							resolve({
								status_id: 1,
								status: 'success',
								rows: rows
							});
							return;
						}
					}
				});
			} catch (er) {
				reject({
					status_id: -2,
					status: 'Erro ao buscar',
					error: err
				});
				return;
			}
		});
	},
	createToken: async (id, time) => {
		let t = sha1(md5(new Date().getTime()));
		let hash = jwt.sign({ id: id }, '@rangel#', {
			expiresIn: time
		});
		await MySQL.exec('UPDATE `users` SET `hash`=? WHERE `id`=?', [
			hash,
			id
		]);
		return hash;
	},
	getTokenHash: (req) => {
		let hash;
		try {
			hash = req.header('Authorization');
			hash = hash.replace('Bearer ', '').trim();
		} catch (er) {
			return null;
		}
		if (hash) {
			return hash;
		}
		return null;
	},
	getTokenId: (req) => {
		let hash = MySQL.getTokenHash(req);
		//const j = JSON.parse(atob(hash.split('.')[1]));
		//const j2 = JSON.parse(atob(hash.split('.')[0]));
		//const j3 = JSON.parse(atob(hash.split('.')[2]));
		//const exp = Date.now() >= j.exp * 1000;
		if (hash) {
			let tk;
			try {
				tk = jwt.verify(hash, '@rangel#');
			} catch (err) {
				// expirado
				if (err.name == 'TokenExpiredError') {
					return -1;
				} else {
					return -1;
				}
			}
			if (tk && tk.id) {
				return tk.id;
			} else {
				return -1;
			}
		}
		return -1;
	},
	verifyToken: async (req, res, next) => {
		let hs = MySQL.getTokenHash(req);
		let tkid = MySQL.getTokenId(req);

		// caso o token não seja validado
		if (tkid == -1) {
			res.json({ status_id: -3, status: 'Token inválido' });
			return;
		} else {
			let r = await MySQL.get(
				'SELECT `id` FROM `users` WHERE `id`=? AND `hash`=?',
				[tkid, hs]
			);
			//error
			if (r.status_id < 0) {
				tk = MySQL.createToken(tkid, '0s');
				res.json({ status_id: -3, status: 'Token inválido' });
				return;
				//not error
			} else {
				//not found user with password
				if (r.rows.length <= 0) {
					tk = MySQL.createToken(tkid, '0s');
					res.json({
						status_id: -3,
						status: 'Token inválido'
					});
					return;
				}
			}
		}
		next();
	}
};

app.post('/signin', async (req, res) => {
	let { user, password } = await req.body;
	user = user.toUpperCase().trim();
	password = sha1(md5(bin2hex(password)));

	let r = await MySQL.get(
		'SELECT `id` FROM `users` WHERE `user`=? AND `passwd`=?',
		[user, password]
	);
	//error
	if (r.status_id < 0) {
		res.json(r);
		return;
		//not error
	} else {
		//not found user with password
		if (r.rows.length <= 0) {
			// get user exists
			let ru = await MySQL.get(
				'SELECT `id` FROM `users` WHERE `user`=?',
				[user]
			);
			//error
			if (ru.status_id < 0) {
				res.json(r);
				return;
				//not error
			} else {
				//not found user
				if (ru.rows.length <= 0) {
					res.json({
						status_id: -1,
						status: 'Usuário inválido'
					});
					return;
					//found user and not password
				} else {
					res.json({
						status_id: -1,
						status: 'Senha inválida'
					});
				}
			}

			//found user with password
		} else {
			let tk = await MySQL.createToken(r.rows[0].id, '10m');
			res.json({
				status_id: 1,
				status: 'success',
				token: tk,
				id: r.rows[0].id,
				user: user,
				password: password
			});
		}
	}
});

app.post('/validate', async (req, res) => {
	let hs = MySQL.getTokenHash(req);
	let tkid = MySQL.getTokenId(req);
	if (tkid > -1) {
		let r = await MySQL.get('SELECT * FROM `users` WHERE `id`=?', [tkid]);
		//error
		if (r.status_id < 0) {
			res.json(r);
			return;
			//not error
		} else {
			//not found user with password
			if (r.rows.length > 0) {
				res.json({
					status_id: 1,
					status: 'success',
					id: r.rows[0].id,
					user: r.rows[0].user,
					password: r.rows[0].password,
					token: hs
				});
				return;
			}
		}
	}
	res.json({ status_id: -1, status: 'error' });
});

app.post('/signout', async (req, res) => {
	let tkid = MySQL.getTokenId(req);
	if (tkid > -1) {
		await MySQL.exec('UPDATE `users` SET `hash`=? WHERE `id`=?', [
			'',
			tkid
		]);
		res.json({ status_id: 1, status: 'success' });
		return;
	} else {
		let { id } = await req.body;
		if (id) {
			await MySQL.exec('UPDATE `users` SET `hash`=? WHERE `id`=?', [
				'',
				id
			]);
			res.json({ status_id: 1, status: 'success' });
			return;
		}
	}
	res.json({ status_id: -1, status: 'error' });
	return;
});

app.post('/user/get', MySQL.verifyToken, async (req, res) => {
	let { fields, search, dt_ini, dt_fin, order, meaning, limit } =
		await req.body;
	let params = [];
	let wh = [];
	let sc = '';
	if (search) {
		let s = search;
		while (s.indexOf(' ') > -1) {
			s = s.replace(' ', '%');
		}
		sc = `%${s}%`;
		wh.push(`\`user\` LIKE ?`);
		params.push(sc);
	}
	let di = '';
	let df = '';
	if (dt_ini && dt_fin) {
		let e = dt_ini.split('/');
		di = `${e[2]}-${e[1]}-${e[0]}T00:00:00`;
		e = dt_fin.split('/');
		df = `${e[2]}-${e[1]}-${e[0]}T23:59:59`;
		wh.push(`\`dt_registration\`>=?`);
		wh.push(`\`dt_update\`<=?`);
		params.push(di);
		params.push(df);
	}
	let where = '';
	if (wh.length > 0) {
		where = 'WHERE ' + wh.join(' AND ');
	}
	let q;
	try {
		q = await MySQL.get(
			`SELECT COUNT(\`id\`) as \`qtd\` FROM \`users\` ${where}`,
			params
		);
	} catch (er) {
		q = er;
	}
	let lt = '';
	if (limit) {
		lt = `LIMIT ${limit}`;
	}
	let r;
	try {
		r = await MySQL.get(
			`SELECT ${fields} FROM \`users\` ${where} ORDER BY ${order} ${meaning} ${lt}`,
			params
		);
	} catch (er) {
		r = er;
	}
	let qtd = 0;
	if (q && q.rows && q.rows.length > 0 && q.rows[0].qtd) {
		qtd = q.rows[0].qtd;
	}
	r.qtd = qtd;
	res.json(r);
	return;
});

// User - Add
app.post('/user', MySQL.verifyToken, async (req, res) => {
	let { user, password, publisher_id } = await req.body;
	user = user.toUpperCase().trim();
	password = sha1(md5(bin2hex(password)));
	let q;
	try {
		q = await MySQL.exec(
			'INSERT INTO `users` (`user`,`passwd`,`hash`,`publisher_id`) VALUES (?,?,?,?)',
			[user, password, '', publisher_id]
		);
	} catch (er) {
		q = er;
	}
	res.json(q);
	return;
});

// User - Edit
app.put('/user', async (req, res) => {
	let { id, user, password, publisher_id } = await req.body;
	user = user.toUpperCase().trim();
	let ps = '';
	let params = [user, publisher_id];
	if (password) {
		password = sha1(md5(bin2hex(password)));
		ps = `,\`passwd\`=?`;
		params.push(password);
	}
	params.push(id);
	let q;
	try {
		q = await MySQL.exec(
			`UPDATE \`users\` SET \`user\`=?,\`publisher_id\`=?${ps} WHERE \`id\`=?`,
			params
		);
	} catch (er) {
		q = er;
	}
	res.json(q);
	return;
});

app.delete('/user/:id', MySQL.verifyToken, async (req, res) => {
	const id = req.params.id;
	let q;
	try {
		q = await MySQL.exec('DELETE FROM `users` WHERE `id`=?', [id]);
	} catch (er) {
		q = er;
	}
	res.json(q);
	return;
});

app.listen(99, () => {
	console.log('rodando na porta 99');
	return;
});
```
