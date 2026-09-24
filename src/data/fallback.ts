import type { FaqItem, Resource, Tip } from '../types'

export const fallbackTips: Tip[] = [
  { id: 'tip-1', text: 'No necesitás tener todo resuelto para empezar. A veces el primer paso es simplemente preguntar.', published: true, display_order: 1 },
  { id: 'tip-2', text: 'Una idea mejora cuando la compartís: anotala, contala y preguntá qué necesitaría para hacerse realidad.', published: true, display_order: 2 },
  { id: 'tip-3', text: 'Antes de una entrevista, practicá cómo contar quién sos, qué sabés hacer y qué querés aprender.', published: true, display_order: 3 },
]

export const fallbackFaq: FaqItem[] = [
  { id: 'faq-1', question: '¿Tengo que poner mi nombre?', answer: 'No. Podés compartir una propuesta de forma anónima.', published: true, display_order: 1 },
  { id: 'faq-2', question: '¿Quién recibe mi propuesta?', answer: 'El equipo de la Oficina de la Juventud de la Intendencia Departamental de Flores.', published: true, display_order: 2 },
  { id: 'faq-3', question: '¿Todas las ideas se realizan?', answer: 'Las propuestas sirven como insumo para conocer necesidades, intereses y oportunidades. Su envío no implica automáticamente su ejecución.', published: true, display_order: 3 },
  { id: 'faq-4', question: '¿Puedo enviar más de una idea?', answer: 'Sí. Podés volver a participar cada vez que quieras compartir una propuesta diferente.', published: true, display_order: 4 },
  { id: 'faq-5', question: '¿Puedo acercarme personalmente?', answer: 'Sí. Rincón Te Escucha también busca generar espacios presenciales de encuentro.', published: true, display_order: 5 },
  { id: 'faq-6', question: '¿Esto tiene algún costo?', answer: 'No.', published: true, display_order: 6 },
]

export const fallbackResources: Resource[] = [
  {
    id: 'resource-study', title: 'Organizá tu estudio sin complicarte', slug: 'organiza-tu-estudio', category: 'ESTUDIO',
    summary: 'Una guía corta para ordenar tareas, tiempos y prioridades.', icon: 'BookOpen', published: true, display_order: 1,
    content: '1. Anotá todo lo que tenés pendiente.\n2. Elegí tres prioridades reales para hoy.\n3. Trabajá en bloques cortos y descansá.\n4. Separá lo urgente de lo importante.\n5. Al terminar, dejá definido el primer paso de mañana.\n\nTIP: empezar por 15 minutos suele ser más fácil que esperar a tener ganas.'
  },
  {
    id: 'resource-cv', title: 'Tu primer CV', slug: 'tu-primer-cv', category: 'PRIMER EMPLEO',
    summary: 'Qué poner cuando todavía tenés poca experiencia laboral.', icon: 'BriefcaseBusiness', published: true, display_order: 2,
    content: 'Incluí datos de contacto claros, estudios, cursos, habilidades y experiencias aunque no hayan sido empleos formales. Podés sumar voluntariados, proyectos, deportes o actividades donde hayas asumido responsabilidades.\n\nTIP: adaptá tu CV al puesto y mantenelo breve y fácil de leer.'
  },
  {
    id: 'resource-money', title: 'Presupuesto en 10 minutos', slug: 'presupuesto-en-10-minutos', category: 'DINERO',
    summary: 'Una forma simple de saber cuánto entra, cuánto sale y qué podés guardar.', icon: 'WalletCards', published: true, display_order: 3,
    content: 'Anotá tus ingresos del mes. Después separá gastos fijos, gastos variables y ahorro. Mirá qué gastos podés anticipar y evitá comprometer dinero que todavía no tenés.\n\nTIP: un monto pequeño ahorrado con constancia también cuenta.'
  },
  {
    id: 'resource-wellbeing', title: 'Cómo empezar una conversación difícil', slug: 'empezar-una-conversacion', category: 'BIENESTAR',
    summary: 'Ideas generales para pedir apoyo o acompañar a alguien.', icon: 'HeartHandshake', published: true, display_order: 4,
    content: 'Buscá un momento tranquilo y una persona de confianza. Podés empezar con algo simple: “Necesito hablar de algo que me está pasando”. Escuchar sin juzgar también puede ayudar a otra persona a sentirse acompañada.\n\nSi una situación necesita atención profesional o urgente, buscá servicios especializados o de emergencia.'
  },
  {
    id: 'resource-participation', title: 'De una idea a una propuesta', slug: 'idea-a-propuesta', category: 'PARTICIPACIÓN',
    summary: 'Cuatro preguntas para convertir una inquietud en algo concreto.', icon: 'UsersRound', published: true, display_order: 5,
    content: 'Preguntate: ¿qué quiero cambiar?, ¿a quiénes beneficiaría?, ¿qué necesito para empezar? y ¿quién podría sumarse? Después escribí una primera versión corta y compartila.\n\nTIP: una buena propuesta puede empezar con un problema muy cotidiano.'
  },
  {
    id: 'resource-tech', title: 'Cuidá tu privacidad digital', slug: 'privacidad-digital', category: 'TECNOLOGÍA',
    summary: 'Pequeños hábitos que mejoran tu seguridad en redes y aplicaciones.', icon: 'Laptop', published: true, display_order: 6,
    content: 'Usá contraseñas diferentes, activá la verificación en dos pasos cuando esté disponible y revisá qué información compartís públicamente. Antes de instalar una app, mirá qué permisos pide.\n\nTIP: si un mensaje te apura para que entregues datos o códigos, frená y verificá.'
  },
  {
    id: 'resource-business', title: 'Probá tu idea antes de gastar', slug: 'validar-una-idea', category: 'EMPRENDER',
    summary: 'Cómo validar una idea con preguntas y pruebas pequeñas.', icon: 'Rocket', published: true, display_order: 7,
    content: 'Contale tu idea a personas que podrían usarla. Preguntá qué problema resuelve, qué valoran y qué cambiarían. Probá una versión pequeña antes de invertir demasiado.\n\nTIP: validar no es buscar que te digan “está buena”, sino aprender qué necesita mejorar.'
  },
]
