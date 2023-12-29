const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const db = require('../models/db')


router.get('',(req, res)=>{
    const { login, password } = req.body;


    if(!login || !password){
        return res.status(400).json({message:'invalid request'});
    }

    const sqlQuery = 'SELECT * FROM Customers WHERE login = ?'
    db.query(sqlQuery,[login], async (err, results) => {

            if(err){
                console.log(err)
                return res.status(500).json({message:'server error'});
            }
            if(results){

                // проверкаесть ли бд уже такой пользователь
                if (results.length === 0) {
                    return res.status(401).json({message:'invalid user name or password'});
                }

                const user = results[0];

                //сравнивание хешей
                const match = await bcrypt.compare(password, user.password);

                if (match) {
                    return res.status(200).json(user);
                } else {
                    return res.status(401).json({message:'invalid user name or password'});
                }
            }

        }
    );
})

module.exports = router