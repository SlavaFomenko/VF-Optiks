const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const db = require('../models/db')
const {password} = require("../config");

router.get('/:customer_id?', async (req, res) => {
    const { customer_id } = req.params;

    if (customer_id) {
        db.query('SELECT * FROM Customers WHERE customer_id = ?', [customer_id], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(400).json({ error: 'invalid request' });
            }
            if (result.length === 0) {
                return res.status(404).json({ error: 'customer not found' });
            }
            return res.status(200).json(result);
        });
        return;
    }


    let { page = 1, limit = 10, login, first_name, last_name, tel_number, role } = req.query;

    // console.log(first_name)

    if(limit > 100){
        limit = 100
    }

    try {
        page = Number(page)
        limit = Number(limit)
    } catch {
        return res.status(400).json({message:"invalid request"})
    }


    // const offset = (page - 1) * limit;

    let sqlQuery = 'SELECT * FROM Customers'

    if(login || first_name || last_name || tel_number || role){
        sqlQuery += ' WHERE'
    }


    const queryParams = [];

    if (login) {
        sqlQuery += " login = ? AND";
        queryParams.push(login);
    }
    if (first_name) {
        sqlQuery += " first_name = ? AND";
        queryParams.push(first_name);
    }
    if (last_name) {
        sqlQuery += " last_name = ? AND";
        queryParams.push(last_name);
    }
    if (role) {
        sqlQuery += " role = ? AND";
        queryParams.push(role);
    }
    if (tel_number) {
        sqlQuery += " tel_number = ? AND";
        queryParams.push(tel_number);
    }

    sqlQuery = sqlQuery.replace(/AND$/, '');
    // sqlQuery += ' LIMIT ? OFFSET ?';
    // queryParams.push(parseInt(limit, 10), offset);

    db.query(sqlQuery, queryParams, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(400).json({ error: 'invalid request' });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: 'no categories found' });
        }

        const data = [];
        result.forEach(user => {
            data.push({
                customer_id: user.customer_id,
                login: user.login,
                first_name: user.first_name,
                last_name: user.last_name,
                tel_number: user.tel_number,
                role: user.role
            });
        });
        

        
        
        console.log(data);

        return res.status(200).json(data);
    });
});
router.post('',async (req, res)=> {
    const {login, first_name,last_name,password,tel_number,role} = req.body;

    console.log(req.body);

    if(!login || !first_name || !last_name || !password || !tel_number ){
        return res.status(400).json({message:'invalid request'})
    }

    let newRole

    if(role){
        if(role ==='user'){
            newRole = 'user'
        } else if(role === "admin"){
            newRole = 'admin'
        } else{
            return res.status(400).json({message:`invalid data '${role}'`})
        }
    } else {
        newRole ='user'
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const sqlQuery="INSERT INTO Customers(login,first_name, last_name, password, tel_number, role) VALUE (?,?,?,?,?,?)"

    db.query(sqlQuery,[login,first_name, last_name, hashedPassword, tel_number, newRole],(err)=>{
        if(err){
            if(err.code === 'ER_DUP_ENTRY'){
                return res.status(409).json({message:"invalid request (duplicate data)"})
            }
            console.log(err)
            return res.status(400).json({message:"invalid request"})
        }
        return res.status(200).json({message:'done'})
    })
})
router.patch('/:login_id?',async (req, res)=> {
    const {login_id} = req.params
    if(!login_id){
        return res.status(400).json({massage:"invalid request"})
    }

    if(login_id){
        const {login, first_name, last_name , tel_number , role } = req.body;
        let sqlQuery = 'UPDATE Customers SET ';

        const updateParams = [];
        if (login) {
            sqlQuery += " login = ? ,";
            updateParams.push(login);
        }
        if (first_name) {
            sqlQuery += " first_name = ?,";
            updateParams.push(first_name);
        }
        if (last_name) {
            sqlQuery += " last_name = ?,";
            updateParams.push(last_name);
        }
        if (role) {
            sqlQuery += " role = ? ,";
            updateParams.push(role);
        }
        if(password){
            sqlQuery += " password = ? ,";
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            updateParams.push(hashedPassword);
        }
        if (tel_number) {
            sqlQuery += " tel_number = ? ,";
            updateParams.push(tel_number);
        }
        sqlQuery = sqlQuery.replace(/,$/, '');

        sqlQuery += ' WHERE login = ?';
        updateParams.push(login_id);


        db.query(sqlQuery, updateParams, (err, result) => {
            if (err) {
                if(err.code === 'ER_DUP_ENTRY'){
                    return res.status(409).json({ error: 'invalid request duplicate data' });
                }
                return res.status(400).json({ error: 'invalid request' });
            }
            if(result.affectedRows >= 1){
                return res.status(200).json({message:"done"});
            }
            return res.status(400).json({ message: 'invalid request' });
        });
    }

})
router.delete('/:login?', async (req, res) => {
    const { login } = req.params;

    console.log(req.params);

    if (!login) {
        return res.status(400).json({ message: 'invalid request' });
    }
    const sqlQuery = 'DELETE FROM Customers WHERE login = ?';
    db.query(sqlQuery, [login], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'internal server error' });
        }
        if (result.affectedRows >= 1) {
            return res.status(200).json({ message: 'deletion successful' });
        } else {
            return res.status(404).json({ message: 'customer not found' });
        }
    });
});

module.exports = router