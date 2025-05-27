export const DEPARTAMENTOS_EL_SALVADOR = [
  'Ahuachapán', 'Cabañas', 'Chalatenango', 'Cuscatlán',
  'La Libertad', 'La Paz', 'La Unión', 'Morazán',
  'San Miguel', 'San Salvador', 'San Vicente', 'Santa Ana',
  'Sonsonate', 'Usulután'
]

export const NIVELES_DOMINIO = [
  { value: 'Básico', label: 'Básico' },
  { value: 'Intermedio', label: 'Intermedio' },
  { value: 'Avanzado', label: 'Avanzado' },
  { value: 'Experto', label: 'Experto' }
]

export const TIPOS_FORMACION = [
  { value: 'Primaria', label: 'Educación Primaria' },
  { value: 'Secundaria', label: 'Educación Secundaria' },
  { value: 'Técnico', label: 'Técnico Superior' },
  { value: 'Tecnólogo', label: 'Tecnólogo' },
  { value: 'Universitario', label: 'Universitario' },
  { value: 'Postgrado', label: 'Postgrado' },
  { value: 'Maestría', label: 'Maestría' },
  { value: 'Doctorado', label: 'Doctorado' }
]

export const ESTADOS_FORMACION = [
  { value: 'En Curso', label: 'En Curso', color: 'primary' },
  { value: 'Completado', label: 'Completado', color: 'success' },
  { value: 'Suspendido', label: 'Suspendido', color: 'warning' },
  { value: 'Abandonado', label: 'Abandonado', color: 'danger' }
]

export const TIPOS_EMPLEO = [
  { value: 'Tiempo Completo', label: 'Tiempo Completo' },
  { value: 'Tiempo Parcial', label: 'Tiempo Parcial' },
  { value: 'Contrato', label: 'Por Contrato' },
  { value: 'Freelance', label: 'Freelance' },
  { value: 'Pasantía', label: 'Pasantía' },
  { value: 'Práctica', label: 'Práctica Profesional' },
  { value: 'Voluntariado', label: 'Voluntariado' }
]

export const NIVELES_PUESTO = [
  { value: 'Junior', label: 'Junior / Trainee' },
  { value: 'Mid', label: 'Intermedio' },
  { value: 'Senior', label: 'Senior' },
  { value: 'Lead', label: 'Lead / Líder' },
  { value: 'Manager', label: 'Manager / Gerente' },
  { value: 'Director', label: 'Director' },
  { value: 'VP', label: 'Vicepresidente' },
  { value: 'C-Level', label: 'C-Level (CEO, CTO, etc.)' }
]

export const SECTORES_EMPRESA = [
  { value: 'Tecnología', label: 'Tecnología / IT' },
  { value: 'Financiero', label: 'Servicios Financieros' },
  { value: 'Salud', label: 'Salud / Medicina' },
  { value: 'Educación', label: 'Educación' },
  { value: 'Manufactura', label: 'Manufactura' },
  { value: 'Retail', label: 'Comercio / Retail' },
  { value: 'Construcción', label: 'Construcción' },
  { value: 'Agricultura', label: 'Agricultura' },
  { value: 'Turismo', label: 'Turismo / Hospitalidad' },
  { value: 'Transporte', label: 'Transporte / Logística' },
  { value: 'Telecomunicaciones', label: 'Telecomunicaciones' },
  { value: 'Gobierno', label: 'Sector Público' },
  { value: 'ONG', label: 'ONG / Sin fines de lucro' },
  { value: 'Otros', label: 'Otros' }
]

// 🆕 TIPOS DE CERTIFICACIONES
export const TIPOS_CERTIFICACION = [
  { value: 'Técnica', label: 'Certificación Técnica' },
  { value: 'Profesional', label: 'Certificación Profesional' },
  { value: 'Idiomas', label: 'Certificación de Idiomas' },
  { value: 'Software', label: 'Software / Tecnología' },
  { value: 'Seguridad', label: 'Seguridad / Compliance' },
  { value: 'Gestión', label: 'Gestión / Management' },
  { value: 'Calidad', label: 'Calidad / ISO' },
  { value: 'Marketing', label: 'Marketing / Ventas' },
  { value: 'Finanzas', label: 'Finanzas / Contabilidad' },
  { value: 'Salud', label: 'Salud / Medicina' },
  { value: 'Educación', label: 'Educación / Pedagogía' },
  { value: 'Otros', label: 'Otros' }
]

