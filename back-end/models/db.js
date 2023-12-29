const db = require("mysql2");

const connection = db.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'FomenkoViacheslav909011',
    database: 'OSO',
});

connection.connect((err) => {
    if (err) {
        console.error('Ошибка подключения к базе данных:', err);
    } else {
        console.log('Подключение к базе данных успешно');
    }
});

module.exports = connection