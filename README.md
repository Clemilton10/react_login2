# Login

Site da API

[https://reqres.in/](https://reqres.in/)

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

mysql_server.sql

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
        `hash` VARCHAR(1024) NOT NULL
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

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

COMMIT;

SET FOREIGN_KEY_CHECKS=1;
```

mysql_server.js

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
	return new Buffer(bin).toString('hex');
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
		password: '******',
		database: 'mysql_server',
		waitForConnections: true,
		connectionLimit: 100,
		queueLimit: 0
	},
	exec: async (sql, params) => {
		const db = mysql.createConnection(MySQL.data);
		db.connect((err) => {
			if (err) {
				return {
					status_id: -1,
					status: 'Erro ao conectar ao banco',
					error: err
				};
			}
		});
		return new Promise(function (resolve, reject) {
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
		});
	},
	get: async (sql, params) => {
		const db = mysql.createConnection(MySQL.data);
		db.connect((err) => {
			if (err) {
				return {
					status_id: -1,
					status: 'Erro ao conectar ao banco',
					error: err
				};
			}
		});
		return new Promise(function (resolve, reject) {
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
		});
	},
	createToken: async (id, time) => {
		let hash = jwt.sign({ id: id }, '@rangel#', {
			expiresIn: '10m'
		});
		let r = await MySQL.exec('UPDATE `users` SET `hash`=? WHERE `id`=?', [
			hash,
			id
		]);
		return hash;
	},
	getHash: (req) => {
		let hash = req.header('authorization');
		if (hash) {
			return hash;
		}
		return '+++';
	},
	getToken: (req) => {
		let hash = req.header('authorization');
		if (hash) {
			try {
				let tk = jwt.verify(hash, '@rangel#');
				return tk;
			} catch (er) {
				return null;
			}
		}
		return null;
	},
	verifyToken: async (req, res, next) => {
		let hs = MySQL.getHash(req);
		let tk = MySQL.getToken(req);

		// caso o token não seja validado
		if (!tk) {
			return res
				.status(403)
				.json({ status_id: -3, status: 'Token inválido' });
		} else {
			let r = await MySQL.get(
				'SELECT `id` FROM `users` WHERE `id`=? AND `hash`=?',
				[tk.id, hs]
			);
			//error
			if (r.status_id < 0) {
				tk = MySQL.createToken(tk.id, '0s');
				return res
					.status(403)
					.json({ status_id: -3, status: 'Token inválido' });
				//not error
			} else {
				//not found user with password
				if (r.rows.length <= 0) {
					tk = MySQL.createToken(tk.id, '0s');
					return res
						.status(403)
						.json({ status_id: -3, status: 'Token inválido' });
				}
			}
		}

		// Continuar para a próxima rota se o token for válido
		next();
	}
};

app.post('/signin', async (req, res) => {
	let { user, password } = await req.body;
	password = sha1(md5(bin2hex(password)));

	let r = await MySQL.get(
		'SELECT `id` FROM `users` WHERE `user`=? AND `passwd`=?',
		[user, password]
	);
	//error
	if (r.status_id < 0) {
		res.json(r);
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
				//not error
			} else {
				//not found user
				if (ru.rows.length <= 0) {
					return res.json({
						status_id: -1,
						status: 'Usuário inválido'
					});
					//found user and not password
				} else {
					return res.json({
						status_id: -1,
						status: 'Senha inválida'
					});
				}
			}

			//found user with password
		} else {
			let tk = await MySQL.createToken(r.rows[0].id, '10m');
			return res.json({
				status_id: 1,
				status: 'success',
				token: tk,
				user: user,
				password: password
			});
		}
	}
});

app.post('/validate', async (req, res) => {
	let hs = MySQL.getHash(req);
	let tk = MySQL.getToken(req);
	if (tk) {
		let r = await MySQL.get('SELECT * FROM `users` WHERE `id`=?', [tk.id]);
		//error
		if (r.status_id < 0) {
			res.json(r);
			//not error
		} else {
			//not found user with password
			if (r.rows.length > 0) {
				res.json({
					status_id: 1,
					status: 'success',
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

app.get('/signout', MySQL.verifyToken, async (req, res) => {
	let tk = MySQL.getToken(req);
	if (tk) {
		let r = await MySQL.exec('UPDATE `users` SET `hash`=? WHERE `id`=?', [
			'---',
			tk.id
		]);
	}
	res.json({ status_id: 1, status: 'success' });
});

app.get('/', MySQL.verifyToken, async (req, res) => {
	let r = await MySQL.get(
		'SELECT `id`,`user` FROM `users` ORDER BY `user` ASC'
	);
	res.json(r);
});

app.post('/user', MySQL.verifyToken, async (req, res) => {
	let { user, password } = req.body;
	password = sha1(md5(bin2hex(password)));
	let r = await MySQL.exec(
		'INSERT INTO `users` (`user`,`passwd`) VALUES (?, ?)',
		[user, password]
	);
	res.json(r);
});

app.put('/user', async (req, res) => {
	let { id, user, password } = req.body;
	password = sha1(md5(bin2hex(password)));
	let r = await MySQL.exec(
		'UPDATE `users` SET `user`=?,`passwd`=? WHERE `id`=?',
		[user, password, id]
	);
	res.json(r);
});

app.delete('/user', MySQL.verifyToken, async (req, res) => {
	let { id } = req.body;
	let r = await MySQL.exec('DELETE FROM `users` WHERE `id`=?', [id]);
	res.json(r);
});

app.listen(99, () => {
	console.log('rodando na porta 99');
});
```