// 🆕 ESTADOS DE CERTIFICACIÓN
export const ESTADOS_CERTIFICACION = [
  { value: 'En Progreso', label: 'En Progreso', color: 'info' },
  { value: 'Completado', label: 'Completado', color: 'success' },
  { value: 'Vigente', label: 'Vigente', color: 'primary' },
  { value: 'Por Vencer', label: 'Por Vencer', color: 'warning' },
  { value: 'Expirado', label: 'Expirado', color: 'danger' },
  { value: 'Suspendido', label: 'Suspendido', color: 'secondary' }
]

// 🆕 INSTITUCIONES CERTIFICADORAS POPULARES
export const INSTITUCIONES_CERTIFICACION = [
  // Tecnología - Principales
  { value: 'Microsoft', label: 'Microsoft' },
  { value: 'Google', label: 'Google' },
  { value: 'Amazon', label: 'Amazon Web Services (AWS)' },
  { value: 'Oracle', label: 'Oracle' },
  { value: 'Cisco', label: 'Cisco' },
  { value: 'Adobe', label: 'Adobe' },
  { value: 'IBM', label: 'IBM' },
  { value: 'Salesforce', label: 'Salesforce' },
  { value: 'Red Hat', label: 'Red Hat' },
  { value: 'VMware', label: 'VMware' },
  
  // Gestión de Proyectos
  { value: 'PMI', label: 'Project Management Institute (PMI)' },
  { value: 'Scrum Alliance', label: 'Scrum Alliance' },
  { value: 'PRINCE2', label: 'PRINCE2' },
  
  // Idiomas
  { value: 'Cambridge', label: 'Cambridge English' },
  { value: 'TOEFL', label: 'TOEFL' },
  { value: 'IELTS', label: 'IELTS' },
  { value: 'DELE', label: 'DELE (Español)' },
  { value: 'DELF', label: 'DELF (Francés)' },
  { value: 'Goethe', label: 'Goethe Institut (Alemán)' },
  
  // Calidad y Normas
  { value: 'ISO', label: 'ISO International' },
  { value: 'Six Sigma', label: 'Six Sigma' },
  { value: 'ASQ', label: 'American Society for Quality (ASQ)' },
  
  // Finanzas y Contabilidad
  { value: 'ACCA', label: 'ACCA (Association of Chartered Certified Accountants)' },
  { value: 'CPA', label: 'CPA (Certified Public Accountant)' },
  { value: 'CFA', label: 'CFA Institute' },
  { value: 'FRM', label: 'GARP (Financial Risk Manager)' },
  
  // Plataformas de Educación Online
  { value: 'Coursera', label: 'Coursera' },
  { value: 'Udemy', label: 'Udemy' },
  { value: 'edX', label: 'edX' },
  { value: 'LinkedIn', label: 'LinkedIn Learning' },
  { value: 'Platzi', label: 'Platzi' },
  { value: 'Udacity', label: 'Udacity' },
  
  // Marketing y Publicidad
  { value: 'Google Ads', label: 'Google Ads' },
  { value: 'Facebook', label: 'Meta (Facebook)' },
  { value: 'HubSpot', label: 'HubSpot' },
  { value: 'Hootsuite', label: 'Hootsuite' },
  
  // Salud y Seguridad
  { value: 'OSHA', label: 'OSHA' },
  { value: 'NEBOSH', label: 'NEBOSH' },
  { value: 'Cruz Roja', label: 'Cruz Roja' },
  
  // Instituciones Salvadoreñas
  { value: 'INSAFORP', label: 'INSAFORP' },
  { value: 'UES', label: 'Universidad de El Salvador' },
  { value: 'UCA', label: 'Universidad Centroamericana José Simeón Cañas' },
  { value: 'UFG', label: 'Universidad Francisco Gavidia' },
  { value: 'UTEC', label: 'Universidad Tecnológica' },
  { value: 'FEPADE', label: 'FEPADE' },
  
  // Otros
  { value: 'Otros', label: 'Otras Instituciones' }
]

