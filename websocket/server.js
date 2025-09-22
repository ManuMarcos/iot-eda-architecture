import { WebSocketServer } from 'ws';
import { Kafka } from 'kafkajs';

const wss = new WebSocketServer({ port: 5000 });
console.log('Servidor WebSocket escuchando en ws://localhost:5000');

const kafka = new Kafka({
  clientId: 'dashboard-app',
  brokers: ['44.223.188.196:29092'], 
});
const consumer = kafka.consumer({ groupId: 'websocket-service' });

wss.on('connection', (ws) => {
  console.log('Cliente conectado');
  ws.send('El cleinte recibe mensjaes de kafka.');

  ws.on('close', () => {
    console.log('Cliente desconectado');
  });
});


const startKafkaConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'iot-processed', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const value = message.value.toString();
      console.log(`Kafka -> ${value}`);


      wss.clients.forEach(client => {
        if (client.readyState === 1) { 
          client.send(value);
        }
      });
    },
  });
};

startKafkaConsumer().catch(console.error);
