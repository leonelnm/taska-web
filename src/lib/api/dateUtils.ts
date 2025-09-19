import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import 'dayjs/locale/es';

dayjs.extend(weekday);
dayjs.locale('es');

export function now(): dayjs.Dayjs {
  return dayjs();
}

export function getDate(fecha: string | undefined): dayjs.Dayjs {
  if (fecha === undefined) {
    return dayjs();
  }
  return dayjs(fecha);
}

// Función para obtener los 7 días de la semana ordenados de lunes a domingo
export function obtenerSemana(fecha: dayjs.Dayjs): dayjs.Dayjs[] {
  const lunes = fecha.day() === 0
    ? fecha.subtract(6, 'day') // Si es domingo, retrocede 6 días
    : fecha.subtract(fecha.day() - 1, 'day'); // Retrocede hasta el lunes

  return Array.from({ length: 7 }, (_, i) => lunes.add(i, 'day'));
}

export function formatDayName(dia: dayjs.Dayjs) {
  const dayNames = {
    0: 'Dom',  // domingo
    1: 'Lun',  // lunes
    2: 'Mar',  // martes
    3: 'Mié',  // miércoles
    4: 'Jue',  // jueves
    5: 'Vie',  // viernes
    6: 'Sáb'   // sábado
  };
  return dayNames[dia.day() as keyof typeof dayNames];
};