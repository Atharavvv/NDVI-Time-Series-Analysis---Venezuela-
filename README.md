# NDVI Time Series Analysis - Venezuela (2000-2026)

Temporal analysis of vegetation cover dynamics in Venezuela using MODIS satellite data (NDVI band) and Google Earth Engine.

## Overview

This project visualizes 26 years of vegetation changes across Venezuela through the Normalized Difference Vegetation Index (NDVI), revealing patterns in forest cover, agricultural activity, and ecosystem health.

## Key Findings

**Vegetation Dynamics:**
- Annual NDVI composites show seasonal and long-term vegetation patterns
- Green areas (high NDVI) indicate healthy, dense vegetation
- Brown/orange areas (low NDVI) reveal bare soil, degraded land, or urban zones
- Temporal variations reflect climatic events, land use changes, and forest dynamics

**Observed Patterns:**
- Andean highlands maintain relatively stable vegetation cover
- Llanos region shows strong seasonal variability (wet/dry cycles)
- Amazon basin demonstrates high NDVI persistence
- Coastal and urban areas display consistently lower vegetation indices

## Technical Details

**Data Source:**
- Sensor: MODIS MOD13A2 Collection 6.1
- Spatial Resolution: 1 km
- Temporal Resolution: 16-day composite (annual median)
- Period: 2000-2026

**Processing:**
- Main Platform: Google Earth Engine
- Cloud reduction: Median annual composite
- Visualization: Custom color palette (white to dark green)
- Output: Animated GIF (1920x1080, 1 fps)

## Methods
```javascript
// Annual NDVI composite usean median
var annual = mod13_ndvi
  .filterDate(start, end)
  .median()
  .clip(venezuela);
```

**Workflow:**
1. Filter MODIS NDVI collection by year and bounds
2. Apply scale factor (0.0001) to raw values
3. Calculate annual median (cloud-free composite)
4. Visualize with standardized palette (-0.2 to 1.0)
5. Export as video frames with temporal annotation


## Usage

1. Open [Google Earth Engine Code Editor](https://code.earthengine.google.com/)
2. Copy `ndvi_ven_gee.js`
3. Run script
4. Export to Google Drive (Tasks tab)

## Limitations

- Cloud contamination minimized but not eliminated in tropical regions
- 1 km resolution may miss fine-scale changes (<100 ha)
- MODIS data available through 2024; 2025-2026 projections based on available composites
- No ground-truth validation included

## Applications

- Forest monitoring and deforestation detection
- Agricultural productivity assessment
- Climate impact evaluation
- Land use planning and conservation prioritization


## Author

**Leonardo Medina**  
Forestry Engineer | Geospatial Data Analyst  
[LinkedIn](https://www.linkedin.com/in/leomedinast/) | [GitHub](https://github.com/leomed512)

## References

- MODIS/Terra Vegetation Indices 16-Day L3 Global 1km SIN Grid V061 ([LP DAAC](https://lpdaac.usgs.gov/products/mod13a2v061/))
- Gorelick et al. (2017). Google Earth Engine: Planetary-scale geospatial analysis for everyone. *Remote Sensing of Environment*.

## License

Code: MIT  
Data: MODIS data courtesy of NASA EOSDIS Land Processes DAAC