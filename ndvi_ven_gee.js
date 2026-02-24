// =====================
// Paquete para dibujar texto
// =====================
var text = require('users/gena/packages:text');

// =====================
// AOI: Venezuela
// =====================
var venezuela = ee.FeatureCollection('USDOS/LSIB_SIMPLE/2017')
  .filter(ee.Filter.eq('country_na', 'Venezuela'))
  .geometry();

Map.centerObject(venezuela, 5);
Map.addLayer(venezuela, {color: 'black'}, 'Venezuela (AOI)');

// Región para exportar video (marco del GIF)
var region = venezuela.bounds(1);

// Punto fijo para colocar el año 
var ring = ee.List(region.coordinates().get(0));
var xmin = ee.Number(ee.List(ring.get(0)).get(0));
var ymin = ee.Number(ee.List(ring.get(0)).get(1));
var xmax = ee.Number(ee.List(ring.get(2)).get(0));
var ymax = ee.Number(ee.List(ring.get(2)).get(1));
var w = xmax.subtract(xmin);
var h = ymax.subtract(ymin);

var labelPoint = ee.Geometry.Point([
  xmin.add(w.multiply(0.03)),     
  ymax.subtract(h.multiply(0.05))  
]);

// =====================
// Colección MODIS NDVI
// =====================
var mod13 = ee.ImageCollection('MODIS/061/MOD13A2')
  .filterBounds(venezuela)
  .filterDate('2000-01-01', '2026-12-31')
  .select('NDVI');

// Escala NDVI (0.0001) a valores reales
var mod13_ndvi = mod13.map(function(img){
  return img.multiply(0.0001)
    .copyProperties(img, ['system:time_start']);
});

// Visualización NDVI
var ndviVis = {
  min: -0.2,
  max: 1.0,
  palette: [
    'ffffff','ce7e45','df923d','f1b555','fcd163','99b718','74a901',
    '66a000','529400','3e8601','207401','056201','004c00','023b01',
    '012e01','011d01','011301'
  ]
};

// =====================
// Crear un frame por año + etiqueta con el año
// =====================
var years = ee.List.sequence(2000, 2026);

var yearlyFrames = ee.ImageCollection.fromImages(
  years.map(function(y){
    y = ee.Number(y);
    var start = ee.Date.fromYMD(y, 1, 1);
    var end   = start.advance(1, 'year');
    
    // Compuesto anual (median) + recorte a Venezuela
    var annual = mod13_ndvi
      .filterDate(start, end)
      .median()
      .clip(venezuela);
    
    // Render NDVI a RGB
    var rendered = annual.visualize(ndviVis);
    
    // Etiqueta del año 
    var yearLabel = text.draw(y.format('%.0f'), labelPoint, 1000, {
      fontSize: 64,           
      textColor: 'ffffff',
      outlineColor: '000000',
      outlineWidth: 4         
    });
    
    // Frame final: NDVI + año 
    return rendered.blend(yearLabel)
      .set('system:time_start', start.millis())
      .set('year', y);
  })
);

//  Ver un par de años en el mapa como prueba
var ndvi2000 = ee.Image(yearlyFrames.filter(ee.Filter.eq('year', 2000)).first());
var ndvi2026 = ee.Image(yearlyFrames.filter(ee.Filter.eq('year', 2026)).first());
Map.addLayer(ndvi2000, {}, 'NDVI anual 2000 (con año)');
Map.addLayer(ndvi2026, {}, 'NDVI anual 2026 (con año)');

// =====================
// GIF 
// =====================
var videoArgs = {
  region: region,          // marco del GIF 
  dimensions: 1024,
  framesPerSecond: 1
};


// URL del GIF
print('GIF URL:', yearlyFrames.getVideoThumbURL(videoArgs));

// =====================
// 6) EXPORTAR a Google Drive 
// =====================
Export.video.toDrive({
  collection: yearlyFrames,
  description: 'NDVI_Venezuela_2000_2026',
  folder: 'EarthEngine',
  fileNamePrefix: 'ndvi_venezuela',
  framesPerSecond: 1,
  dimensions: 1920,
  region: region,
  crs: 'EPSG:4326'
});
