
const { Client } = require('pg');

async function main() {
  console.log('Starting database setup...');
  
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('DATABASE_URL environment variable is not set');
    process.exit(1);
  }
  
  const client = new Client({
    connectionString: databaseUrl,
    ssl: {
      rejectUnauthorized: false
    }
  });
  
  try {
    await client.connect();
    console.log('Connected to database successfully!');
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS students (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        class TEXT NOT NULL,
        section TEXT NOT NULL,
        house TEXT NOT NULL,
        phone TEXT,
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Students table created successfully');

    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL,
        password TEXT NOT NULL
      )
    `);
    console.log('Users table created successfully');

    const adminExists = await client.query(`SELECT * FROM users WHERE username = 'admin'`);
    if (adminExists.rows.length === 0) {
      await client.query(`
        INSERT INTO users (username, password)
        VALUES ('admin', 'admin123')
      `);
      console.log('Admin user created');
    }

    console.log('Database setup completed successfully!');
  } catch (error) {
    console.error('Error setting up database:', error);
    throw error;
  } finally {
    await client.end();
  }
}

main().catch(console.error);
