const express = require('express')
const router = express.Router()
const knexDB = require('../models/dbKnex')

router.post('', async (req, res) => {
	try {
		const {
			customer_id,
			delivery_type_id = null,
			order_details,
			address = null,
		} = req.body
		const status_id = 1 // при создании заказа статус корзина

		if (
			!customer_id ||
			delivery_type_id ||
			!order_details ||
			order_details.length === 0 ||
			address
		) {
			return res
				.status(400)
				.json({
					error: 'Invalid request. Please provide required parameters.1',
				})
		}

		// Проверка существования клиента
		const existingCustomer = await knexDB('Customers')
			.select('customer_id')
			.where('customer_id', '=', customer_id)
			.first()

		if (!existingCustomer) {
			return res
				.status(404)
				.json({ error: `Customer with ID ${customer_id} does not exist.` })
		}

		// Проверка существования типа доставки
		// const existingDeliveryType = await knexDB('DeliveryTypes')
		//     .select('delivery_type_id')
		//     .where('delivery_type_id', '=', delivery_type_id)
		//     .first();

		// if (!existingDeliveryType) {
		//     return res.status(404).json({ error: `Delivery type with ID ${delivery_type_id} does not exist.` });
		// }

		// Создание заказа
		const [order_id] = await knexDB('Orders').insert({
			customer_id,
			status_id,
			delivery_type_id,
			// address, // Убрал address из вставки, так как теперь он может быть NULL
		})

		// Добавление товаров в заказ с проверкой доступного количества
		await Promise.all(
			order_details.map(async orderDetail => {
				const { product_id, quantity } = orderDetail

				// Проверка доступного количества товара
				const availableQuantity = await knexDB('Products')
					.select('quantity')
					.where('product_id', '=', product_id)
					.first()

				if (!availableQuantity || availableQuantity.quantity < quantity) {
					throw new Error(
						`Not enough quantity available for product_id: ${product_id}`
					)
				}

				// Добавление записи в Order_details
				await knexDB('Order_details').insert({
					order_id,
					product_id,
					quantity,
				})
				await knexDB('Products')
					.where('product_id', '=', product_id)
					.decrement('quantity', quantity)
			})
		)

		return res.status(200).json({ order_id })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: error.toString() })
	}
})

router.patch('/:order_id', async (req, res) => {
	// debugger
	try {
		const { customer_id, delivery_type_id, order_details, address, status_id } = req.body
        console.log();
		let orderId = req.params.order_id
		// console.log(status)
		console.log(req.body)
		if (isNaN(Number(orderId))) {
			return res.status(400).json({ error: 'Invalid data (order_id).' })
		} else {
			orderId = Number(orderId)
		}
		if (
			order_details &&
			(!Array.isArray(order_details) || order_details.length === 0)
		) {
			return res
				.status(400)
				.json({ error: 'Order details array is empty or not provided.' })
		}

		// проверка наличия хотя бы одного параметра для обновления
		if (!customer_id && !delivery_type_id && !order_details && !address) {
			return res
				.status(400)
				.json({ error: 'No valid parameters provided for update.' })
		}

		// получение существующего заказа
		const existingOrder = await knexDB('Orders')
			.select('*')
			.where('order_id', '=', orderId)
			.first()

		if (!existingOrder) {
			return res
				.status(404)
				.json({ error: `Order with ID ${orderId} does not exist.` })
		}

		// console.log(existingOrder)

		// обновление параметров заказа
		if (customer_id) {
			// проверка существования клиента
			const existingCustomer = await knexDB('Customers')
				.select('customer_id')
				.where('customer_id', '=', customer_id)
				.first()

			if (!existingCustomer) {
				return res
					.status(404)
					.json({ error: `Customer with ID ${customer_id} does not exist.` })
			}

			existingOrder.customer_id = customer_id
		}

		if (delivery_type_id) {
			// проверка существования типа доставки
			const existingDeliveryType = await knexDB('DeliveryTypes')
				.select('delivery_type_id')
				.where('delivery_type_id', '=', delivery_type_id)
				.first()

			if (!existingDeliveryType) {
				return res
					.status(404)
					.json({
						error: `Delivery type with ID ${delivery_type_id} does not exist.`,
					})
			}

			existingOrder.delivery_type_id = delivery_type_id
		}

        console.log('data');
		if (address) {
			// проверка наличия всех полей в объекте address
			const { street, city, house, zip_code } = address
			console.log(address)
			if (!street || !city || !house || !zip_code) {
				return res.status(400).json({ error: 'Address is incomplete.' })
			}
			existingOrder.address = JSON.stringify(address)
		}

		// console.log(status)

		if (status_id) {
			console.log('hello')
			existingOrder.status_id = status_id
		}

		// сохранение обновленных данных в БД
		await knexDB('Orders').where('order_id', '=', orderId).update(existingOrder)

		if (order_details && order_details.length > 0) {
			await Promise.all(
				order_details.map(async orderDetail => {
					const { product_id, quantity } = orderDetail
					if (quantity === 0) {
						await knexDB('Order_details')
							.where('product_id', '=', product_id)
							.del()
						// const sqlQuery = hello.toSQL();
						// console.log(hello.toString())
					}
				})
			)
		}

		// Добавление товаров в заказ
		if (order_details && order_details.length > 0) {
			await Promise.all(
				order_details.map(async orderDetail => {
					const { product_id, quantity } = orderDetail
					console.log(quantity)
					if (quantity > 0) {
						// проверка существует ли уже запись для данного продукта в заказе
						const existingOrderDetail = await knexDB('Order_details')
							.where({
								order_id: orderId,
								product_id: product_id,
							})
							.first()

						if (existingOrderDetail) {
							// Если запись существует, обновляем количество
							await knexDB('Order_details')
								.where({
									order_id: orderId,
									product_id: product_id,
								})
								.update({
									quantity: quantity,
								})

							//обновление количества в таблице Products
							const updatedQuantity = existingOrderDetail.quantity - quantity
							await knexDB('Products')
								.where('product_id', '=', product_id)
								.update({
									quantity: knexDB.raw(`GREATEST(quantity + ?, 0)`, [
										updatedQuantity,
									]),
								})
						} else {
							// Проверка доступного количества товара
							const availableQuantity = await knexDB('Products')
								.select('quantity')
								.where('product_id', '=', product_id)
								.first()

							if (!availableQuantity || availableQuantity.quantity < quantity) {
								throw new Error(
									`Not enough quantity available for product_id: ${product_id}`
								)
							}

							// если запись не существует, добавляем новую
							await knexDB('Order_details').insert({
								order_id: orderId,
								product_id: product_id,
								quantity: quantity,
							})

							// еменьшение доступного количества товара в Products
							await knexDB('Products')
								.where('product_id', '=', product_id)
								.decrement('quantity', quantity)
						}
					}
				})
			)
		}
		return res.status(200).json({ success: 'Done' })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: error.toString() })
	}
})

