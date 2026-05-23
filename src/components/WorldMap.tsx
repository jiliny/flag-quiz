import { useMemo } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
  createCoordinates,
} from '@vnedyalk0v/react19-simple-maps';
import type { Feature, Geometry } from 'geojson';
import clsx from 'clsx';
import { useLang } from '../i18n';
import worldData from '../data/world-110m.json';
import { feature } from 'topojson-client';
import { geoPath, geoEqualEarth } from 'd3-geo';

interface Props {
  code: string;
  className?: string;
}

export type RegionKey = 'na' | 'sa' | 'eu' | 'af' | 'as' | 'oc';

// ── ISO 3166-1 alpha-2 → numeric mapping ────────────────────────────
// Only the countries in our game pool; used to match TopoJSON `id` field.
const alpha2ToNumeric: Record<string, string> = {
  us: '840', ca: '124', mx: '484', cu: '192', jm: '388', do: '214', ht: '332',
  cr: '188', pa: '591', gt: '320', hn: '340', sv: '222',
  br: '076', ar: '032', cl: '152', pe: '604', co: '170', ec: '218',
  bo: '068', py: '600', uy: '858', ve: '862',
  gb: '826', fr: '250', de: '276', it: '380', es: '724', nl: '528',
  ch: '756', se: '752', no: '578', gr: '300', ie: '372', pt: '620',
  pl: '616', dk: '208', fi: '246', be: '056', at: '040', hu: '348',
  is: '352', cz: '203', ua: '804', ro: '642', bg: '100', sk: '703',
  si: '705', hr: '191', rs: '688', al: '008', ee: '233', lv: '428',
  lt: '440', lu: '442', mt: '470', by: '112',
  eg: '818', za: '710', ng: '566', ke: '404', ma: '504', dz: '012',
  tn: '788', ly: '434', sd: '729', et: '231', gh: '288', tz: '834',
  ug: '800', sn: '686', ci: '384', cm: '120', ao: '024', zw: '716', bw: '072',
  cn: '156', jp: '392', kr: '410', in: '356', th: '764', vn: '704',
  sg: '702', ph: '608', id: '360', my: '458', tr: '792', il: '376',
  ae: '784', sa: '682', ir: '364', iq: '368', jo: '400', lb: '422',
  qa: '634', kw: '414', om: '512', pk: '586', bd: '050', lk: '144',
  np: '524', mm: '104', kh: '116', la: '418', mn: '496', kz: '398',
  uz: '860', ru: '643',
  au: '036', nz: '554',
};

// ── Region lookup ───────────────────────────────────────────────────
const alpha2ToRegion: Record<string, RegionKey> = {
  us: 'na', ca: 'na', mx: 'na', cu: 'na', jm: 'na', do: 'na', ht: 'na',
  cr: 'na', pa: 'na', gt: 'na', hn: 'na', sv: 'na',
  br: 'sa', ar: 'sa', cl: 'sa', pe: 'sa', co: 'sa', ec: 'sa',
  bo: 'sa', py: 'sa', uy: 'sa', ve: 'sa',
  gb: 'eu', fr: 'eu', de: 'eu', it: 'eu', es: 'eu', nl: 'eu',
  ch: 'eu', se: 'eu', no: 'eu', gr: 'eu', ie: 'eu', pt: 'eu',
  pl: 'eu', dk: 'eu', fi: 'eu', be: 'eu', at: 'eu', hu: 'eu',
  is: 'eu', cz: 'eu', ua: 'eu', ro: 'eu', bg: 'eu', sk: 'eu',
  si: 'eu', hr: 'eu', rs: 'eu', al: 'eu', ee: 'eu', lv: 'eu',
  lt: 'eu', lu: 'eu', mt: 'eu', by: 'eu',
  eg: 'af', za: 'af', ng: 'af', ke: 'af', ma: 'af', dz: 'af',
  tn: 'af', ly: 'af', sd: 'af', et: 'af', gh: 'af', tz: 'af',
  ug: 'af', sn: 'af', ci: 'af', cm: 'af', ao: 'af', zw: 'af', bw: 'af',
  cn: 'as', jp: 'as', kr: 'as', in: 'as', th: 'as', vn: 'as',
  sg: 'as', ph: 'as', id: 'as', my: 'as', tr: 'as', il: 'as',
  ae: 'as', sa: 'as', ir: 'as', iq: 'as', jo: 'as', lb: 'as',
  qa: 'as', kw: 'as', om: 'as', pk: 'as', bd: 'as', lk: 'as',
  np: 'as', mm: 'as', kh: 'as', la: 'as', mn: 'as', kz: 'as',
  uz: 'as', ru: 'as',
  au: 'oc', nz: 'oc',
};

const regionNames: Record<RegionKey, { en: string; zh: string }> = {
  na: { en: 'North America', zh: '北美洲' },
  sa: { en: 'South America', zh: '南美洲' },
  eu: { en: 'Europe', zh: '欧洲' },
  af: { en: 'Africa', zh: '非洲' },
  as: { en: 'Asia', zh: '亚洲' },
  oc: { en: 'Oceania', zh: '大洋洲' },
};

