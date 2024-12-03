import { toast } from 'react-toastify';
import Pusher from '../lib/pusher';
import prisma from '../lib/prisma'; 
import { getViaturaAndUserCoordinates, getRoute } from '../utils/osrmService';
import { fetchFromAPI } from './fetchRouteId'; 

export async function fetchRouteData(userId) {
    if (!userId) {
      throw new Error("ID do usuário é obrigatório para buscar dados da rota");
    }
  
    try {
      const userData = await fetchFromAPI(`/api/users/${userId}`);
      if (!userData || !userData.viatura) {
        throw new Error("Viatura não encontrada para o usuário.");
      }
  
      const { viatura } = userData;
      const { id: idViatura } = viatura;
  
      const { viaturaCoordinates, userCoordinates } = await getViaturaAndUserCoordinates(idViatura, userId);
  
      if (!viaturaCoordinates || !userCoordinates) {
        throw new Error("Coordenadas ausentes para traçar a rota.");
      }
  
      const route = await getRoute(viaturaCoordinates, userCoordinates);
      return route;
    } catch (error) {
      console.error("Erro ao buscar os dados de rota:", error);
      toast.error("Erro ao buscar os dados de rota.");
      return null;
    }
  }