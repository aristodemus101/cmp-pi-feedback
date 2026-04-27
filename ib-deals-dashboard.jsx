const { useState, useEffect, useRef, useMemo } = React;

const REGIONS = [
  { id: "na", name: "North America", color: "#00D4AA", countries: ["USA","CAN","MEX"] },
  { id: "latam", name: "Latin America", color: "#FF6B6B", countries: ["BRA","ARG","CHL","COL","PER","VEN","ECU","BOL","PRY","URY","GUY","SUR","PAN","CRI","NIC","HND","SLV","GTM","BLZ","CUB","DOM","HTI","JAM","TTO"] },
  { id: "emea_eu", name: "Europe", color: "#4ECDC4", countries: ["GBR","FRA","DEU","ITA","ESP","PRT","NLD","BEL","CHE","AUT","SWE","NOR","FIN","DNK","IRL","POL","CZE","ROU","HUN","GRC","UKR","BLR","SRB","HRV","BGR","SVK","SVN","LTU","LVA","EST","LUX","ISL","MKD","ALB","BIH","MNE","MDA"] },
  { id: "mena", name: "MENA", color: "#A78BFA", countries: ["SAU","ARE","QAT","KWT","BHR","OMN","IRQ","IRN","ISR","JOR","LBN","SYR","YEM","EGY","LBY","TUN","DZA","MAR"] },
  { id: "ssa", name: "Sub-Saharan Africa", color: "#FF8C42", countries: ["ZAF","NGA","KEN","GHA","ETH","TZA","UGA","RWA","SEN","CIV","CMR","AGO","MOZ","ZWE","ZMB","BWA","NAM","GAB","COG","COD","MDG","MLI","BFA","NER","TCD","SDN","SSD","SOM","ERI","DJI","MWI","SLE","LBR","GIN","GMB","TGO","BEN","MRT","GNB","CPV","STP","COM","SWZ","LSO","GNQ","CAF"] },
  { id: "india", name: "South Asia", color: "#FFE66D", countries: ["IND","LKA","BGD","NPL","PAK","AFG","BTN","MDV"] },
  { id: "apac", name: "Asia Pacific", color: "#38BDF8", countries: ["CHN","JPN","KOR","AUS","NZL","SGP","MYS","THA","IDN","PHL","VNM","MMR","KHM","LAO","TWN","MNG","PRK","HKG","BRN","TLS","PNG","FJI"] },
];

const DEAL_TYPES = ["M&A", "IPO", "DCM", "ECM", "LBO", "Restructuring"];
const COMPANIES = {
  na: ["Vertex Tech", "Nova Pharma", "Apex Capital", "Summit AI", "Pinnacle Energy", "Atlas Logistics", "Cedar Health"],
  latam: ["Rio Digital", "Andes Mining", "Selva Agri", "Pampa Telecom", "Caribe Finance"],
  emea_eu: ["Nordlux Energy", "Britannica AI", "Alpine Ind.", "Baltic Ship", "Euro Dynamics", "Rhine Pharma"],
  mena: ["Oasis Ventures", "Falcone Holdings", "Meridian Petro", "Zamzam Tech"],
  ssa: ["Savanna Digital", "Baobab Finance", "Kilimanjaro Mining", "Ubuntu Tech"],
  india: ["Tara Fintech", "Zenith Infra", "Kiran Pharma", "Drishti AI", "Nirmaan Steel"],
  apac: ["Sakura Robotics", "Pearl Semi", "Horizon EV", "Dynasty Tech", "Pacific Green"],
};

const typeColor = { "M&A": "#4ECDC4", IPO: "#FF6B6B", DCM: "#A78BFA", ECM: "#FFE66D", LBO: "#FF8C42", Restructuring: "#00D4AA" };
const statusColor = { Active: "#00D4AA", Closed: "#FF6B6B", Pipeline: "#FFE66D" };

