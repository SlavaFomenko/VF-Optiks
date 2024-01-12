const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const db = require('../models/db')
const {password} = require("../config");
const adminCheckMiddleware = require('../middleware/adminCheckMiddleware')
const knexDB = require('../models/dbKnex')

router.get('/:customer_id?', adminCheckMiddleware, async (req, res) => {
    const { customer_id } = req.params;

    if (customer_id) {
        try {
            const result = await knexDB('Customers').select('*').where('customer_id', customer_id).first();

            if (!result) {
                return res.status(404).json({ error: 'customer not found' });
            }

            // Exclude password field from the response
            const { password, ...userWithoutPassword } = result;

            return res.status(200).json(userWithoutPassword);
        } catch (err) {
            console.error(err);
            return res.status(400).json({ error: 'invalid request' });
        }
    }

    let { page = 1, limit = 100, login, first_name, last_name, tel_number, role } = req.query;

    if (limit > 100) {
        limit = 100;
    }

    try {
        page = Number(page);
        limit = Number(limit);
    } catch {
        return res.status(400).json({ message: 'invalid request' });
    }

    let query = knexDB('Customers');

    if (login || first_name || last_name || tel_number || role) {
        query = query.where(function () {
            if (login) this.where('login', login);
            if (first_name) this.where('first_name', first_name);
            if (last_name) this.where('last_name', last_name);
            if (tel_number) this.where('tel_number', tel_number);
            if (role) {
                if (Array.isArray(role)) {
                    this.whereIn('role', role);
                } else {
                    this.where('role', role);
                }
            }
        });
    }

    try {
        const offset = (page - 1) * limit;

        const result = await query.limit(limit).offset(offset);

        if (result.length === 0) {
            return res.status(404).json({ error: 'no customers found' });
        }

        // убираю пароль
        const data = result.map(user => {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });

        return res.status(200).json(data);
    } catch (err) {
        console.error(err);
        return res.status(400).json({ error: 'invalid request' });
    }
});
router.post('', async (req, res) => {
    try {
      let newRole = 'user';
  
      const token = req.headers.authorization?.split(' ')[1];
  
      if (token) {
        const decodedData = jwt.verify(token, secretKey);
        req.user = decodedData;
  
        // Проверка роли в токене
        if (req.user.role === 'admin') {
          newRole = 'admin';
        }
      }
  
      const { login, first_name, last_name, password, tel_number, role } = req.body;
  
      console.log(req.body);
  
      if (!login || !first_name || !last_name || !password || !tel_number) {
        return res.status(400).json({ message: 'invalid request' });
      }
  
      if (role) {
        if (role === 'user' || role === 'admin') {
          newRole = role;
        } else {
          return res.status(400).json({ message: `invalid data '${role}'` });
        }
      }
  
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
  
      await knexDB('Customers').insert({
        login,
        first_name,
        last_name,
        password: hashedPassword,
        tel_number,
        role: newRole,
      });
  
      return res.status(200).json({ message: 'done' });
    } catch (e) {
      console.log(e);
      return res.status(401).json({ message: 'Unauthorized' });
    }
  });


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