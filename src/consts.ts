export const EMAIL = 'enriquetrenchsporta@gmail.com';

const subject = 'Solicitud de diagnóstico – sesión inicial';
const body = [
  'Hola,',
  '',
  'Me gustaría solicitar una sesión inicial.',
  '',
  'Organización:',
  'Qué nos gustaría resolver:',
  '',
  'Gracias.',
].join('\n');

export const DIAGNOSIS_MAILTO = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

/** Ruta interna con el prefijo de publicación (GitHub Pages sirve la web bajo /Trenchs-Advisory/). */
export const url = (path = '') => import.meta.env.BASE_URL.replace(/\/?$/, '/') + path.replace(/^\//, '');
