const ADDIS_AREA_POINTS = [
  { key: "piassa", label: "Piassa", x: 39, y: 34, note: "Northwest / old city center" },
  { key: "kazanchis", label: "Kazanchis", x: 52, y: 42, note: "Central business area" },
  { key: "mexico", label: "Mexico", x: 42, y: 57, note: "Central southwest corridor" },
  { key: "bole", label: "Bole", x: 67, y: 52, note: "East / airport corridor" },
  { key: "megenagna", label: "Megenagna", x: 63, y: 34, note: "Northeast connector area" },
  { key: "cmc", label: "CMC", x: 79, y: 29, note: "Northeast residential corridor" },
  { key: "sar bet", label: "Sar Bet", x: 35, y: 68, note: "Southwest residential area" },
  { key: "addis ababa", label: "Addis Ababa", x: 52, y: 50, note: "General city area" },
];

export default function TaskAreaMap({ location, compact = false }) {
  const selectedArea = getAreaPoint(location);
  const surroundingAreas = ADDIS_AREA_POINTS.filter(
    (area) => area.key !== selectedArea.key
  );

  return (
    <section className={`task-area-map${compact ? " compact" : ""}`}>
      <div className="task-area-map-copy">
        <span>Approximate area</span>
        <strong>{selectedArea.label}</strong>
        {!compact && <p>{selectedArea.note}</p>}
      </div>

      <div
        className="task-area-map-canvas"
        aria-label={`Approximate task area map for ${selectedArea.label}`}
      >
        <span className="map-road map-road-one" />
        <span className="map-road map-road-two" />
        <span className="map-road map-road-three" />
        <span className="map-zone map-zone-north" />
        <span className="map-zone map-zone-south" />

        {!compact && surroundingAreas.map((area) => (
          <span
            className="map-area-dot"
            key={area.key}
            style={{
              left: `${area.x}%`,
              top: `${area.y}%`,
            }}
            title={area.label}
          />
        ))}

        <span
          className="map-pin"
          style={{
            left: `${selectedArea.x}%`,
            top: `${selectedArea.y}%`,
          }}
        >
          <span />
        </span>
      </div>

      {!compact && (
        <p className="task-area-map-note">
          Exact address is shared only after a provider is accepted.
        </p>
      )}
    </section>
  );
}

function getAreaPoint(location) {
  const normalizedLocation = normalize(location);
  const exactMatch = ADDIS_AREA_POINTS.find(
    (area) => normalizedLocation === area.key
  );

  if (exactMatch) return exactMatch;

  const partialMatch = ADDIS_AREA_POINTS.find(
    (area) =>
      normalizedLocation.includes(area.key) || area.key.includes(normalizedLocation)
  );

  return partialMatch || ADDIS_AREA_POINTS[ADDIS_AREA_POINTS.length - 1];
}

function normalize(value) {
  return String(value || "").toLowerCase().trim();
}