const NUM_TO_ALPHA3 = {"840":"USA","124":"CAN","484":"MEX","076":"BRA","032":"ARG","152":"CHL","170":"COL","604":"PER","862":"VEN","218":"ECU","068":"BOL","600":"PRY","858":"URY","328":"GUY","740":"SUR","591":"PAN","188":"CRI","558":"NIC","340":"HND","222":"SLV","320":"GTM","084":"BLZ","192":"CUB","214":"DOM","332":"HTI","388":"JAM","780":"TTO","826":"GBR","250":"FRA","276":"DEU","380":"ITA","724":"ESP","620":"PRT","528":"NLD","056":"BEL","756":"CHE","040":"AUT","752":"SWE","578":"NOR","246":"FIN","208":"DNK","372":"IRL","616":"POL","203":"CZE","642":"ROU","348":"HUN","300":"GRC","804":"UKR","112":"BLR","688":"SRB","191":"HRV","100":"BGR","703":"SVK","705":"SVN","440":"LTU","428":"LVA","233":"EST","442":"LUX","352":"ISL","807":"MKD","008":"ALB","070":"BIH","499":"MNE","498":"MDA","682":"SAU","784":"ARE","634":"QAT","414":"KWT","048":"BHR","512":"OMN","368":"IRQ","364":"IRN","376":"ISR","400":"JOR","422":"LBN","760":"SYR","887":"YEM","818":"EGY","434":"LBY","788":"TUN","012":"DZA","504":"MAR","710":"ZAF","566":"NGA","404":"KEN","288":"GHA","231":"ETH","834":"TZA","800":"UGA","646":"RWA","686":"SEN","384":"CIV","120":"CMR","024":"AGO","508":"MOZ","716":"ZWE","894":"ZMB","072":"BWA","516":"NAM","266":"GAB","178":"COG","180":"COD","450":"MDG","466":"MLI","854":"BFA","562":"NER","148":"TCD","729":"SDN","728":"SSD","706":"SOM","232":"ERI","262":"DJI","454":"MWI","694":"SLE","430":"LBR","324":"GIN","270":"GMB","768":"TGO","204":"BEN","478":"MRT","624":"GNB","132":"CPV","678":"STP","174":"COM","748":"SWZ","426":"LSO","226":"GNQ","140":"CAF","356":"IND","144":"LKA","050":"BGD","524":"NPL","586":"PAK","004":"AFG","064":"BTN","462":"MDV","156":"CHN","392":"JPN","410":"KOR","036":"AUS","554":"NZL","702":"SGP","458":"MYS","764":"THA","360":"IDN","608":"PHL","704":"VNM","104":"MMR","116":"KHM","418":"LAO","158":"TWN","496":"MNG","408":"PRK","344":"HKG","096":"BRN","626":"TLS","598":"PNG","242":"FJI","643":"RUS"};

function getRegionForCountry(code) {
  for (const r of REGIONS) if (r.countries.includes(code)) return r;
  return null;
}

function generateDeal(regionId) {
  const cos = COMPANIES[regionId] || COMPANIES.na;
  const value = Math.round((Math.random() * 4800 + 200) * 10) / 10;
  return { id: Date.now() + Math.random(), region: regionId, company: cos[Math.floor(Math.random() * cos.length)], type: DEAL_TYPES[Math.floor(Math.random() * DEAL_TYPES.length)], value, timestamp: new Date(), status: Math.random() > 0.3 ? "Active" : Math.random() > 0.5 ? "Closed" : "Pipeline" };
}

function generateInitialDeals() {
  const deals = [];
  REGIONS.forEach((r) => { for (let i = 0; i < Math.floor(Math.random() * 6) + 4; i++) deals.push(generateDeal(r.id)); });
  return deals;
}

function formatValue(v) { return v >= 1000 ? `$${(v / 1000).toFixed(1)}B` : `$${v.toFixed(0)}M`; }
function timeAgo(d) { const s = Math.floor((Date.now() - d.getTime()) / 1000); return s < 60 ? `${s}s ago` : s < 3600 ? `${Math.floor(s / 60)}m ago` : `${Math.floor(s / 3600)}h ago`; }

