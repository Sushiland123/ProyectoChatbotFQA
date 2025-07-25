const axios = require('axios');

async function testTicketEndpoints() {
  console.log('=== Probando endpoints de tickets ===\n');
  
  try {
    // Test 1: Verificar que el chatbot-service esté corriendo
    console.log('1. Probando si chatbot-service está corriendo...');
    const healthCheck = await axios.get('http://localhost:3003');
    console.log('✅ Chatbot-service está corriendo\n');
  } catch (error) {
    console.log('❌ Chatbot-service NO está corriendo');
    console.log('Error:', error.message);
    return;
  }
  
  try {
    // Test 2: Probar endpoint GET tickets
    console.log('2. Probando GET /tickets...');
    const getTickets = await axios.get('http://localhost:3003/tickets', {
      headers: { 'x-user-role': 'ADMIN' }
    });
    console.log('✅ GET /tickets funciona');
    console.log('Tickets encontrados:', getTickets.data.length || 'No hay datos');
    console.log();
  } catch (error) {
    console.log('❌ GET /tickets falló');
    console.log('Status:', error.response?.status);
    console.log('Error:', error.response?.data || error.message);
    console.log();
  }
  
  try {
    // Test 3: Probar endpoint PUT status
    console.log('3. Probando PUT /tickets/5/status...');
    const updateStatus = await axios.put('http://localhost:3003/tickets/5/status', 
      { estado: 'EN_PROCESO' },
      { headers: { 'x-user-role': 'ADMIN', 'Content-Type': 'application/json' } }
    );
    console.log('✅ PUT /tickets/5/status funciona');
    console.log('Respuesta:', updateStatus.data);
  } catch (error) {
    console.log('❌ PUT /tickets/5/status falló');
    console.log('Status:', error.response?.status);
    console.log('Error:', error.response?.data || error.message);
  }
}

testTicketEndpoints();
