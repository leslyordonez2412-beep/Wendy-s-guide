// La dirección de Wendy NO está en el código: la escribe ella en la app y queda solo en su teléfono.
// Solo datos estables. Los datos variables (horarios, tarifas, promos) llevarán "verificado: AAAA-MM-DD".
const DESTINO = "Campus Universitario de Cartuja, Granada";
const q = s => encodeURIComponent(s);
const gm = s => `https://www.google.com/maps/search/?api=1&query=${q(s)}`;
const cerca = (id,t,x) => ({id:"cerca-"+id,cat:"Cerca de casa",t,d:"Resultados en vivo desde tu dirección.",url:o=>gm(x+" cerca de "+o),acc:"Ver mapa"});
const ruta = (id,t,url) => ({id,cat:"Rutas",t,d:"Calcula el tiempo real al abrirla.",url,acc:"Abrir"});
const web = (id,t,d,url) => ({id,cat:"Enlaces oficiales",t,d,url,acc:"Abrir"});
const sos = (id,t,d,n) => ({id,cat:"Emergencias",t,d,url:"tel:"+n,acc:"Llamar",sos:1});

const ITEMS = [
 sos("sos112","Emergencias 112","Número único europeo, gratuito.","112"),
 sos("sos061","Emergencias sanitarias 061","Urgencias médicas en Andalucía.","061"),
 sos("sos091","Policía Nacional 091","Denuncias y urgencias policiales.","091"),
 sos("sos092","Policía Local 092","Policía municipal de Granada.","092"),
 ruta("ruta-google","Casa a Campus de Cartuja (Google Maps)",o=>`https://www.google.com/maps/dir/?api=1&origin=${q(o)}&destination=${q(DESTINO)}&travelmode=transit`),
 ruta("ruta-apple","Casa a Campus de Cartuja (Apple Maps)",o=>`https://maps.apple.com/?saddr=${q(o)}&daddr=${q(DESTINO)}&dirflg=r`),
 ruta("ruta-pie","Casa a Campus de Cartuja a pie",o=>`https://www.google.com/maps/dir/?api=1&origin=${q(o)}&destination=${q(DESTINO)}&travelmode=walking`),
 cerca("farmacia","Farmacias cerca de casa","farmacia"),
 cerca("super","Supermercados cerca de casa","supermercado"),
 cerca("cajero","Cajeros automáticos cerca de casa","cajero automático"),
 cerca("salud","Centros de salud y hospitales cerca","centro de salud"),
 cerca("correos","Oficina de Correos cerca","correos"),
 cerca("lav","Lavanderías cerca de casa","lavandería"),
 cerca("biblio","Bibliotecas cerca","biblioteca"),
 web("web-ugr","Universidad de Granada","Web institucional de la UGR.","https://www.ugr.es"),
 web("web-adeslas","Adeslas","Portal oficial del seguro médico.","https://www.adeslas.es"),
 web("web-ayto","Ayuntamiento de Granada","Empadronamiento y servicios municipales.","https://www.granada.org"),
 web("web-ext","Sede electrónica de Política Territorial","Trámites oficiales de la Administración.","https://sede.administracionespublicas.gob.es")
];

const CHECK = [
 ["Trámites",["Empadronarme en Granada","Pedir cita para la TIE","Recoger la TIE","Obtener el certificado digital"]],
 ["Universidad",["Completar la matrícula","Obtener el carné TUI","Conocer la ruta a Cartuja","Registrarme en el portal de estudiantes"]],
 ["Dinero",["Abrir cuenta bancaria","Activar Bizum","Tener número de teléfono español"]],
 ["Salud",["Descargar la app de Adeslas","Encontrar mi centro médico","Guardar el 112 en favoritos"]],
 ["Día a día",["Registrarme en apps de transporte","Registrarme en apps de supermercado","Localizar mi farmacia más cercana"]]
];

const PROXIMAMENTE = [
 ["Bancos","Comparador verificado"],["Supermercados","Horarios y comparativa"],
 ["Transporte","Bus, metro y tarifas"],["Delivery","Apps y costes"],
 ["Universidad","Servicios UGR"],["Descuentos","Solo vigentes"],
 ["Trámites","Requisitos oficiales"],["Ocio","Lugares verificados"]
];