/* === TopoJSON decoder (no external lib) === */
function topoFeature(topology, object) {
  const arcs = topology.arcs, tr = topology.transform;
  const sc = tr ? tr.scale : [1, 1], tl = tr ? tr.translate : [0, 0];
  function decArc(idx) {
    const a = arcs[idx < 0 ? ~idx : idx], c = []; let x = 0, y = 0;
    for (const [dx, dy] of a) { x += dx; y += dy; c.push([x * sc[0] + tl[0], y * sc[1] + tl[1]]); }
    if (idx < 0) c.reverse(); return c;
  }
  function decRing(idxs) {
    const c = [];
    for (const idx of idxs) { const d = decArc(idx); const s = c.length > 0 ? 1 : 0; for (let i = s; i < d.length; i++) c.push(d[i]); }
    return c;
  }
  function decGeom(g) {
    if (g.type === "Polygon") return { ...g, coordinates: g.arcs.map(decRing) };
    if (g.type === "MultiPolygon") return { ...g, coordinates: g.arcs.map(p => p.map(decRing)) };
    return g;
  }
  return { type: "FeatureCollection", features: object.geometries.map(g => { const d = decGeom(g); return { type: "Feature", id: g.id, properties: g.properties || {}, geometry: { type: d.type, coordinates: d.coordinates } }; }) };
}

