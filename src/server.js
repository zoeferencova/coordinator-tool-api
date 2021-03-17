require('dotenv').config();

const knex = require('knex')
const app = require('./app');
const { PORT, DATABASE_URL } = require('./config');

const db = knex({
    client: 'pg',
    connection: DATABASE_URL + "?ssl=true?debug=true",
    ssl: { rejectUnauthorized: false }
})

app.set('db', db)

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
})