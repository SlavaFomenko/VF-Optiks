const express = require('express')
const fs = require('fs')
const router = express.Router()
const knexDB = require('../models/dbKnex')
// const uploadRouter = require('./ваш_путь_к_роутеру/uploadRouter'); // замените на ваш путь

const multer = require('multer')
const  {DEFAULT_URL}  = require('../config')

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'uploads/')
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + '-' + file.originalname)
	},
})

const upload = multer({ storage: storage })

router.post('/image', upload.array('images', 5), async (req, res) => {
	const product_id = req.body.product_id


	if (!req.files || req.files.length === 0) {
		return res
			.status(400)
			.json({ success: false, message: 'No images uploaded.' })
	}

	const imageUrls = req.files.map(file => file.path)

	try {
		await knexDB('ProductImages').insert(
			imageUrls.map(url => ({ product_id, image_url: `${DEFAULT_URL}/images/${url.split('/')[1]}` }))
		)

		res
			.status(200)
			.json({ success: true, message: 'Images uploaded successfully.' })
	} catch (error) {
		console.error(error)
		res.status(500).json({ success: false, message: 'Internal Server Error.' })
	}
})

router.patch('/image/:imageId', upload.single('image'), async (req, res) => {
	// console.log(req.file);
	const imageId = req.params.imageId
	const newImageUrl = req.file.path

	try {
		const existingImage = await knexDB('ProductImages')
			.where('image_id', imageId)
			.first()

		if (!existingImage) {
			return res
				.status(404)
				.json({ success: false, message: 'Image not found.' })
		}

		fs.unlinkSync(existingImage.image_url)

		await knexDB('ProductImages')
			.where('image_id', imageId)
			.update({ image_url: newImageUrl })

		res
			.status(200)
			.json({ success: true, message: 'Image updated successfully.' })
	} catch (error) {
		console.error(error)
		res.status(500).json({ success: false, message: 'Internal Server Error.' })
	}
})

router.delete('/image/:imageId', async (req, res) => {
	const imageId = req.params.imageId

	try {
		const imageToDelete = await knexDB('ProductImages')
			.where('image_id', imageId)
			.first()

		if (!imageToDelete) {
			return res
				.status(404)
				.json({ success: false, message: 'Image not found.' })
		}

		// Удаление изображения из папки
		const imageName = imageToDelete.image_url.split('/')[imageToDelete.image_url.split('/').length-1];

		const imagePath = `uploads/${imageName}`

		fs.unlinkSync(imagePath)

		await knexDB('ProductImages').where('image_id', imageId).del()

		res
			.status(200)
			.json({ success: true, message: 'Image deleted successfully.' })
	} catch (error) {
		console.error(error)
		res.status(500).json({ success: false, message: 'Internal Server Error.' })
	}
})

router.post('', async (req, res) => {
	const newProduct = req.body

	console.log(newProduct)

	try {
		const manufacturerIdResult = await knexDB('Manufacturers')
			.select('manufacturer_id')
			.where('name', '=', newProduct.manufacturer)
			.first()

		const categoryIdResult = await knexDB('Categories')
			.select('category_id')
			.where('name', '=', newProduct.category)
			.first()

		const genderIdResult = await knexDB('Genders')
			.select('gender_id')
			.where('name', '=', newProduct.gender)
			.first()

		if (!manufacturerIdResult) {
			return res
				.status(404)
				.json({ error: "invalid request (invalid data 'manufacturer')" })
		}
		if (!genderIdResult) {
			return res
				.status(404)
				.json({ error: "invalid request (invalid data 'gender')" })
		}
		if (!categoryIdResult) {
			return res
				.status(404)
				.json({ error: "invalid request (invalid data 'category')" })
		}

		const sql = `INSERT INTO Products (manufacturer_id, category_id, name, price, quantity, gender) 
                    VALUES (?, ?, ?, ?, ?, ?)`

		const values = [
			manufacturerIdResult.manufacturer_id,
			categoryIdResult.category_id,
			newProduct.name,
			newProduct.price,
			newProduct.quantity,
			genderIdResult.gender_id,
		]

		await knexDB.raw(sql, values)

		res.status(201).json({ message: 'done' })
	} catch (error) {
		console.log(error)
		res.status(400).json({ error: 'invalid request (invalid data)' })
	}
})



