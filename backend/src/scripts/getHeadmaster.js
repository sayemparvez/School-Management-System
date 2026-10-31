require('dotenv').config();
const pool = require('../config/db');

async function check() {
    try {
        const res = await pool.query("SELECT section, data FROM website_cms WHERE section = 'headmaster'");
        console.log("HEADMASTER DATA IN DB:", JSON.stringify(res.rows[0]?.data, null, 2));
    } catch (e) {
        console.error(e);
    } finally {
        pool.end();
    }
}
check();
