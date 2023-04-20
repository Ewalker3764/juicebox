const { Client } = require('pg'); 

async function getAllUsers() {
    const { rows } = await client.query(
        `SELECT id, username
        FROM users;
        `);
        return rows;
}
async function createUser({ username, password }) {
    try {
      const { rows:[user] } = await client.query(`
        INSERT INTO users(username, password)
        VALUES ($1, $2)
        ON CONFLICT (username) DO NOTHING 
        RETURNING *;
      `, [username, password]);
  
      return user;
    } catch (error) {
      throw error;
    }
  }

const client = new Client('postgres://localhost:5432/juicebox-dev');

module.exports = {
  client,
  getAllUsers,
  createUser,
}