router.get('', async (req, res) => {
	try {
		const {
			id,
			page = 1,
			pageSize = 5,
			manufactures,
			categories,
			priceFrom,
			priceTo,
			genders,
			priceInDescendingOrder,
			country,
			name,
		} = req.query;

		let query = knexDB('Products')
			.select({
				id: 'Products.product_id',
				product: 'Products.name',
				category: 'Categories.name',
				gender: 'Genders.name',
				manufacturer: 'Manufacturers.name',
				country: 'Manufacturers.country',
			})
			.join('Categories', 'Products.category_id', '=', 'Categories.category_id')
			.join('Genders', 'Products.gender', '=', 'Genders.gender_id')
			.join(
				'Manufacturers',
				'Products.manufacturer_id',
				'=',
				'Manufacturers.manufacturer_id'
			)
			.leftJoin(
				'ProductImages',
				'Products.product_id',
				'=',
				'ProductImages.product_id'
			)
			.select('ProductImages.image_id', 'ProductImages.image_url');

		if (Array.isArray(categories)) {
			query = query.whereIn('Categories.name', categories);
		} else if (categories) {
			query = query.where('Categories.name', '=', categories);
		}

		if (id) {
			query = query.where('Products.product_id', '=', id);
		}else {

			
			if (categories) {
				console.log(categories);
				query = query.whereIn('Categories.name', categories)
			}

			if (manufactures && country) {
				query = query
					.whereIn('Manufacturers.name', manufactures)
					.andWhere('Manufacturers.country', 'IN', country);
			}

		
		if (country && manufactures === undefined) {
			query = query.whereIn('Manufacturers.country', country)
		}
		
		if (manufactures && country === undefined) {
			query = query.whereIn('Manufacturers.name', manufactures)
		}
		
		if (name) {
			query = query.where('Products.name', 'like', `%${name}%`)
		}
		
		if (priceFrom) {
			console.log('hello')
			try {
				if (isNaN(Number(priceFrom))) {
					throw new Error('priceFrom is not correct')
				}
				query = query.where('price', '>=', Number(priceFrom))
			} catch {
				return res
				.status(400)
				.json({ error: 'invalid request (priceFrom is not correct)' })
			}
		}
		
		if (priceTo) {
			try {
				if (isNaN(Number(priceTo))) {
					throw new Error('priceTo is not correct')
				}
				query = query.where('price', '<=', Number(priceTo))
			} catch {
				return res
				.status(400)
				.json({ error: 'invalid request (priceTo is not correct)' })
			}
		}
		
		if (priceInDescendingOrder === 'true') {
			query = query.orderBy('price', 'desc')
		} else {
			query = query.orderBy('price', 'asc')
		}
		
		if (genders) {
			query = query.whereIn('Genders.name', genders)
		}
	}
		
		const offset = (page - 1) * pageSize
		const limit = Math.min(pageSize, 30)
		
		const productsWithImages = {}
		
		const products = await query
		.offset(offset)
			.limit(limit)
			.select('price', 'quantity', 'image_id', 'image_url')

		if (products.length < 1 && !id) {
			return res.status(404).json({ error: 'invalid request (404)' })
		}

		products.forEach(product => {
			const productId = product.id

			if (!productsWithImages[productId]) {
				productsWithImages[productId] = {
					id: product.id,
					name: product.product,
					category: product.category,
					gender: product.gender,
					manufacturer: product.manufacturer,
					country: product.country,
					price: product.price,
					quantity: product.quantity,
					images: [],
				}
			}

			if (product.image_id && product.image_url) {
				productsWithImages[productId].images.push({
					image_id: product.image_id,
					image_url: product.image_url,
				})
			}
		})

		return res.status(200).json(Object.values(productsWithImages))
	} catch (error) {
		console.error(error)
		return res.status(400).json({ error: 'invalid request' })
	}
})

