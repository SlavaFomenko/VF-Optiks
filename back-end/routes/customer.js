const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const db = require('../models/db')
const { password } = require('../config')
const adminCheckMiddleware = require('../middleware/adminCheckMiddleware')
const knexDB = require('../models/dbKnex')
const jwt = require('jsonwebtoken')
const { secretKey } = require('../config')

router.get('/:customer_id?', adminCheckMiddleware, async (req, res) => {
	const { customer_id } = req.params

	if (customer_id) {
		try {
			const result = await knexDB('Customers')
				.select('*')
				.where('customer_id', customer_id)
				.first()

			if (!result) {
				return res.status(404).json({ error: 'customer not found' })
			}

			// Exclude password field from the response
			const { password, ...userWithoutPassword } = result

			return res.status(200).json(userWithoutPassword)
		} catch (err) {
			console.error(err)
			return res.status(400).json({ error: 'invalid request' })
		}
	}

	let {
		page = 1,
		limit = 30,
		login,
		first_name,
		last_name,
		tel_number,
		role,
	} = req.query

	if (limit > 30) {
		limit = 30
	}

	try {
		page = Number(page)
		limit = Number(limit)
	} catch {
		return res.status(400).json({ message: 'invalid request' })
	}

	let query = knexDB('Customers')

	if (login || first_name || last_name || tel_number || role) {
		query = query.where(function () {
			if (login) this.where('login', 'like', `%${login}%`)
			if (first_name) this.where('first_name', first_name)
			if (last_name) this.where('last_name', last_name)
			if (tel_number) this.where('tel_number', tel_number)
			if (role) {
				if (Array.isArray(role)) {
					this.whereIn('role', role)
				} else {
					this.where('role', role)
				}
			}
		})
	}

	try {
		const offset = (page - 1) * limit

		const result = await query.limit(limit).offset(offset)

		if (result.length === 0) {
			return res.status(404).json({ error: 'no customers found' })
		}

		// убираю пароль
		const data = result.map(user => {
			const { password, ...userWithoutPassword } = user
			return userWithoutPassword
		})

		return res.status(200).json(data)
	} catch (err) {
		console.error(err)
		return res.status(400).json({ error: 'invalid request' })
	}
})
router.post('', async (req, res) => {
	try {
		// console.log('hello');
		let newRole = 'user'

		const token = req.headers.authorization?.split(' ')[1]

		if (token) {
			// console.log(secretKey);
			const decodedData = jwt.verify(token, secretKey)
			req.user = decodedData

			// Проверка роли в токене
			if (req.user.role === 'admin') {
				newRole = 'admin'
			}
		}

		const { login, first_name, last_name, password, tel_number, role } =
			req.body

		//   console.log(req.body);

		if (!login || !first_name || !last_name || !password || !tel_number) {
			return res.status(400).json({ message: 'invalid request' })
		}

		if (role) {
			if (role === 'user' || role === 'admin') {
				newRole = role
			} else {
				return res.status(400).json({ message: `invalid data '${role}'` })
			}
		}

		const saltRounds = 10
		const hashedPassword = await bcrypt.hash(password, saltRounds)
		try {
			await knexDB('Customers').insert({
				login,
				first_name,
				last_name,
				password: hashedPassword,
				tel_number,
				role: newRole,
			})

			const result = await knexDB('Customers')
				.select(
					'customer_id',
					'login',
					'first_name',
					'last_name',
					'tel_number',
					'role'
				)
				.where('login', login)
				.first()
			console.log(result)
			if (!result) {
				return res.status(404).json({ error: 'customer not found' })
			}
			return res.status(200).json(result)
		} catch (err) {
			console.log(err)
			if (err.code === 'ER_DUP_ENTRY') {
				return res.status(409).json({ message: 'duplicate data' })
			}
			return res.status(400).json({ message: 'bad request', info: err })
		}
	} catch (e) {
		console.log(e)
		return res.status(401).json(e)
	}
})

router.patch('/:login_id?', adminCheckMiddleware, async (req, res) => {

    console.log(req.body);

	const { login_id } = req.params
    // console.log(login_id);

	if (!login_id) {
		return res.status(400).json({ message: 'invalid request' })
	}

	const {
		login,
		first_name,
		last_name,
		tel_number,
		role,
		password, // Assuming password is part of the req.body
	} = req.body

	try {
		const updateParams = {}

		if (login) {
			updateParams.login = login
		}
		if (first_name) {
			updateParams.first_name = first_name
		}
		if (last_name) {
			updateParams.last_name = last_name
		}
		if (role) {
			updateParams.role = role
		}
		if (password) {
			const saltRounds = 10
			const hashedPassword = await bcrypt.hash(password, saltRounds)
			updateParams.password = hashedPassword
		}
		if (tel_number) {
			updateParams.tel_number = tel_number
		}

		const result = await knexDB('Customers')
			.where({ customer_id: login_id })
			.update(updateParams)

		if (result > 0) {
            const result = await knexDB('Customers')
				.select(
					'customer_id',
					'login',
					'first_name',
					'last_name',
					'tel_number',
					'role'
				)
				.where('login', login)
				.first()
			console.log(result)
			if (!result) {
				return res.status(404).json({ error: 'customer not found' })
			}
			return res.status(200).json(result)
		} else {
            console.log('hello');
            return res.status(400).json({ message: 'invalid request' })
		}
	} catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'invalid request duplicate data' })
		}
        console.log(error);
		return res.status(400).json({ error: 'invalid request' })
	}
})
router.delete('/:login?', adminCheckMiddleware, async (req, res) => {
	const { login } = req.params

	console.log(req.params)

	if (!login) {
		return res.status(400).json({ message: 'invalid request' })
	}
	const sqlQuery = 'DELETE FROM Customers WHERE customer_id = ?'
	db.query(sqlQuery, [login], (err, result) => {
		if (err) {
			console.error(err)
			return res.status(500).json({ message: 'internal server error' })
		}
		if (result.affectedRows >= 1) {
			return res.status(200).json({ message: 'deletion successful' })
		} else {
			return res.status(404).json({ message: 'customer not found' })
		}
	})
})

module.exports = router
