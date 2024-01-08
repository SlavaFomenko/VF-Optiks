const express = require('express')
const router = express.Router()
const db = require('../models/db')
const authMiddleware = require('../middleware/authMiddleware')
const knexDB = require('knex')


router.get('/:category_id?', (req, res) => {
    const { category_id } = req.params;

    if (category_id) {
        db.query('SELECT * FROM Categories WHERE category_id = ?',
            [category_id], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(400).json({error: 'invalid request'});
            }
            if (result.length === 0) {
                return res.status(404).json({error: 'category not found'});
            }
            return res.status(200).json(result);
        });

        return;
    }


    if (Object.entries(req.query).length === 0) {
        db.query('SELECT * FROM Categories', (err, result) => {
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
    const { name, description } = req.query;

    let sqlQuery = 'SELECT * FROM Categories WHERE';
    const queryParams = [];

    if (name) {
        sqlQuery += " name = ? AND";
        queryParams.push(name);
    }

    if (description) {
        sqlQuery += " description = ? AND";
        queryParams.push(description);
    }

    sqlQuery = sqlQuery.replace(/AND$/, '');

    db.query(sqlQuery, queryParams, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(400).json({ error: 'invalid request' });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: 'no categories found' });
        }
        return res.status(200).json(result);
    });
});
router.patch('/:category_id?',authMiddleware, async(req, res)=>{
    const categoryId = req.params.category_id;

    if(!categoryId){
        return res.status(400).json({message:"invalid request"})
    }

    const { name, description } = req.body;


    if (!name && !description) {
        return res.status(400).json({ error: 'invalid user request' });
    }
    let sqlQuery = 'UPDATE Categories SET ';
    const updateParams = [];

    if (name) {
        sqlQuery += 'name = ?, ';
        updateParams.push(name);
    }

    if (description !== undefined) {
        if (description === '') {
            sqlQuery += "description = '' , ";
        } else {
            sqlQuery += 'description = ?, ';
            updateParams.push(description);
        }
    }

    sqlQuery = sqlQuery.slice(0, -2);

    sqlQuery += ' WHERE category_id = ?';
    updateParams.push(categoryId);

    db.query(sqlQuery, updateParams, async (err) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ message: `Category with name '${name}' already exists` });
            }
            return res.status(400).json({ error: 'invalid request' });
        }

        // Выполнение запроса для получения обновленной записи
        const selectQuery = 'SELECT * FROM Categories WHERE category_id = ?';
        db.query(selectQuery, [categoryId], (selectErr, result) => {
            if (selectErr) {
                return res.status(500).json({ error: 'error retrieving updated record' });
            }

            // Возвращение обновленной записи
            res.status(200).json(result[0]);
        });
    });
})

router.delete('/:category_id?',authMiddleware,(req, res)=>{
    const { category_id } = req.params;

    if (category_id) {
        let sqlQuery = `DElETE FROM Categories WHERE category_id = ?`

        db.query(sqlQuery,[category_id],(err, result)=>{
            if(err){
                console.log(err)
                if(err.code === 'ER_ROW_IS_REFERENCED_2'){
                    return res.status(400).json({error:'invalid request (ON DELETE RESTRICT)',message:`${err.sqlMessage}`})
                }
                return res.status(400).json({message:'invalid request'})
            }
            if(result.affectedRows === 0){
                return res.status(404).json({message:'categories is not found'})
            }
            return res.status(200).json({message:'done'})
        })
        return;
    }

    const {name} = req.body

    if(name){
        let sqlQuery = `DElETE FROM Categories WHERE name = ?`
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
    const {name,description} = req.body
    if(name && description){
        const sqlQuery = "INSERT INTO Categories (name, description) VALUE (?,?)"
        db.query(sqlQuery,[name,description],(err)=>{
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



module.exports = router