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

    const url = params.toString() ? `${Routes.TAREAS.BASE}?${params.toString()}` : Routes.TAREAS.BASE;

    try {
      const data = await this.fetch.request<TareaResponse[]>(url);
      return data.map(mapTarea);
    } catch (error) {
      console.error("Error fetching tareas:", error);
      return [];
    }
  }

  public async crearTarea(request: CrearTareaRequest): Promise<TareaResponse> {
    try {
      return await this.fetch.request<TareaResponse>(Routes.TAREAS.CREATE, {
        method: 'POST',
        body: JSON.stringify(request)
      });
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  // POST /tareas/{id}/completar
  public async completarTarea(id: number): Promise<TareaApp> {
    try {
      const data = await this.fetch.request<TareaResponse>(Routes.TAREAS.COMPLETE(id), {
        method: "POST",
      });
      return mapTarea(data);
    } catch (error) {
      console.error("Error completing tarea:", error);
      throw error;
    }
  }

  public async getPuestos(): Promise<Puesto[]> {
    try {
      const data = await this.fetch.request<Puesto[]>(Routes.PUESTOS.BASE);
      return data.map((puesto: Puesto) => ({
        ...puesto,
        label: getLabelFromString(puesto.puesto)
      })).sort((a, b) => this.localCompare(a.label, b.label));
    } catch (error) {
      console.error('Error fetching puestos:', error);
      return [];
    }
  }

  public async getTurnos(): Promise<Turno[]> {
    try {
      const data = await this.fetch.request<Turno[]>(Routes.TURNOS.BASE);
      return data.map((turno: Turno) => ({
        ...turno,
        label: getLabelFromString(turno.turno)
      })).sort((a, b) => this.localCompare(a.label, b.label));
    } catch (error) {
      console.error('Error fetching turnos:', error);
      return [];
    }
  }

  private localCompare(a: string, b: string): number {
    return a.localeCompare(b, 'es', { sensitivity: 'base' })
  }
}