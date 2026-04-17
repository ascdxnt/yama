export interface Location {
  name: string;
  provincia: string;
  phone: string;
  phoneRaw: string;
  whatsapp: string | null;
  whatsappRaw: string | null;
  email: string;
  address: string;
}

export const AGENCIAS: Location[] = [
  { name: 'La Uruca', provincia: 'San José', phone: '2211-5900', phoneRaw: '+50622115900', whatsapp: '8302-7848', whatsappRaw: '50683027848', email: 'mercadeo@yamahacr.com', address: 'Frente a Capris, La Uruca.' },
  { name: 'Plaza Viquez', provincia: 'San José', phone: '2226-0119', phoneRaw: '+50622260119', whatsapp: '8302-7848', whatsappRaw: '50683027848', email: 'sucplazaviquez@yamahacr.com', address: '300 mts norte del Centro Comercial del Sur' },
  { name: 'Paseo Las Flores', provincia: 'Heredia', phone: '2560-4502', phoneRaw: '+50625604502', whatsapp: '8302-7848', whatsappRaw: '50683027848', email: 'sucpasedelasflores@yamahacr.com', address: 'Mall Paseo Las Flores. Horario L-S: 10am a 6pm' },
  { name: 'Alajuela', provincia: 'Alajuela', phone: '2431-2054', phoneRaw: '+50624312054', whatsapp: '8302-7848', whatsappRaw: '50683027848', email: 'sucalajuela@yamahacr.com', address: '50 mts sur de la bomba Delta sobre la Radial Francisco J. Orlich' },
  { name: 'Ciudad Quesada', provincia: 'Alajuela', phone: '2460-0180', phoneRaw: '+50624600180', whatsapp: '8302-7848', whatsappRaw: '50683027848', email: 'sucsancarlos@yamahacr.com', address: 'Frente a la Parroquia San Roque' },
  { name: 'San Ramón', provincia: 'Alajuela', phone: '2445-4555', phoneRaw: '+50624454555', whatsapp: '8302-7848', whatsappRaw: '50683027848', email: 'sucsanramon@yamahacr.com', address: '150 mts este de la entrada norte de la Iglesia de San Ramón' },
  { name: 'Quepos', provincia: 'Puntarenas', phone: '2777-2967', phoneRaw: '+50627772967', whatsapp: '8302-7848', whatsappRaw: '50683027848', email: 'sucquepos@yamahacr.com', address: '150 mts sur del Banco Nacional, frente al Parque Municipal de Quepos' },
  { name: 'Liberia', provincia: 'Guanacaste', phone: '2236-0787', phoneRaw: '+50622360787', whatsapp: '8302-7848', whatsappRaw: '50683027848', email: 'sucliberia@yamahacr.com', address: 'Estación de Servicio JSM en calle 10 - Liberia Centro' },
];