// ── Static fallback presets for micro-states not in simplified maps ────
const zoomPresets: Record<string, { center: [number, number]; zoom: number }> = {
  sg: { center: [103.82, 1.35], zoom: 18 },
  mt: { center: [14.45, 35.9], zoom: 15 },
};

export function WorldMap({ code, className }: Props) {
  const lang = useLang();
  const lowerCode = code.toLowerCase();

  const targetNumericId = alpha2ToNumeric[lowerCode];
  const region = alpha2ToRegion[lowerCode] || 'as';
  const regionName = regionNames[region]?.[lang] || '';

  // Dynamic Algorithmic Zoom Calculation
  const zoom = useMemo(() => {
    try {
      // 1. Convert TopoJSON to GeoJSON features
      const featureCollection = feature(
        worldData as any,
        (worldData as any).objects.countries as any
      ) as any;
      const geographies = featureCollection.features as Feature<Geometry>[];
      const targetGeo = geographies.find((geo) => String(geo.id || '') === targetNumericId);

      if (targetGeo) {
        // 2. Instantiate identical projection as ComposableMap
        const projection = geoEqualEarth()
          .scale(160)
          .translate([400, 210]); // matches map center
        const path = geoPath().projection(projection);

        // 3. Compute optimal center and zoom level based on bounding box
        const bounds = path.bounds(targetGeo);
        if (bounds && !isNaN(bounds[0][0]) && !isNaN(bounds[1][0])) {
          const [[x0, y0], [x1, y1]] = bounds;
          const w = x1 - x0;
          const h = y1 - y0;
          
          const centerX = (x0 + x1) / 2;
          const centerY = (y0 + y1) / 2;

          // Invert back to geographic [lon, lat] coordinates
          const centerGeo = projection.invert?.([centerX, centerY]);

          if (centerGeo) {
            const zoomX = 800 / w;
            const zoomY = 420 / h;
            // Frame comfortable within 65% of viewport
            let optimalZoom = Math.min(zoomX, zoomY) * 0.65;
            // Limit minimum and maximum scale to prevent pixelation/out-of-bounds
            optimalZoom = Math.max(1.0, Math.min(18.0, optimalZoom));

            return {
              center: centerGeo as [number, number],
              zoom: optimalZoom,
            };
          }
        }
      }
    } catch (err) {
      console.error('Error calculating dynamic bounds:', err);
    }

    // Dynamic calculation fallback (e.g. for mt, sg)
    return zoomPresets[lowerCode] || { center: [0, 20] as [number, number], zoom: 1 };
  }, [lowerCode, targetNumericId]);

  // Build a set of numeric IDs that belong to the same region as the target country
  const sameRegionIds = useMemo(() => {
    const ids = new Set<string>();
    for (const [a2, r] of Object.entries(alpha2ToRegion)) {
      if (r === region) {
        const numId = alpha2ToNumeric[a2];
        if (numId) ids.add(numId);
      }
    }
    return ids;
  }, [region]);

  return (
    <div className={clsx(
      'relative w-full aspect-[100/52] bg-[#EAF6FF] rounded-2xl border-2 border-ink/10 overflow-hidden shadow-inner',
      className,
    )}>
      <ComposableMap
        projection="geoEqualEarth"
        projectionConfig={{ scale: 160 }}
        width={800}
        height={420}
        style={{ width: '100%', height: '100%' }}
      >
        <ZoomableGroup
          center={createCoordinates(zoom.center[0], zoom.center[1])}
          zoom={zoom.zoom}
        >
          <Geographies geography={worldData as any}>
            {({ geographies }: { geographies: Feature<Geometry>[] }) =>
              geographies.map((geo) => {
                const geoId = String(geo.id || '');
                const isTarget = geoId === targetNumericId;
                const isInRegion = sameRegionIds.has(geoId);

                // Visual hierarchy:
                // Target = vibrant orange/gold
                // Same region = soft mint
                // Everything else = pale grey
                let fill: string;
                let stroke: string;
                let strokeWidth: number;
                if (isTarget) {
                  fill = '#FF8C00'; // Luminous orange
                  stroke = '#1F2540';
                  strokeWidth = 1.5;
                } else if (isInRegion) {
                  fill = '#CFF3E1'; // Soft mint
                  stroke = '#91DCAE';
                  strokeWidth = 0.5;
                } else {
                  fill = '#E1ECF4'; // Desaturated pale grey-blue
                  stroke = '#C5D3DE';
                  strokeWidth = 0.3;
                }

                return (
                  <Geography
                    key={(geo as unknown as { rsmKey: string }).rsmKey}
                    geography={geo}
                    style={{
                      default: { fill, stroke, strokeWidth, outline: 'none' },
                      hover: { fill, stroke, strokeWidth, outline: 'none' },
                      pressed: { fill, stroke, strokeWidth, outline: 'none' },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>

      {/* Continent label */}
      <span className="absolute bottom-2 right-3.5 text-[#7FA3C5] font-extrabold text-sm sm:text-base tracking-wide select-none pointer-events-none">
        {regionName}
      </span>
    </div>
  );
}