// 🆕 Habilidades técnicas populares (para futuros componentes)
export const SKILLS_TECNICOS_POPULARES = [
  // Programación
  'JavaScript', 'Python', 'Java', 'C#', 'PHP', 'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin',
  'TypeScript', 'C++', 'C', 'Scala', 'R', 'MATLAB', 'Dart',
  
  // Frontend
  'React', 'Vue.js', 'Angular', 'HTML5', 'CSS3', 'SASS', 'LESS', 'Bootstrap', 'Tailwind CSS',
  'jQuery', 'Next.js', 'Nuxt.js', 'Svelte', 'Webpack', 'Vite',
  
  // Backend
  'Node.js', 'Express.js', 'Django', 'Flask', 'Spring Boot', 'ASP.NET', 'Laravel',
  'Ruby on Rails', 'FastAPI', 'NestJS',
  
  // Bases de Datos
  'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLite', 'Oracle', 'SQL Server',
  'Firebase', 'Elasticsearch',
  
  // Cloud & DevOps
  'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Jenkins', 'GitLab CI',
  'GitHub Actions', 'Terraform', 'Linux', 'Git',
  
  // Design & UX
  'Figma', 'Adobe XD', 'Sketch', 'Photoshop', 'Illustrator', 'InDesign',
  'Canva', 'Wireframing', 'Prototyping',
  
  // Marketing Digital
  'SEO', 'SEM', 'Google Analytics', 'Facebook Ads', 'Google Ads', 'Email Marketing',
  'Content Marketing', 'Social Media', 'WordPress',
  
  // Herramientas de Oficina
  'Microsoft Excel', 'Microsoft Word', 'Microsoft PowerPoint', 'Google Sheets',
  'Google Docs', 'Slack', 'Trello', 'Notion', 'Jira', 'Confluence',
  
  // Análisis de Datos
  'Excel Avanzado', 'Power BI', 'Tableau', 'SQL', 'Python para Datos', 'R Studio',
  'Google Analytics', 'Data Visualization',
  
  // Gestión de Proyectos
  'Scrum', 'Agile', 'Kanban', 'Project Management', 'Jira', 'Asana', 'Monday.com',
  'Microsoft Project', 'Gantt Charts',
  
  // Idiomas (niveles)
  'Inglés Básico', 'Inglés Intermedio', 'Inglés Avanzado', 'Inglés Nativo',
  'Francés', 'Portugués', 'Alemán', 'Italiano', 'Chino Mandarín'
]

// 🆕 Niveles de idioma (Marco Común Europeo)
export const NIVELES_IDIOMA = [
  { value: 'A1', label: 'A1 - Principiante' },
  { value: 'A2', label: 'A2 - Básico' },
  { value: 'B1', label: 'B1 - Intermedio' },
  { value: 'B2', label: 'B2 - Intermedio Alto' },
  { value: 'C1', label: 'C1 - Avanzado' },
  { value: 'C2', label: 'C2 - Nativo/Bilingüe' }
]

// 🆕 Idiomas más comunes
export const IDIOMAS_POPULARES = [
  { value: 'Español', label: 'Español' },
  { value: 'Inglés', label: 'Inglés' },
  { value: 'Francés', label: 'Francés' },
  { value: 'Portugués', label: 'Portugués' },
  { value: 'Italiano', label: 'Italiano' },
  { value: 'Alemán', label: 'Alemán' },
  { value: 'Chino Mandarín', label: 'Chino Mandarín' },
  { value: 'Japonés', label: 'Japonés' },
  { value: 'Coreano', label: 'Coreano' },
  { value: 'Árabe', label: 'Árabe' },
  { value: 'Ruso', label: 'Ruso' },
  { value: 'Otros', label: 'Otros' }


    
]


// 🆕 TIPOS DE LOGROS (agregar al final de tu constants.js)
export const TIPOS_LOGRO = [
  { value: 'Académico', label: 'Logro Académico', icon: 'fas fa-graduation-cap', color: 'primary' },
  { value: 'Profesional', label: 'Logro Profesional', icon: 'fas fa-briefcase', color: 'success' },
  { value: 'Deportivo', label: 'Logro Deportivo', icon: 'fas fa-medal', color: 'warning' },
  { value: 'Voluntariado', label: 'Voluntariado', icon: 'fas fa-heart', color: 'danger' },
  { value: 'Liderazgo', label: 'Liderazgo', icon: 'fas fa-users', color: 'info' },
  { value: 'Innovación', label: 'Innovación', icon: 'fas fa-lightbulb', color: 'warning' },
  { value: 'Publicación', label: 'Publicación', icon: 'fas fa-book', color: 'secondary' },
  { value: 'Premio', label: 'Premio/Reconocimiento', icon: 'fas fa-trophy', color: 'warning' },
  { value: 'Proyecto', label: 'Proyecto Destacado', icon: 'fas fa-project-diagram', color: 'info' },
  { value: 'Competencia', label: 'Competencia/Concurso', icon: 'fas fa-award', color: 'success' },
  { value: 'Investigación', label: 'Investigación', icon: 'fas fa-microscope', color: 'primary' },
  { value: 'Arte', label: 'Arte y Creatividad', icon: 'fas fa-palette', color: 'danger' },
  { value: 'Tecnología', label: 'Tecnología', icon: 'fas fa-laptop-code', color: 'info' },
  { value: 'Emprendimiento', label: 'Emprendimiento', icon: 'fas fa-rocket', color: 'success' },
  { value: 'Otros', label: 'Otros', icon: 'fas fa-star', color: 'secondary' }
]

