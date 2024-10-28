import Pusher from 'pusher';

export const pusher = new Pusher({
  appId: '1884903',
  key: 'aa4c044f44f54ec4ab00',
  secret: '45bae8664e3f87b0b509',
  cluster: 'sa1',
  useTLS: false,
});

export const triggerEvent = (channel, event, data) => {
  pusher.trigger(channel, event, data)
    .then(() => {
      console.log(`Evento enviado: ${event} no canal: ${channel}`);
    })
    .catch((error) => {
      console.error('Erro ao enviar evento:', error);
    });
};