router.get('/:order_id?', async (req, res) => {
	try {
		let query = knexDB('Orders')
			.select({
				id: 'Orders.order_id',
				customer_id: 'Customers.customer_id',
				customerLogin: 'Customers.login',
				status: 'Statuses.description',
				address: 'Orders.address',
				deliveryType: 'DeliveryTypes.name',
				createOrderDate: 'Orders.order_date',
				totalPrice: knexDB.raw(
					'CONVERT(SUM(Order_details.quantity * Products.price), SIGNED)'
				),
				cart: knexDB.raw(
					'JSON_ARRAYAGG(JSON_OBJECT("id_product", Products.product_id,' +
						' "name", Products.name, "quantity", Order_details.quantity, "price", Products.price))'
				),
			})
			.join('Statuses', 'Statuses.status_id', '=', 'Orders.status_id')
			.join('Customers', 'Customers.customer_id', '=', 'Orders.customer_id')
			.leftJoin(
				'DeliveryTypes',
				'DeliveryTypes.delivery_type_id',
				'=',
				'Orders.delivery_type_id'
			)
			.leftJoin(
				'Order_details',
				'Orders.order_id',
				'=',
				'Order_details.order_id'
			)
			.leftJoin(
				'Products',
				'Order_details.product_id',
				'=',
				'Products.product_id'
			)
			.groupBy(
				'Orders.order_id',
				'Customers.login',
				'Statuses.description',
				'Orders.address',
				'DeliveryTypes.name'
			)

		const {
			user,
			status,
			page = 1,
			pageSize = 3,
			sortByDate,
			sortByPrice,
			productName,
		} = req.query
		const { order_id } = req.params // получение параметра order_id из URL

		if (order_id) {
			query = query.where('Orders.order_id', '=', order_id)
		} else {
			if (user) {
				query = query.where('Customers.login', '=', user)
			}

			if (status) {
				if (Array.isArray(status)) {
					// eсли status = массив используйте whereIn
					query = query.whereIn('Statuses.description', status) // where  some_titile in ('...','...')
				} else {
					// eсли status = не массив используйте обычное сравнение
					query = query.where('Statuses.description', '=', status)
				}
			}

			if (page && pageSize) {
				const offset = (page - 1) * pageSize
				const limit = Math.min(pageSize, 10000)
				query = query.offset(offset).limit(Number(limit))
			}

			if (sortByDate) {
				if (sortByDate === 'true') {
					query = query.orderBy('Orders.order_date', 'desc')
				} else {
					query = query.orderBy('Orders.order_date', 'asc')
				}
			}

			if (sortByPrice) {
				// console.log('hello')
				if (sortByPrice === 'true') {
					console.log(sortByPrice)
					query = query.orderBy('totalPrice', 'desc')
				} else {
					console.log(sortByPrice)

					query = query.orderBy('totalPrice', 'asc')
				}

				// console.log(query.toString())
			}

			if (productName) {
				query = query.whereRaw('LOWER(Products.name) LIKE ?', [
					`%${productName.toLowerCase()}%`,
				])
			}
		}
		const result = await query
		// console.log(query.toString())

		// console.log(result)
		return res.status(200).json(result)
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: 'invalid request' })
	}
})

router.delete('/:order_id', async (req, res) => {
	try {
		const orderId = req.params.order_id

		// удаление записей из Order_details по order_id
		await knexDB('Order_details').where('order_id', orderId).del()

		// удаление заказа по order_id
		const deletedOrder = await knexDB('Orders').where('order_id', orderId).del()

		if (deletedOrder) {
			return res
				.status(200)
				.json({ message: 'Order and related details deleted successfully.' })
		} else {
			return res.status(404).json({ error: 'Order not found.' })
		}
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: 'Failed to delete order.' })
	}
})

module.exports = router
