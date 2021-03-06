const mysql = require('mysql2/promise');

async function mainData(table, key, optionalValue) {
    const db = await mysql.createConnection(
      {
        host: 'localhost',
        user: 'root',
        password: 'Julius123!',
        database: 'company_db'
      },
    );
    switch (key) {
      case "get":
        const [rows] = await db.query(table);
        return rows;
  
      case "insert":
        await db.query(table, optionalValue);
        break;
    }
  }

  module.exports = mainData;