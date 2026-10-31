require('dotenv').config();
const pool = require('../config/db');

async function check() {
    try {
        const res = await pool.query("SELECT key, value FROM website_cms WHERE key = 'headmaster'");
        console.log("HEADMASTER:", JSON.stringify(res.rows[0]?.value, null, 2));
    } catch (e) {
        console.error(e);
    } finally {
        pool.end();
    }
}
check();
