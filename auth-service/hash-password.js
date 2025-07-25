const bcrypt = require('bcrypt');

async function hashPassword() {
  const password = 'SUSHI';
  const hashedPassword = await bcrypt.hash(password, 10);
  
  console.log('Password original:', password);
  console.log('Password hasheado:', hashedPassword);
  console.log('\n--- SQL para actualizar ---');
  console.log(`UPDATE "Usuario" SET password = '${hashedPassword}' WHERE email = 'rentacar176@gmail.com';`);
}

hashPassword();
