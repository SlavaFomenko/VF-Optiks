const express = require('express')
const router = express.Router()
const db = require('../models/db')
const knex = require('../models/dbKnex')
const authMiddleware = require('../middleware/authMiddleware')
const adminCheckMiddleware = require('../middleware/adminCheckMiddleware')



router.get('/:manufacturer_id?', async (req, res) => {
    const { manufacturer_id } = req.params;

    try {
        if (manufacturer_id) {
            const result = await knex('Manufacturers').where('manufacturer_id', manufacturer_id);
            if (result.length === 0) {
                return res.status(404).json({ error: 'manufacturer not found' });
            }
            return res.status(200).json(result);
        }

        if (Object.keys(req.query).length === 0) {
            const result = await knex('Manufacturers');
            if (result.length === 0) {
                return res.status(404).json({ error: 'no manufacturers found' });
            }
            return res.status(200).json(result);
        }

        const { name, country } = req.query;

        const result = await knex('Manufacturers')
            .where(builder => {
                if (name) {
                    builder.where('name', 'like', `%${name}%`);
                }
                if (Array.isArray(country)) {
                    builder.whereIn('country', country);
                } else if (country) {
                    builder.andWhere('country', country);
                }
            });

        if (result.length === 0) {
            return res.status(404).json({ error: 'no manufacturers found' });
        }

        return res.status(200).json(result);
    } catch (err) {
        console.error(err);
        return res.status(400).json({ error: 'invalid request' });
    }
});

router.delete('/:manufacturer_id?',adminCheckMiddleware,(req, res)=>{

    // console.log(req.query);
    const { manufacturer_id } = req.params;

    // console.log('hello');

    if (manufacturer_id) {
        let newManufacturer_id
        try {
            newManufacturer_id = Number(manufacturer_id)
        } catch {
            return res.status(400).json({message:"invalid manufacturer_id"})
        }

        let sqlQuery = `DElETE FROM Manufacturers WHERE manufacturer_id = ?`

        db.query(sqlQuery,[newManufacturer_id],(err, result)=>{
            if(err){
                console.log(err)
                return res.status(400).json({message:'invalid request'})
            }

            if(result.affectedRows === 0){
                return res.status(404).json({message:'manufacturer is not found'})
            }

            return res.status(200).json({message:'done'})
        })
        return;
    }

    const {name} = req.body

    if(name){
        let sqlQuery = `DElETE FROM Manufacturers WHERE name = ?`
        db.query(sqlQuery,[name],(err, result)=> {

            if(err){
                console.log(err)
                return res.status(400).json({message:'invalid request'})
            }

            if(result.affectedRows === 0){
                return res.status(404).json({message:'categories is not found'})
            }

            return res.status(200).json({message:'done'})
        })
        return;
    }

    return res.status(400).json({message:'invalid request'})

});
router.post('',adminCheckMiddleware,(req, res)=>{
    const {name,country} = req.body

    if(name && country){
        const sqlQuery = "INSERT INTO Manufacturers (name, country) VALUE (?,?)"
        db.query(sqlQuery, [name,country], async err => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res
                        .status(409)
                        .json({ message: `Manufacturer with name '${name}' already exists` })
                }
                return res.status(400).json({ error: 'invalid request' })
            }
    
            const selectQuery = 'SELECT * FROM Manufacturers WHERE name = ?'
            db.query(selectQuery, [name], (selectErr, result) => {
                if (selectErr) {
                    return res
                        .status(500)
                        .json({ error: 'error retrieving updated record' })
                }
                res.status(200).json(result[0])
            })
        })
    } else {
        res.status(400).json({message : 'invalid request'})
    }
})
router.patch('/:manufacturer_id?',adminCheckMiddleware,(req, res)=>{
    const {manufacturer_id}=req.params
        if(manufacturer_id){
            let newManufacturer_id
            console.log(req.params)
            try {
                newManufacturer_id=Number(manufacturer_id)
            }catch {
                return res.status(400).json({message:`invalid request ${manufacturer_id}'`})
            }

            const {name,country}=req.body

            let sqlQuery='UPDATE Manufacturers SET'
            const updateParams = [];
            if (name) {
                sqlQuery += " name = ? , ";
                updateParams.push(name);

            }
            if (country) {
                sqlQuery += " country = ? , ";
                updateParams.push(country);
            }


            sqlQuery = sqlQuery.slice(0, -2);
            console.log(sqlQuery)

            sqlQuery+='WHERE manufacturer_id = ?'

            updateParams.push(newManufacturer_id)

            db.query(sqlQuery, updateParams, async err => {
                if (err) {
                    if (err.code === 'ER_DUP_ENTRY') {
                        return res
                            .status(409)
                            .json({ message: `Manufacturer with name '${name}' already exists` })
                    }
                    return res.status(400).json({ error: 'invalid request' })
                }
        
                // Выполнение запроса для получения обновленной записи
                const selectQuery = 'SELECT * FROM Manufacturers WHERE manufacturer_id = ?'
                db.query(selectQuery, [manufacturer_id], (selectErr, result) => {
                    if (selectErr) {
                        return res
                            .status(500)
                            .json({ error: 'error retrieving updated record' })
                    }
                    res.status(200).json(result[0])
                })
            })

        }
})
module.exports = router