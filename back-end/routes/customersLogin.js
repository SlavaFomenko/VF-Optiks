const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const db = require('../models/db')
const jwt = require('jsonwebtoken')
const {secretKey} = require('../config')


const generateAccessToken = (id, role) => {
    const payload = {
        id,
        role
    }
    return jwt.sign(payload,secretKey, {expiresIn:'24h'}) 
}


router.get('',(req, res)=>{

    console.log(req.query);
    const { login, password } = req.query;


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

                // проверкаесть ли в  бд уже такой пользователь
                if (results.length === 0) {
                    return res.status(404).json({message:'invalid user name or password'});
                }

                const user = results[0];

                //сравнивание хешей
                const match = await bcrypt.compare(password, user.password);

                if (match) {
                    console.dir(user);                    
                    const token = generateAccessToken(user.customer_id,user.role)
                    console.log(token);
                    const data = {
                        token:token,
                        login:user.first_name,
                        first_name:user.first_name,
                        last_name:user.last_name,
                    }

                    return res.status(200).json(data);
                } else {
                    return res.status(401).json({message:'invalid user name or password'});
                }
            }

        }
    );
})

module.exports = router