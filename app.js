var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('db/sqlite.db', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the SQlite database.');
});

//撰寫 /api/quotes 路由，使用 SQL 來查詢所有資料
app.get('/api/quotes', (req, res) => {
    const sql = 'SELECT * FROM time';
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.json({
            "message":"success",
            "data":rows
        });
    });
});

//撰寫 post /api/insert 路由，使用 SQLite 新增一筆Time資料(name,time)，回傳文字訊息，不要 json
app.post('/api/insert', (req, res) => {
    const { name, time } = req.body;
    const sql = 'INSERT INTO time (name, time) VALUES (?, ?)';
    db.run(sql, [name, time], function(err) {
        if (err) {
            return console.error(err.message);
        }
        res.send('新增成功');
    });
});

module.exports = app;
