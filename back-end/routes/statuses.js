const express = require('express')
const router = express.Router()
const db = require('../models/db')

router.get('/:status_id?', (req, res) => {
    const { status_id } = req.params

    if (status_id) {
        let newStatusId
        try {
            newStatusId = Number(status_id)
        } catch {
            return res.status(400).json({ message: 'invalid request' })
        }

        const sqlQuery = 'SELECT * FROM Statuses WHERE status_id = ?'

        db.query(sqlQuery, [newStatusId], (err, result) => {
            if (err) {
                console.log(err)
                return res.status(400).json({ message: "invalid request" })
            }
            if (result) {
                if (result.length === 0) {
                    return res.status(404).json({ message: "status not found" })
                }
                return res.status(200).json(result)
            }
        })
    }

    const { description } = req.body

    if (description) {
        const sqlQuery = 'SELECT * FROM Statuses WHERE description = ?'
        db.query(sqlQuery, [description], (err, result) => {
            if (err) {
                console.log(err)
                return res.status(400).json({ message: "invalid request" })
            }
            if (result) {
                console.log(result)
                if (result.length === 0) {
                    return res.status(404).json({ message: "status not found" })
                } else {
                    return res.status(200).json(result)
                }
            }
        })
        return
    }

    if(!description && !status_id){
        db.query('SELECT * FROM Statuses', (err, result) => {
            if (err) {
                console.log(err)
                return res.status(400).json({ message: "invalid request" })
            }
            return res.status(200).json(result)
        })
    }
});
router.patch('',(req,res)=>{
    const {description,newDescription} = req.body

    if(description && newDescription){
        const sqlQuery = "UPDATE Statuses SET description = ? WHERE description = ?"
        db.query(sqlQuery,[newDescription,description],(err,result)=>{
            if(err){
                console.log(err)
                if(err.code === 'ER_DUP_ENTRY'){
                    return res.status(409).json({message:`Status with name '${newDescription}' already exists`})
                }
                return res.status(400).json({message:`invalid request`})
            }

            if(result.affectedRows === 0){
                return res.status(400).json({message: "status not defined"})
            } else {
                return res.status(200).json({message: "done"})
            }
        })
    } else {
        res.status(400).json({message : 'invalid request'})
    }
})
router.post('',(req, res)=>{
    const {description}=req.body

    if(description){
        const sqlQuery = "INSERT INTO Statuses (description) VALUE (?)"
        db.query(sqlQuery,[description],(err)=>{
            if(err){
                if(err.code === 'ER_DUP_ENTRY'){
                    return res.status(409).json({message:`Description with name '${description}' already exists`})
                }
                return res.status(400).json({message:`invalid request`})
            }
            return res.status(200).json({message: "done"})
        })
    } else {
        res.status(400).json({message : 'invalid request'})
    }

})
router.delete('',(req, res)=>{
    const { description } = req.query;
    console.log(req.query)
    if (!description) {
        return res.status(400).json({ message: 'invalid request' });
    }
    const sqlQuery = 'DELETE FROM Statuses WHERE description = ?';
    db.query(sqlQuery, [description], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'internal server error' });
        }
        if (result.affectedRows >= 1) {
            return res.status(200).json({ message: 'deletion successful' });
        } else {
            return res.status(404).json({ message: 'status not found' });
        }
    });
})

module.exports = router