/* === Map Component === */
function WorldMap({ regionStats, selectedRegion, onSelect, hoveredRegion, onHover }) {
  const [geo, setGeo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tooltip, setTooltip] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
      .then(r => r.json())
      .then(topo => { setGeo(topoFeature(topo, topo.objects.countries)); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const W = 860, H = 460;
  const projection = useMemo(() => d3.geoMercator().scale(130).translate([W / 2, H / 2 + 50]).center([0, 18]), []);
  const pathGen = useMemo(() => d3.geoPath().projection(projection), [projection]);

  if (loading) return <div style={{ height: 320, display: "flex", alignItems: "center", justifyContent: "center", color: "#3a4455", fontSize: 11 }}>Loading world map…</div>;
  if (!geo) return <div style={{ height: 320, display: "flex", alignItems: "center", justifyContent: "center", color: "#FF6B6B", fontSize: 11 }}>Map data unavailable</div>;

  return (
    <div ref={containerRef} style={{ position: "relative" }}
      onMouseMove={(e) => {
        if (tooltip && containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          setTooltip(t => t ? { ...t, px: e.clientX - rect.left + 14, py: e.clientY - rect.top - 10 } : null);
        }
      }}
    >
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block" }}>
        <rect width={W} height={H} fill="#060a12" rx="6" />
        <path d={pathGen(d3.geoGraticule10())} fill="none" stroke="#0c1322" strokeWidth="0.4" />
        {geo.features.map((f, i) => {
          const a3 = NUM_TO_ALPHA3[String(f.id)] || "";
          const region = getRegionForCountry(a3);
          const rid = region?.id;
          const isSel = selectedRegion && rid === selectedRegion;
          const isHov = hoveredRegion && rid === hoveredRegion;
          const isDim = selectedRegion && rid !== selectedRegion;
          let fill = "#12192a", op = isDim ? 0.25 : 0.5, sw = 0.3, sc = "#0a1020";
          if (region) {
            const stats = regionStats[rid] || { totalValue: 0 };
            const intensity = Math.min(0.85, 0.2 + (stats.totalValue / 12000) * 0.6);
            fill = region.color;
            op = isDim ? 0.08 : isSel || isHov ? intensity + 0.2 : intensity;
            sc = isSel || isHov ? region.color : "#060a12";
            sw = isSel || isHov ? 1.2 : 0.4;
          }
          const d = pathGen(f);
          if (!d) return null;
          return <path key={i} d={d} fill={fill} fillOpacity={op} stroke={sc} strokeWidth={sw} strokeOpacity={0.7}
            style={{ cursor: region ? "pointer" : "default", transition: "fill-opacity 0.3s" }}
            onMouseEnter={() => { if (region) { onHover(rid); const s = regionStats[rid] || {}; setTooltip({ region: region.name, color: region.color, count: s.count || 0, value: s.totalValue || 0, active: s.active || 0, px: 0, py: 0 }); } }}
            onMouseLeave={() => { onHover(null); setTooltip(null); }}
            onClick={() => region && onSelect(selectedRegion === rid ? null : rid)}
          />;
        })}
      </svg>
      {tooltip && (
        <div style={{
          position: "absolute", left: tooltip.px, top: tooltip.py, pointerEvents: "none", zIndex: 10,
          background: "#0c1120ee", border: `1px solid ${tooltip.color}60`, borderRadius: 6,
          padding: "8px 12px", minWidth: 130, backdropFilter: "blur(8px)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: tooltip.color }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: "#fff" }}>{tooltip.region}</span>
          </div>
          <div style={{ fontSize: 9, color: "#8892a4" }}>{tooltip.count} deals · {formatValue(tooltip.value)}</div>
          <div style={{ fontSize: 9, color: "#00D4AA", marginTop: 2 }}>{tooltip.active} active</div>
        </div>
      )}
    </div>
  );
}

/* === Dashboard === */
function IBDealsDashboard() {
  const [deals, setDeals] = useState(generateInitialDeals);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const [feed, setFeed] = useState([]);

  useEffect(() => {
    const iv = setInterval(() => {
      const r = REGIONS[Math.floor(Math.random() * REGIONS.length)];
      const deal = generateDeal(r.id);
      setDeals(p => [...p, deal]);
      setFeed(p => [deal, ...p].slice(0, 15));
    }, 2800);
    return () => clearInterval(iv);
  }, []);

  const regionStats = useMemo(() => {
    const s = {};
    REGIONS.forEach(r => { const rd = deals.filter(d => d.region === r.id); s[r.id] = { count: rd.length, totalValue: rd.reduce((a, d) => a + d.value, 0), active: rd.filter(d => d.status === "Active").length, pipeline: rd.filter(d => d.status === "Pipeline").length }; });
    return s;
  }, [deals]);

  const totalValue = useMemo(() => deals.reduce((s, d) => s + d.value, 0), [deals]);
  const filtered = selectedRegion ? deals.filter(d => d.region === selectedRegion) : deals;
  const selReg = REGIONS.find(r => r.id === selectedRegion);

  return (
    <div style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace", background: "#080c14", color: "#C8D6E5", minHeight: "100vh", padding: "16px 20px", boxSizing: "border-box" }}>
      <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&family=Instrument+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
        @keyframes fadeSlide{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes glow{0%,100%{box-shadow:0 0 4px rgba(0,212,170,.3)}50%{box-shadow:0 0 14px rgba(0,212,170,.7)}}
        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:#1a2235;border-radius:2px}
      `}</style>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 14, paddingBottom: 12, borderBottom: "1px solid #111827" }}>
        <div>
          <div style={{ fontFamily: "'Instrument Sans',sans-serif", fontSize: 20, fontWeight: 700, color: "#fff", letterSpacing: -.5 }}>
            <span style={{ color: "#00D4AA" }}>◈</span> IB Deal Flow
            <span style={{ fontSize: 9, color: "#2d3748", marginLeft: 8, fontFamily: "JetBrains Mono", fontWeight: 400, letterSpacing: 1 }}>GLOBAL · REAL-TIME</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 24, alignItems: "flex-end" }}>
          {[{ label: "Pipeline", val: formatValue(totalValue), c: "#00D4AA" }, { label: "Deals", val: deals.length, c: "#fff" }, { label: "Active", val: deals.filter(d => d.status === "Active").length, c: "#4ECDC4" }].map(m => (
            <div key={m.label} style={{ textAlign: "right" }}>
              <div style={{ fontSize: 8, color: "#4a5568", textTransform: "uppercase", letterSpacing: 1.2 }}>{m.label}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: m.c, fontFamily: "'Instrument Sans'" }}>{m.val}</div>
            </div>
          ))}
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#00D4AA", animation: "glow 2s infinite", marginBottom: 4 }} />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 270px", gap: 14 }}>
        {/* Left */}
        <div>
          <div style={{ background: "#0a0f1a", border: "1px solid #131c2e", borderRadius: 8, padding: "12px 14px", marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <div style={{ fontSize: 8, color: "#4a5568", textTransform: "uppercase", letterSpacing: 1.5 }}>Mercator · Choropleth by Deal Volume</div>
              {selectedRegion && <button onClick={() => setSelectedRegion(null)} style={{ background: "transparent", border: "1px solid #1a2235", borderRadius: 4, color: "#8892a4", fontSize: 8, padding: "2px 8px", cursor: "pointer", fontFamily: "JetBrains Mono" }}>✕ Clear</button>}
            </div>
            <WorldMap regionStats={regionStats} selectedRegion={selectedRegion} onSelect={setSelectedRegion} hoveredRegion={hoveredRegion} onHover={setHoveredRegion} />
            <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
              {REGIONS.map(r => (
                <div key={r.id} onClick={() => setSelectedRegion(selectedRegion === r.id ? null : r.id)}
                  style={{ display: "flex", alignItems: "center", gap: 5, cursor: "pointer", opacity: !selectedRegion || selectedRegion === r.id ? 1 : .3, transition: "opacity .2s", padding: "3px 7px", borderRadius: 4, background: selectedRegion === r.id ? r.color + "12" : "transparent", border: selectedRegion === r.id ? `1px solid ${r.color}30` : "1px solid transparent" }}>
                  <div style={{ width: 7, height: 7, borderRadius: 2, background: r.color }} />
                  <span style={{ fontSize: 9, color: "#8892a4", fontWeight: 500 }}>{r.name}</span>
                  <span style={{ fontSize: 8, color: "#4a5568" }}>{regionStats[r.id]?.count || 0}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Region Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 12 }}>
            {REGIONS.map(r => { const s = regionStats[r.id] || {}; const isSel = selectedRegion === r.id; return (
              <div key={r.id} onClick={() => setSelectedRegion(isSel ? null : r.id)}
                style={{ background: isSel ? "#0e1525" : "#0a0f1a", border: `1px solid ${isSel ? r.color + "50" : "#131c2e"}`, borderRadius: 6, padding: "10px 11px", cursor: "pointer", transition: "all .2s", borderLeft: isSel ? `3px solid ${r.color}` : undefined }}>
                <div style={{ fontSize: 8, color: r.color, fontWeight: 600, textTransform: "uppercase", letterSpacing: .5, marginBottom: 5 }}>{r.name}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", fontFamily: "'Instrument Sans'" }}>{formatValue(s.totalValue || 0)}</div>
                <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                  <span style={{ fontSize: 8, color: "#4a5568" }}>{s.count || 0} deals</span>
                  <span style={{ fontSize: 8, color: "#00D4AA" }}>{s.active || 0} active</span>
                </div>
              </div>
            ); })}
          </div>

          {/* Type Bars */}
          <div style={{ background: "#0a0f1a", border: "1px solid #131c2e", borderRadius: 8, padding: "12px 14px" }}>
            <div style={{ fontSize: 8, color: "#4a5568", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10 }}>Deal Type Distribution{selReg ? ` · ${selReg.name}` : ""}</div>
            <div style={{ display: "flex", gap: 10 }}>
              {DEAL_TYPES.map(t => {
                const c = filtered.filter(d => d.type === t).length;
                const mx = Math.max(...DEAL_TYPES.map(tt => filtered.filter(d => d.type === tt).length), 1);
                return (
                  <div key={t} style={{ flex: 1 }}>
                    <div style={{ height: 55, display: "flex", alignItems: "flex-end", marginBottom: 4 }}>
                      <div style={{ width: "100%", borderRadius: "3px 3px 0 0", height: `${(c / mx) * 100}%`, background: `linear-gradient(180deg,${typeColor[t]},${typeColor[t]}40)`, transition: "height .5s ease", minHeight: c > 0 ? 4 : 0 }} />
                    </div>
                    <div style={{ fontSize: 8, color: typeColor[t], textAlign: "center", fontWeight: 500 }}>{t}</div>
                    <div style={{ fontSize: 9, color: "#4a5568", textAlign: "center" }}>{c}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Live Feed */}
          <div style={{ background: "#0a0f1a", border: "1px solid #131c2e", borderRadius: 8, padding: "12px 14px", maxHeight: 260, overflow: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ fontSize: 8, color: "#4a5568", textTransform: "uppercase", letterSpacing: 1.5 }}>Live Feed</div>
              <div style={{ fontSize: 8, color: "#00D4AA", display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#00D4AA", animation: "pulse 1.5s infinite" }} />LIVE
              </div>
            </div>
            {feed.map((d, i) => { const rg = REGIONS.find(r => r.id === d.region); return (
              <div key={d.id} style={{ padding: "7px 0", borderBottom: "1px solid #0e1525", animation: i === 0 ? "fadeSlide .4s ease" : "none" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 9.5, color: "#e2e8f0", fontWeight: 500 }}>{d.company}</span>
                  <span style={{ fontSize: 9.5, color: "#00D4AA", fontWeight: 600 }}>{formatValue(d.value)}</span>
                </div>
                <div style={{ display: "flex", gap: 6, marginTop: 3 }}>
                  <span style={{ fontSize: 7.5, padding: "1px 4px", borderRadius: 2, background: typeColor[d.type] + "15", color: typeColor[d.type] }}>{d.type}</span>
                  <span style={{ fontSize: 7.5, padding: "1px 4px", borderRadius: 2, background: (rg?.color || "#888") + "15", color: rg?.color }}>{rg?.name}</span>
                  <span style={{ fontSize: 7.5, color: "#2d3748", marginLeft: "auto" }}>{timeAgo(d.timestamp)}</span>
                </div>
              </div>
            ); })}
          </div>

          {/* Deal Table */}
          <div style={{ background: "#0a0f1a", border: "1px solid #131c2e", borderRadius: 8, padding: "12px 14px", flex: 1, overflow: "auto", maxHeight: 340 }}>
            <div style={{ fontSize: 8, color: "#4a5568", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>
              {selReg ? selReg.name : "All Regions"} <span style={{ color: "#2d3748" }}>({filtered.length})</span>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr style={{ fontSize: 8, color: "#3a4455", textAlign: "left" }}>
                <th style={{ padding: "4px 0", fontWeight: 500 }}>Company</th><th style={{ fontWeight: 500 }}>Type</th><th style={{ fontWeight: 500 }}>Value</th><th style={{ fontWeight: 500 }}>Status</th>
              </tr></thead>
              <tbody>
                {filtered.slice(-25).reverse().map(d => (
                  <tr key={d.id} style={{ borderTop: "1px solid #0e1525", fontSize: 9 }}>
                    <td style={{ padding: "5px 0", color: "#c8d6e5", fontWeight: 500 }}>{d.company}</td>
                    <td><span style={{ fontSize: 7.5, padding: "1px 4px", borderRadius: 2, background: typeColor[d.type] + "12", color: typeColor[d.type] }}>{d.type}</span></td>
                    <td style={{ color: "#00D4AA", fontWeight: 500 }}>{formatValue(d.value)}</td>
                    <td><span style={{ display: "flex", alignItems: "center", gap: 3 }}><div style={{ width: 4, height: 4, borderRadius: "50%", background: statusColor[d.status] }} /><span style={{ color: statusColor[d.status], fontSize: 7.5 }}>{d.status}</span></span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

const rootEl = document.getElementById("root");
if (rootEl) {
  ReactDOM.createRoot(rootEl).render(<IBDealsDashboard />);
}