router.patch('/:productId', async (req, res) => {
	let productId = req.params.productId
	const updatedProductData = req.body

	try {
		if (productId) {
			try {
				productId = Number(productId)
			} catch {
				return res.status(400).json({ message: 'Invalid request' })
			}
		} else {
			return res.status(400).json({ message: 'Invalid request' })
		}

		const {
			name,
			price,
			quantity,
			gender_name,
			category_name,
			manufacturer_name,
		} = updatedProductData

		let knexQuery = knexDB('Products').where({ product_id: productId })

		if (name) {
			knexQuery = knexQuery.update({ name })
		}
		if (price) {
			knexQuery = knexQuery.update({ price })
		}
		if (quantity) {
			knexQuery = knexQuery.update({ quantity })
		}

		if (gender_name) {
			// получаем ID категории по названию
			const genderIdResult = await knexDB('Genders')
				.select('gender_id')
				.where('name', gender_name)
				.first()
			const gender = genderIdResult ? genderIdResult.gender_id : null
			knexQuery = knexQuery.update({ gender })
		}

		if (category_name) {
			const categoryIdResult = await knexDB('Categories')
				.select('category_id')
				.where('name', category_name)
				.first()
			const category_id = categoryIdResult ? categoryIdResult.category_id : null
			knexQuery = knexQuery.update({ category_id })
		}
		if (manufacturer_name) {
			const manufacturerIdResult = await knexDB('Manufacturers')
				.select('manufacturer_id')
				.where('name', manufacturer_name)
				.first()
			const manufacturer_id = manufacturerIdResult
				? manufacturerIdResult.manufacturer_id
				: null
			knexQuery = knexQuery.update({ manufacturer_id })
		}

		const result = await knexQuery

		if (result > 0) {
			return res.status(201).json({ message: 'done' })
		} else {
			return res.status(404).json({ error: 'product not found' })
		}
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: 'internal server error' })
	}
})
router.delete('/:productId?', async (req, res) => {
	const manufacturerName = req.query.manufacturerName
	const categoryName = req.query.categoryName
	let product_id = req.params.productId

	if (product_id) {
		try {
			product_id = Number(product_id)
			const knexQuery = await knexDB('Products')
				.where({ product_id }) // {} объект с ключом product_id и значение этого ключа будет = значению переменной product_id
				.del() // del() возвращает количество удаленных записей.

			// console.log(knexQuery)

			if (knexQuery > 0) {
				return res.status(202).json({ message: 'Deleted' })
			}
			return res.status(404).json({ error: 'Product not found' })
		} catch {
			return res.status(400).json({ message: 'Invalid request (invalid id)' })
		}
	}

	try {
		if (
			(!manufacturerName && !categoryName) ||
			(manufacturerName && categoryName)
		) {
			return res.status(400).json({ message: 'Invalid request' })
		}

		let knexQuery = knexDB('Products')

		if (manufacturerName) {
			const manufacturerIdResult = await knexDB('Manufacturers')
				.select('manufacturer_id')
				.where('name', '=', manufacturerName)
				.first()

			console.log(manufacturerIdResult)

			if (!manufacturerIdResult) {
				return res.status(404).json({ error: 'Manufacturer not found' })
			}

			const manufacturerId = manufacturerIdResult.manufacturer_id
			knexQuery = knexQuery.where({ manufacturer_id: manufacturerId })
		}

		if (categoryName) {
			const categoryIdResult = await knexDB('Categories')
				.select('category_id')
				.where('name', categoryName)
				.first()

			if (!categoryIdResult) {
				return res.status(404).json({ error: 'Category not found' })
			}

			const categoryId = categoryIdResult.category_id
			knexQuery = knexQuery.where({ category_id: categoryId })
		}

		const result = await knexQuery.del()
		console.log(knexQuery)

		if (result > 0) {
			return res.status(202).json({ message: 'done' })
		} else {
			return res
				.status(404)
				.json({ error: 'No products found for the specified criteria' })
		}
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: 'Internal server error' })
	}
})

module.exports = router
