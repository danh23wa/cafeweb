// Trong startServer
const pool = await sql.connect(config);
console.log('Connected to SQL Server');

// Cấu hình Passport cho Google
require('./passport')(pool, app);

// Cấu hình Passport cho GitHub riêng
require('./githubPassport')(pool, app);