const { Client } = require('pg');

const client = new Client({
  host: '127.0.0.1',
  port: 5432,
  user: 'admin',
  password: 'admin123',
  database: 'lengua_inga',
});

client.connect()
  .then(() => {
    console.log('✅ Conexión exitosa');
    return client.query('SELECT version()');
  })
  .then(result => {
    console.log('PostgreSQL version:', result.rows[0].version);
    return client.end();
  })
  .catch(err => {
    console.error('❌ Error de conexión:', err.message);
    console.error('Detalles:', err);
  });