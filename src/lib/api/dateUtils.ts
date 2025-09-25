import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import isoWeek from 'dayjs/plugin/isoWeek'
import 'dayjs/locale/es';

dayjs.extend(weekday);
dayjs.extend(isoWeek);
dayjs.locale('es');

export function now(): dayjs.Dayjs {
  return dayjs();
}

export function nowToString(): string {
  return dayjs().format('YYYY-MM-DD');
}

export function nowPlusWeekToString(weeks: number): string {
  return dayjs().add(weeks, 'week').format('YYYY-MM-DD');
}

export function getWeekInitialDayAndEndDayFromToday(): { start: string; end: string } {
  const start = now().weekday(0).format('YYYY-MM-DD'); // Lunes
  const end = now().weekday(6).format('YYYY-MM-DD');   // Domingo
  return { start, end };
}

export function nowPlusYearToString(): string {
  return dayjs().add(1, 'year').format('YYYY-MM-DD');
}

export function isBeforeToday(fecha: string | undefined): boolean {
  if (fecha === undefined) {
    return false;
  }
  return dayjs(fecha).isBefore(now(), 'day');
}

export function getDayName(fecha: string | undefined): string {
  if (fecha === undefined) {
    return '';
  }
  return formatDayNameFull(dayjs(fecha));
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

export function formatDayNameFull(dia: dayjs.Dayjs) {
  const dayNames = {
    0: 'Domingo',  // domingo
    1: 'Lunes',    // lunes
    2: 'Martes',   // martes
    3: 'Miércoles',// miércoles
    4: 'Jueves',   // jueves
    5: 'Viernes',  // viernes
    6: 'Sábado'    // sábado
  };
  return dayNames[dia.day() as keyof typeof dayNames];
}