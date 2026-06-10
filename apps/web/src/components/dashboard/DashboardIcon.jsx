// Minimal icon set for the dashboard
export default function DashboardIcon({ name, className, style }) {
  const paths = {
    sun:      <g><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.4M12 19.1v2.4M21.5 12h-2.4M4.9 12H2.5M18.7 5.3l-1.7 1.7M7 17l-1.7 1.7M18.7 18.7L17 17M7 7L5.3 5.3"/></g>,
    calendar: <g><rect x="3.5" y="4.8" width="17" height="15.5" rx="2.6"/><path d="M3.5 9h17M8 3v3.4M16 3v3.4"/><circle cx="12" cy="14" r="1.2" fill="currentColor" stroke="none"/></g>,
    infinity: <path d="M6.5 9c-2 0-3.3 1.4-3.3 3s1.3 3 3.3 3c2.6 0 3.4-3 5.5-3s2.9 3 5.5 3c2 0 3.3-1.4 3.3-3s-1.3-3-3.3-3c-2.6 0-3.4 3-5.5 3S9.1 9 6.5 9Z"/>,
    clock:    <g><circle cx="12" cy="12" r="8.4"/><path d="M12 7.5V12l3 2"/></g>,
    scroll:   <g><path d="M6 3.5h11a2 2 0 0 1 2 2V18a2.5 2.5 0 0 0 2.5 2.5H8.5"/><path d="M6 3.5a2 2 0 0 0-2 2V17a2.5 2.5 0 0 0 2.5 2.5"/><path d="M9 8h7M9 11.5h7M9 15h4"/></g>,
    close:    <path d="M6 6l12 12M18 6L6 18"/>,
    menu:     <path d="M3.5 7h17M3.5 12h17M3.5 17h17"/>,
    eye:      <g><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="2.8"/></g>,
    trash:    <g><path d="M4.5 6.5h15M9 6.5V4.8a1.3 1.3 0 0 1 1.3-1.3h3.4A1.3 1.3 0 0 1 15 4.8v1.7M6.5 6.5l.9 12.3a2 2 0 0 0 2 1.9h5.2a2 2 0 0 0 2-1.9l.9-12.3"/></g>,
    plus:     <path d="M12 5v14M5 12h14"/>,
    lock:     <g><rect x="4.8" y="10.5" width="14.4" height="10" rx="2.4"/><path d="M8 10.5V7.6a4 4 0 0 1 8 0v2.9"/></g>,
    spark:    <path d="M12 3l1.6 6.4L20 11l-6.4 1.6L12 19l-1.6-6.4L4 11l6.4-1.6L12 3Z"/>,
    check:    <path d="M5 12.5l4.5 4.5L19 7"/>,
    arrow:    <path d="M5 12h14M13 6l6 6-6 6"/>,
    alert:    <g><path d="M12 8v5M12 16.5v.2"/><path d="M10.3 3.9 2.6 17.4A2 2 0 0 0 4.3 20.4h15.4a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/></g>,
    users:    <g><circle cx="9" cy="8.5" r="3.2"/><path d="M3.5 19.5a5.5 5.5 0 0 1 11 0M16 5.6a3.2 3.2 0 0 1 0 5.8M16.5 19.5a5.5 5.5 0 0 0-2-4.3"/></g>,
    tennis:   <g><circle cx="12" cy="12" r="8.5"/><path d="M5 5c3.5 2.4 3.5 11.6 0 14M19 5c-3.5 2.4-3.5 11.6 0 14"/></g>,
    heart:    <path d="M12 20s-7-4.4-9.2-9C1.3 7.7 3 4.5 6.2 4.5c2 0 3.2 1.2 3.8 2.3C10.6 5.7 11.8 4.5 13.8 4.5 17 4.5 18.7 7.7 17.2 11 15 15.6 12 20 12 20Z"/>,
    logout:   <g><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></g>,
    globe:    <g><circle cx="12" cy="12" r="8.5"/><path d="M12 3.5c-2.5 2.8-3.8 5.5-3.8 8.5s1.3 5.7 3.8 8.5M12 3.5c2.5 2.8 3.8 5.5 3.8 8.5s-1.3 5.7-3.8 8.5M3.5 12h17"/></g>,
    settings: <g><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/></g>,
  };
  const content = paths[name];
  if (!content) return null;
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {content}
    </svg>
  );
}
