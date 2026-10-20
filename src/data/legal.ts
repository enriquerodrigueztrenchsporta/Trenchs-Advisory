// Datos del titular de la web (art. 10 LSSI-CE y art. 13 RGPD).
// Rellenar antes de publicar: mientras falte alguno, `npm run build` falla (ver src/layouts/Base.astro).
// Para previsualizar sin ellos: LEGAL_DRAFT=1 npm run build

import { EMAIL } from '../consts';

export const OWNER = {
  /** 'autonomo' (persona física) o 'sociedad' (S.L., S.A., etc.). */
  type: '' as '' | 'autonomo' | 'sociedad',
  /** Nombre y apellidos del autónomo o razón social completa de la sociedad. */
  name: '',
  /** NIF (autónomo) o NIF de la sociedad. */
  taxId: '',
  /** Domicilio completo: calle, número, código postal, municipio y provincia. */
  address: '',
  /** Solo sociedades: Registro Mercantil de ..., tomo, folio, hoja e inscripción. */
  registry: '',
  /** Opcional: teléfono de contacto. */
  phone: '',
  tradeName: 'Trenchs Advisory',
  email: EMAIL,
};

/** Fecha de la última revisión de los textos legales (AAAA-MM-DD). */
export const LEGAL_UPDATED = '2026-10-20';

const REQUIRED: [keyof typeof OWNER, string][] = [
  ['type', 'tipo de titular (autónomo o sociedad)'],
  ['name', 'nombre o razón social'],
  ['taxId', 'NIF'],
  ['address', 'domicilio'],
];

/** Datos obligatorios que aún faltan. */
export const MISSING_OWNER_DATA = [
  ...REQUIRED.filter(([k]) => !OWNER[k].trim()).map(([, label]) => label),
  ...(OWNER.type === 'sociedad' && !OWNER.registry.trim() ? ['datos del Registro Mercantil'] : []),
];

/** Titular para el copyright y los textos: razón social o, en borrador, el nombre comercial. */
export const holder = () => OWNER.name.trim() || OWNER.tradeName;
