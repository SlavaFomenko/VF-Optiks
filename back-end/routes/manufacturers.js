const express = require('express')
const router = express.Router()
const db = require('../models/db')


router.get('/:manufacturer_id?', (req, res) => {
    const { manufacturer_id} = req.params;

    if (manufacturer_id) {
        db.query('SELECT * FROM Manufacturers WHERE manufacturer_id = ?', [manufacturer_id], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(400).json({error: 'invalid request'});
            }
            if (result.length === 0) {
                return res.status(404).json({error: 'manufacruter not found'});
            }
            return res.status(200).json(result);
        });

        return;
    }


    if (Object.entries(req.query).length === 0) {
        db.query('SELECT * FROM Manufacturers', (err, result) => {
            if (err) {
                console.error(err);
                return res.status(400).json({ error: 'invalid request' });
            }
            if (result.length === 0) {
                return res.status(404).json({ error: 'invalid request' });
            }
            return res.status(200).json(result);
        });
        return;
    }
    const { name, country } = req.query;

    let sqlQuery = 'SELECT * FROM Manufacturers WHERE';
    const queryParams = [];

    if (name) {
        sqlQuery += " name = ? AND";
        queryParams.push(name);
    }

    if (country) {
        sqlQuery += " country = ? AND";
        queryParams.push(country);
    }

    sqlQuery = sqlQuery.replace(/AND$/, '');

    db.query(sqlQuery, queryParams, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(400).json({ error: 'invalid request' });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: 'no manufacturers found' });
        }
        return res.status(200).json(result);
    });
});
router.delete('',(req, res)=>{
    const { manufacturer_id } = req.body;

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
router.post('',(req, res)=>{
    const {name,country} = req.body
    if(name && country){
        const sqlQuery = "INSERT INTO Manufacturers (name, country) VALUE (?,?)"
        db.query(sqlQuery,[name,country],(err)=>{
            if(err){
                if(err.code === 'ER_DUP_ENTRY'){
                    return res.status(409).json({message:`Category with name '${name}' already exists`})
                }
                return res.status(400).json({message:`invalid request`})
            }
            return res.status(200).json({message: "done"})
        })
    } else {
        res.status(400).json({message : 'invalid request'})
    }
})
router.patch('/:manufacturer_id?',(req, res)=>{
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

            db.query(sqlQuery, updateParams, (err, result) => {
                if (err) {
                        console.log('hello')
                    if(err.code === 'ER_DUP_ENTRY'){
                        return res.status(409).json({ message: 'invalid request duplicate data' });
                    }
                    return res.status(400).json({ message: 'invalid request' });
                }
                if(result.affectedRows >= 1){
                    return res.status(200).json({message:"done"});
                }else {
                    return res.status(400).json({ message: 'invalid request' });
                }
            })

        }
})
module.exports = router