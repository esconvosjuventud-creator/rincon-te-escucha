export const AGE_RANGES = ['12 a 14', '15 a 17', '18 a 20', '21 a 24', '25 a 29', 'Prefiero no decirlo'] as const

export const LOCATIONS = ['Trinidad', 'Ismael Cortinas', 'Andresito', 'La Casilla', 'Juan José Castro', 'Otra localidad', 'Prefiero no decirlo'] as const

export const CATEGORIES = [
  'Educación', 'Trabajo', 'Emprendimientos', 'Deportes', 'Cultura', 'Música', 'Arte',
  'Tecnología', 'Salud y bienestar', 'Medio ambiente', 'Espacios públicos', 'Recreación',
  'Vivienda', 'Movilidad', 'Actividades juveniles', 'Otro'
] as const

export const PARTICIPATION_OPTIONS = ['Sí', 'Tal vez', 'Solo quería compartir la idea'] as const

export const STATUS_LABELS = {
  new: 'Nueva',
  reviewing: 'En revisión',
  considered: 'Considerada',
  implemented: 'Implementada',
  archived: 'Archivada',
} as const

export const RESOURCE_CATEGORIES = [
  { name: 'ESTUDIO', icon: 'BookOpen', blurb: 'Organizate, prepará exámenes y descubrí opciones para seguir estudiando.' },
  { name: 'PRIMER EMPLEO', icon: 'BriefcaseBusiness', blurb: 'CV, entrevistas, búsqueda laboral y primeros pasos en el mundo del trabajo.' },
  { name: 'DINERO', icon: 'WalletCards', blurb: 'Presupuesto, ahorro, crédito y decisiones financieras para la vida cotidiana.' },
  { name: 'BIENESTAR', icon: 'HeartHandshake', blurb: 'Herramientas generales para hablar, pedir apoyo y acompañar a otras personas.' },
  { name: 'PARTICIPACIÓN', icon: 'UsersRound', blurb: 'Transformá una idea en una propuesta y sumate a tu comunidad.' },
  { name: 'TECNOLOGÍA', icon: 'Laptop', blurb: 'Privacidad, seguridad digital, herramientas de estudio e IA responsable.' },
  { name: 'EMPRENDER', icon: 'Rocket', blurb: 'De una idea a un proyecto: validación, costos y primeros pasos.' },
] as const

export const WELLBEING_NOTICE = 'Rincón Te Escucha es un espacio de participación y orientación juvenil. No sustituye servicios profesionales o de emergencia.'