// 🆕 NIVELES DE LOGRO
export const NIVELES_LOGRO = [
  { value: 'Local', label: 'Nivel Local', color: 'secondary' },
  { value: 'Regional', label: 'Nivel Regional', color: 'info' },
  { value: 'Nacional', label: 'Nivel Nacional', color: 'primary' },
  { value: 'Internacional', label: 'Nivel Internacional', color: 'success' },
  { value: 'Mundial', label: 'Nivel Mundial', color: 'warning' }
]

// 🆕 POSICIONES/RANGOS DE LOGRO
export const POSICIONES_LOGRO = [
  { value: '1er Lugar', label: '1er Lugar', icon: 'fas fa-medal', color: 'warning' },
  { value: '2do Lugar', label: '2do Lugar', icon: 'fas fa-medal', color: 'secondary' },
  { value: '3er Lugar', label: '3er Lugar', icon: 'fas fa-medal', color: 'warning' },
  { value: 'Top 5', label: 'Top 5', icon: 'fas fa-award', color: 'info' },
  { value: 'Top 10', label: 'Top 10', icon: 'fas fa-award', color: 'primary' },
  { value: 'Finalista', label: 'Finalista', icon: 'fas fa-certificate', color: 'success' },
  { value: 'Participante Destacado', label: 'Participante Destacado', icon: 'fas fa-star', color: 'info' },
  { value: 'Reconocimiento', label: 'Reconocimiento Especial', icon: 'fas fa-ribbon', color: 'primary' },
  { value: 'Mención Honorífica', label: 'Mención Honorífica', icon: 'fas fa-scroll', color: 'secondary' },
  { value: 'Completado', label: 'Completado/Logrado', icon: 'fas fa-check-circle', color: 'success' }
]

// 🆕 AGREGAR AL FINAL DE constants.js

// GÉNEROS DISPONIBLES
export const GENEROS = [
  { value: 'Masculino', label: 'Masculino' },
  { value: 'Femenino', label: 'Femenino' },
  { value: 'Otro', label: 'Otro' },
  { value: 'Prefiero no decir', label: 'Prefiero no decir' }
]

// TIPOS DE DOCUMENTO DE IDENTIDAD
export const TIPOS_DOCUMENTO_IDENTIDAD = [
  { value: 'DUI', label: 'DUI (Documento Único de Identidad)' },
  { value: 'Pasaporte', label: 'Pasaporte' },
  { value: 'Cedula', label: 'Cédula de Identidad' }
]

// FORMATOS DE DOCUMENTOS SALVADOREÑOS
export const FORMATOS_DOCUMENTO = {
  DUI: {
    pattern: /^\d{8}-\d$/,
    placeholder: '12345678-9',
    ejemplo: 'Ejemplo: 03458765-2'
  },
  NIT: {
    pattern: /^\d{4}-\d{6}-\d{3}-\d$/,
    placeholder: '1234-567890-123-4',
    ejemplo: 'Ejemplo: 0614-251289-105-3'
  },
  NUP: {
    pattern: /^[A-Z]{2}\d{6,10}$/,
    placeholder: 'AB123456',
    ejemplo: 'Ejemplo: PE1234567890'
  },
  Pasaporte: {
    pattern: /^[A-Z0-9]{6,9}$/,
    placeholder: 'AB123456',
    ejemplo: 'Ejemplo: P1234567'
  },
  Cedula: {
    pattern: /^[\d-]{8,15}$/,
    placeholder: '12345678',
    ejemplo: 'Según país de origen'
  }
}