import { Fetch } from '$lib/api/fetchClient';
import { Routes } from '$lib/api/routes';
import { mapTarea, getLabelFromString } from '$lib/api/utils';
import type { TareaResponse, FiltroTareaRequest, Puesto, Turno, CrearTareaRequest, TareaApp } from '../types';


export class TareasApi {
  private fetch: Fetch;

  constructor(fetchFn: typeof window.fetch) {
    this.fetch = new Fetch(fetchFn);
  }

  public async getTareas(filtro?: FiltroTareaRequest): Promise<TareaApp[]> {
    const params = new URLSearchParams();
    if (filtro) {
      Object.entries(filtro).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const queryString = params.toString();
    const url = queryString ? `${Routes.TAREAS}?${queryString}` : `${Routes.TAREAS}`;

    try {
      const data = await this.fetch.request<TareaResponse[]>(url);
      return data.map(mapTarea);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return [];
    }
  }

  public async crearTarea(request: CrearTareaRequest): Promise<TareaResponse> {
    try {
      return await this.fetch.request<TareaResponse>(Routes.TAREAS, { method: 'POST', body: JSON.stringify(request) });
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  // Repite este patrón para el resto de los métodos: completarTarea, getPuestos, getTurnos
  public async completarTarea(id: number): Promise<TareaApp> {
    const url = `${Routes.TAREAS}/${id}/completar`;
    try {
      const data = await this.fetch.request<TareaResponse>(url, { method: 'POST' });
      return mapTarea(data);
    } catch (error) {
      console.error('Error completing task:', error);
      throw error;
    }
  }

  public async getPuestos(): Promise<Puesto[]> {
    try {
      const data = await this.fetch.request<Puesto[]>(Routes.PUESTOS);
      return data.map((puesto: Puesto) => ({
        ...puesto,
        label: getLabelFromString(puesto.puesto)
      })).sort((a, b) => a.label.localeCompare(b.label));
    } catch (error) {
      console.error('Error fetching puestos:', error);
      return [];
    }
  }

  public async getTurnos(): Promise<Turno[]> {
    try {
      const data = await this.fetch.request<Turno[]>(Routes.TURNOS);
      return data.map((turno: Turno) => ({
        ...turno,
        label: getLabelFromString(turno.turno)
      })).sort((a: Turno, b: Turno) => {
        return a.turno.localeCompare(b.turno, 'es', { sensitivity: 'base' });
      });
    } catch (error) {
      console.error('Error fetching turnos:', error);
      return [];
    }
  }
}