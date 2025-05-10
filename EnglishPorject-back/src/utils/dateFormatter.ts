export const formatDate = (dateString: string, locale: string): string => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        return "Fecha no válida"; // O "Invalid date" si prefieres
    }
    return date.toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};
  