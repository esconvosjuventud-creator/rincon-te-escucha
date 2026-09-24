insert into public.rte_tips (text, published, display_order) values
('No necesitás tener todo resuelto para empezar. A veces el primer paso es simplemente preguntar.', true, 1),
('Una idea mejora cuando la compartís: anotala, contala y preguntá qué necesitaría para hacerse realidad.', true, 2),
('Antes de una entrevista, practicá cómo contar quién sos, qué sabés hacer y qué querés aprender.', true, 3),
('Si algo te interesa, buscá un primer paso pequeño que puedas hacer esta semana.', true, 4)
on conflict (text) do update set published = excluded.published, display_order = excluded.display_order;

insert into public.rte_faq (question, answer, published, display_order) values
('¿Tengo que poner mi nombre?', 'No. Podés compartir una propuesta de forma anónima.', true, 1),
('¿Quién recibe mi propuesta?', 'El equipo de la Oficina de la Juventud de la Intendencia Departamental de Flores.', true, 2),
('¿Todas las ideas se realizan?', 'Las propuestas sirven como insumo para conocer necesidades, intereses y oportunidades. Su envío no implica automáticamente su ejecución.', true, 3),
('¿Puedo enviar más de una idea?', 'Sí. Podés volver a participar cada vez que quieras compartir una propuesta diferente.', true, 4),
('¿Puedo acercarme personalmente?', 'Sí. Rincón Te Escucha también busca generar espacios presenciales de encuentro.', true, 5),
('¿Esto tiene algún costo?', 'No.', true, 6)
on conflict (question) do update set answer = excluded.answer, published = excluded.published, display_order = excluded.display_order;

insert into public.rte_resources (title, slug, category, summary, content, icon, published, display_order) values
('Organizá tu estudio sin complicarte', 'organiza-tu-estudio', 'ESTUDIO', 'Una guía corta para ordenar tareas, tiempos y prioridades.', E'1. Anotá todo lo que tenés pendiente.\n2. Elegí tres prioridades reales para hoy.\n3. Trabajá en bloques cortos y descansá.\n4. Separá lo urgente de lo importante.\n5. Al terminar, dejá definido el primer paso de mañana.\n\nTIP: empezar por 15 minutos suele ser más fácil que esperar a tener ganas.', 'BookOpen', true, 1),
('Tu primer CV', 'tu-primer-cv', 'PRIMER EMPLEO', 'Qué poner cuando todavía tenés poca experiencia laboral.', E'Incluí datos de contacto claros, estudios, cursos, habilidades y experiencias aunque no hayan sido empleos formales. Podés sumar voluntariados, proyectos, deportes o actividades donde hayas asumido responsabilidades.\n\nTIP: adaptá tu CV al puesto y mantenelo breve y fácil de leer.', 'BriefcaseBusiness', true, 2),
('Presupuesto en 10 minutos', 'presupuesto-en-10-minutos', 'DINERO', 'Una forma simple de saber cuánto entra, cuánto sale y qué podés guardar.', E'Anotá tus ingresos del mes. Después separá gastos fijos, gastos variables y ahorro. Mirá qué gastos podés anticipar y evitá comprometer dinero que todavía no tenés.\n\nTIP: un monto pequeño ahorrado con constancia también cuenta.', 'WalletCards', true, 3),
('Cómo empezar una conversación difícil', 'empezar-una-conversacion', 'BIENESTAR', 'Ideas generales para pedir apoyo o acompañar a alguien.', E'Buscá un momento tranquilo y una persona de confianza. Podés empezar con algo simple: “Necesito hablar de algo que me está pasando”. Escuchar sin juzgar también puede ayudar a otra persona a sentirse acompañada.\n\nSi una situación necesita atención profesional o urgente, buscá servicios especializados o de emergencia.', 'HeartHandshake', true, 4),
('De una idea a una propuesta', 'idea-a-propuesta', 'PARTICIPACIÓN', 'Cuatro preguntas para convertir una inquietud en algo concreto.', E'Preguntate: ¿qué quiero cambiar?, ¿a quiénes beneficiaría?, ¿qué necesito para empezar? y ¿quién podría sumarse? Después escribí una primera versión corta y compartila.\n\nTIP: una buena propuesta puede empezar con un problema muy cotidiano.', 'UsersRound', true, 5),
('Cuidá tu privacidad digital', 'privacidad-digital', 'TECNOLOGÍA', 'Pequeños hábitos que mejoran tu seguridad en redes y aplicaciones.', E'Usá contraseñas diferentes, activá la verificación en dos pasos cuando esté disponible y revisá qué información compartís públicamente. Antes de instalar una app, mirá qué permisos pide.\n\nTIP: si un mensaje te apura para que entregues datos o códigos, frená y verificá.', 'Laptop', true, 6),
('Probá tu idea antes de gastar', 'validar-una-idea', 'EMPRENDER', 'Cómo validar una idea con preguntas y pruebas pequeñas.', E'Contale tu idea a personas que podrían usarla. Preguntá qué problema resuelve, qué valoran y qué cambiarían. Probá una versión pequeña antes de invertir demasiado.\n\nTIP: validar no es buscar que te digan “está buena”, sino aprender qué necesita mejorar.', 'Rocket', true, 7)
on conflict (slug) do update set
  title = excluded.title,
  category = excluded.category,
  summary = excluded.summary,
  content = excluded.content,
  icon = excluded.icon,
  published = excluded.published,
  display_order = excluded.display_order;

insert into public.rte_site_settings (key, label, value, is_public) values
('location', 'Ubicación', '', true),
('hours', 'Horarios', '', true),
('whatsapp', 'WhatsApp', '', true),
('email', 'Email', '', true),
('instagram', 'Instagram', '', true)
on conflict (key) do nothing;
