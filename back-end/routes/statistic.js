const express = require('express')
const router = express.Router()
const knexDB = require('../models/dbKnex')

router.get('/top_users',async (req, res)=>{
    const query = knexDB.select({
        customer_id: 'c.customer_id',
        first_name: 'c.first_name',
        last_name: 'c.last_name',
        total_spent: knexDB.raw('CAST(SUM(p.price * od.quantity) AS SIGNED)'),
    })
        .from('Customers as c')
        .join('Orders as o', 'c.customer_id', '=', 'o.customer_id')
        .join('Order_details as od', 'o.order_id', '=', 'od.order_id')
        .join('Products as p', 'od.product_id', '=', 'p.product_id')
        .groupBy('c.customer_id', 'c.first_name', 'c.last_name')
        .orderBy('total_spent', 'desc');

    const sqlQuery = await query

    return res.status(200).json(sqlQuery)
})
router.get('/top_product', async (req, res)=>{

    try {
        let { page = 1, pageSize = 5 } = req.query;


        page = parseInt(page);
        pageSize = parseInt(pageSize);

        if (isNaN(page) || isNaN(pageSize) || page <= 0 || pageSize <= 0) {
            return res.status(400).json({ error: 'Invalid page or pageSize values' });
        }

        const result = await knexDB.raw('CALL GetTopSellingProductsPagination(?, ?)', [page, pageSize]);

        if (result && result.length > 0 && Array.isArray(result[0])) {
            const responseData = result[0];
            return res.status(200).json(responseData);
        } else {
            return res.status(404).json({ error: 'No data found' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
})
router.get('/date_statistic',async (req,res)=>{
    try {
        const result = await knexDB('Orders')
            .select(
                knexDB.raw('DATE(order_date) AS order_day'),
                knexDB.raw('COUNT(order_id) AS order_count'),
                knexDB.raw('GROUP_CONCAT(order_id) AS order_ids')
            )
            .groupBy('order_day')
            .orderBy('order_day');

          //на выходе
        // SELECT DATE(order_date) AS order_day, COUNT(order_id) AS order_count, GROUP_CONCAT(order_id) AS order_ids
        // FROM Orders
        // GROUP BY order_day
        // ORDER BY order_day;

        return res.status(200).json(result);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.toString() });
    }
})

module.exports = router