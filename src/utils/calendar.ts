import { SavedEvent, TMEvent } from '../types';

/**
 * Utility to generate Google Calendar URL and downloadable .ics calendar files
 */

export function generateGoogleCalendarUrl(event: SavedEvent | TMEvent): string {
  const eventName = 'name' in event ? event.name : event.eventName;
  const title = encodeURIComponent(eventName);
  const location = 'venues' in event 
    ? encodeURIComponent(`${event.venues[0]?.name || ''}, ${event.venues[0]?.city || ''}, ${event.venues[0]?.state || ''}`)
    : encodeURIComponent(`${event.venueName}, ${event.city}, ${event.state}`);

  const ticketUrl = 'url' in event ? event.url : event.ticketUrl;
  const venueName = 'venues' in event ? event.venues[0]?.name : event.venueName;

  const details = encodeURIComponent(
    `Concert & Festival Finder Event\n\nOfficial Tickets: ${ticketUrl}\n\nVenue: ${venueName}`
  );

  // Format date for Google Calendar (YYYYMMDDTHHMMSSZ)
  const startIso = 'startDateTime' in event && event.startDateTime 
    ? new Date(event.startDateTime).toISOString().replace(/-|:|\.\d\d\d/g, '')
    : 'dates' in event
      ? new Date(event.dates.startDate).toISOString().replace(/-|:|\.\d\d\d/g, '')
      : new Date(event.date).toISOString().replace(/-|:|\.\d\d\d/g, '');

  // Default end time to 3 hours later
  const startDateObj = 'startDateTime' in event && event.startDateTime ? new Date(event.startDateTime) : new Date(('date' in event ? event.date : event.dates.startDate));
  const endDateObj = new Date(startDateObj.getTime() + 3 * 60 * 60 * 1000);
  const endIso = endDateObj.toISOString().replace(/-|:|\.\d\d\d/g, '');

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startIso}/${endIso}&details=${details}&location=${location}`;
}

export function downloadIcsFile(event: SavedEvent | TMEvent): void {
  const title = 'name' in event ? event.name : event.eventName;
  const venue = 'venues' in event ? event.venues[0]?.name : event.venueName;
  const city = 'venues' in event ? event.venues[0]?.city : event.city;
  const state = 'venues' in event ? event.venues[0]?.state : event.state;
  const ticketUrl = 'url' in event ? event.url : event.ticketUrl;

  const startIso = 'startDateTime' in event && event.startDateTime 
    ? new Date(event.startDateTime).toISOString().replace(/-|:|\.\d\d\d/g, '')
    : new Date(('date' in event ? event.date : event.dates.startDate)).toISOString().replace(/-|:|\.\d\d\d/g, '');

  const startDateObj = 'startDateTime' in event && event.startDateTime ? new Date(event.startDateTime) : new Date(('date' in event ? event.date : event.dates.startDate));
  const endDateObj = new Date(startDateObj.getTime() + 3 * 60 * 60 * 1000);
  const endIso = endDateObj.toISOString().replace(/-|:|\.\d\d\d/g, '');

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Concert & Festival Finder//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `SUMMARY:${title}`,
    `DESCRIPTION:Live concert discovered on Concert & Festival Finder. Tickets: ${ticketUrl}`,
    `LOCATION:${venue || 'TBA'}, ${city || ''} ${state || ''}`,
    `DTSTART:${startIso}`,
    `DTEND:${endIso}`,
    `URL:${ticketUrl}`,
    `STATUS:CONFIRMED`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