export const DISTRIBUIDORES: Location[] = [
  { name: 'Desamparados', provincia: 'San José', phone: '2274-1222', phoneRaw: '+50622741222', whatsapp: '8723-9386', whatsappRaw: '50687239386', email: 'agencia.desamparados@yamahacr.com', address: '50 mts del Cementerio de San Antonio' },
  { name: 'Pérez Zeledón', provincia: 'San José', phone: '2771-0590', phoneRaw: '+50627710590', whatsapp: '8751-4545', whatsappRaw: '50687514545', email: 'agencia.motodelsur@yamahacr.com', address: 'Frente al Servicentro Coopeagri' },
  { name: 'Puntarenas', provincia: 'Puntarenas', phone: '2661-0804', phoneRaw: '+50626610804', whatsapp: '8838-0524', whatsappRaw: '50688380524', email: 'agencia.puntarenas@yamahacr.com', address: 'Puntarenas, de la Bomba Delta, 100 sur y 75 oeste' },
  { name: 'Ciudad Neilly', provincia: 'Puntarenas', phone: '2783-5435', phoneRaw: '+50627835435', whatsapp: null, whatsappRaw: null, email: 'agencia.cuidadneilly@yamahacr.com', address: 'Frente a estación de servicio' },
  { name: 'Cóbano', provincia: 'Puntarenas', phone: '2642-0417', phoneRaw: '+50626420417', whatsapp: null, whatsappRaw: null, email: 'agencia.cobano@yamahacr.com', address: 'Frente Oficinas del ICE' },
  { name: 'Jicaral', provincia: 'Puntarenas', phone: '2650-0586', phoneRaw: '+50626500586', whatsapp: '8374-1063', whatsappRaw: '50683741063', email: 'agencia.jicaral@yamahacr.com', address: 'Contiguo a la Guardia Rural' },
  { name: 'Paso Canoas', provincia: 'Puntarenas', phone: '2732-1000', phoneRaw: '+50627321000', whatsapp: null, whatsappRaw: null, email: 'agencia.cuidadneilly@yamahacr.com', address: 'Carretera hacia La Cuesta, contiguo a Recasa' },
  { name: 'Puerto Jiménez', provincia: 'Puntarenas', phone: '2735-5357', phoneRaw: '+50627355357', whatsapp: '8727-4324', whatsappRaw: '50687274324', email: 'agencia.sanvito@yamahacr.com', address: 'Contiguo a Cabinas Bosque Mar' },
  { name: 'San Vito', provincia: 'Puntarenas', phone: '2773-3039', phoneRaw: '+50627733039', whatsapp: '8727-4324', whatsappRaw: '50687274324', email: 'agencia.sanvito@yamahacr.com', address: 'Calle del Comercio, frente a Farmacia Coto Brus' },
  { name: 'Uvita', provincia: 'Puntarenas', phone: '2743-8281', phoneRaw: '+50627438281', whatsapp: '8696-5655', whatsappRaw: '50686965655', email: 'agencia.uvita@yamahacr.com', address: '100 mts del Banco de Costa Rica' },
  { name: 'Sierpe', provincia: 'Puntarenas', phone: '6079-7155', phoneRaw: '+50660797155', whatsapp: '6079-7155', whatsappRaw: '50660797155', email: 'agencia.sierpe@yamahacr.com', address: 'Sierpe centro, 100 mts sur del parque al lado derecho' },
  { name: 'Golfito', provincia: 'Puntarenas', phone: '4702-9019', phoneRaw: '+50647029019', whatsapp: '8858-0347', whatsappRaw: '50688580347', email: 'agencia.golfito@yamahacr.com', address: 'Golfito, pueblo civil, frente a la Heladería la Deliciosa' },
  { name: 'Limón', provincia: 'Limón', phone: '2758-5985', phoneRaw: '+50627585985', whatsapp: '8723-1386', whatsappRaw: '50687231386', email: 'agencia.limon@yamahacr.com', address: 'Calle a Piuta, contiguo al restaurante L\'Spot Pizzero' },
  { name: 'Guápiles', provincia: 'Limón', phone: '2710-4020', phoneRaw: '+50627104020', whatsapp: '8354-1036', whatsappRaw: '50683541036', email: 'agencia.guapiles@yamahacr.com', address: '200 metros oeste del INS frente a Casa Blanca' },
  { name: 'Sarapiquí', provincia: 'Heredia', phone: '2766-6459', phoneRaw: '+50627666459', whatsapp: '6020-6166', whatsappRaw: '50660206166', email: 'agencia.sarapiqui@yamahacr.com', address: '25 mts este del Banco Nacional de Puerto Viejo' },
  { name: 'Río Frío', provincia: 'Heredia', phone: '2764-4167', phoneRaw: '+50627644167', whatsapp: '6175-2185', whatsappRaw: '50661752185', email: 'agencia.riofrio@yamahacr.com', address: '50 mts sur del Parque Río Frío en Sarapiquí' },
  { name: 'El Coco', provincia: 'Guanacaste', phone: '8449-8022', phoneRaw: '+50684498022', whatsapp: '8449-1512', whatsappRaw: '50684491512', email: 'agencia.elcoco@yamahacr.com', address: 'Del Do It Center Sardinal, 800 mts norte, Plaza Nacascolo' },
  { name: 'Hojancha', provincia: 'Guanacaste', phone: '2659-9060', phoneRaw: '+50626599060', whatsapp: null, whatsappRaw: null, email: 'agencia.nicoya@yamahacr.com', address: '300 mts sur de la Iglesia Católica' },
  { name: 'Huacas', provincia: 'Guanacaste', phone: '8855-1248', phoneRaw: '+50688551248', whatsapp: '8855-1248', whatsappRaw: '50688551248', email: 'agencia.huacas@yamahacr.com', address: '100 oeste del Super La Uruca, Huacas' },
  { name: 'Nicoya', provincia: 'Guanacaste', phone: '2685-5262', phoneRaw: '+50626855262', whatsapp: null, whatsappRaw: null, email: 'agencia.nicoya@yamahacr.com', address: 'Centro Comercial La Gran Nicoya' },
  { name: 'Santa Cruz', provincia: 'Guanacaste', phone: '2680-1500', phoneRaw: '+50626801500', whatsapp: null, whatsappRaw: null, email: 'agencia.nicoya@yamahacr.com', address: '75 Oeste de los Tribunales de Sta Cruz' },
  { name: 'Cartago', provincia: 'Cartago', phone: '2552-0146', phoneRaw: '+50625520146', whatsapp: '8847-6040', whatsappRaw: '50688476040', email: 'agencia.cartago@yamahacr.com', address: '400 mts oeste del Mercado Central' },
  { name: 'Turrialba', provincia: 'Cartago', phone: '2556-7812', phoneRaw: '+50625567812', whatsapp: null, whatsappRaw: null, email: 'agencia.turrialba@yamahacr.com', address: '75 mts norte Colegio Nocturno' },
];
