const axios = require('axios');

async function generarDatosPrueba() {
  console.log('🎯 Generando datos de prueba para analytics...\n');
  
  const baseUrl = 'http://localhost:3000';
  const token = 'TU_ACCESS_TOKEN_AQUI'; // Reemplaza con tu token
  
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  const mensajes = [
    "Hola, necesito ayuda con mi reserva",
    "¿Cuáles son sus horarios de atención?", 
    "Tengo un problema con el pago",
    "¿Pueden cancelar mi reserva?",
    "El servicio no funciona correctamente",
    "Necesito información sobre precios",
    "Mi cuenta no se puede acceder",
    "El sistema está fallando",
    "¿Cómo puedo contactar soporte?",
    "Esto no me sirve para nada" // Esta debería escalar
  ];

  try {
    for (let i = 0; i < mensajes.length; i++) {
      const mensaje = mensajes[i];
      const sessionId = `test-session-${i + 1}`;
      
      console.log(`📤 Enviando: "${mensaje}"`);
      
      await axios.post(`${baseUrl}/chat/message`, {
        message: mensaje,
        sessionId: sessionId
      }, { headers });
      
      console.log(`✅ Interacción ${i + 1} enviada`);
      
      // Pequeña pausa entre mensajes
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log('\n🎉 ¡Datos de prueba generados!');
    console.log('💡 Ahora prueba el endpoint de analytics de nuevo:');
    console.log('GET http://localhost:3000/chat/analytics');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('💡 Asegúrate de reemplazar TU_ACCESS_TOKEN_AQUI con tu token real');
  }
}

generarDatosPrueba();
