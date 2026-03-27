import { useState } from 'react';
import { LOCATIONS } from './gameData';
import styles from './WorldMap.module.css';

// Node positions on a 360×560 canvas
const NODE_POSITIONS = {
  tavern:        { x: 110, y: 55  },
  blacksmith:    { x: 250, y: 55  },
  village:       { x: 180, y: 130 },
  forest_edge:   { x: 180, y: 215 },
  ruined_shrine: { x: 68,  y: 305 },
  dark_wood:     { x: 280, y: 305 },
  sunken_dungeon:{ x: 180, y: 390 },
  ancient_ruins: { x: 180, y: 480 },
};

// Danger colour per location
const DANGER_COLOR = {
  village:        '#2ecc71',
  tavern:         '#2ecc71',
  blacksmith:     '#2ecc71',
  forest_edge:    '#f39c12',
  ruined_shrine:  '#e74c3c',
  dark_wood:      '#e74c3c',
  sunken_dungeon: '#e74c3c',
  ancient_ruins:  '#8e44ad',
};

// All connection pairs
const EDGES = [
  ['village',     'tavern'],
  ['village',     'blacksmith'],
  ['village',     'forest_edge'],
  ['forest_edge', 'dark_wood'],
  ['forest_edge', 'ruined_shrine'],
  ['dark_wood',   'sunken_dungeon'],
  ['dark_wood',   'ancient_ruins'],
  ['sunken_dungeon', 'ancient_ruins'],
];

export default function WorldMap({ player, visitedLocations, onTravel, onClose }) {
  const [hovered, setHovered] = useState(null);
  const current = player.location;
  const exits = LOCATIONS[current]?.exits || [];

  const isVisited   = (id) => visitedLocations.includes(id) || id === current;
  const isCurrent   = (id) => id === current;
  const isReachable = (id) => exits.includes(id);
  const hasBoss     = (id) => LOCATIONS[id]?.boss && !player.defeatedBosses.includes(LOCATIONS[id].boss);

  const handleNodeClick = (id) => {
    if (isCurrent(id)) return;
    if (!isReachable(id)) return;
    onTravel(id);
    onClose();
  };

  const hoveredLoc = hovered ? LOCATIONS[hovered] : null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.panel} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>🗺️ World Map</h2>
          <div className={styles.legend}>
            <span className={styles.legendItem} style={{ color: '#2ecc71' }}>● Safe</span>
            <span className={styles.legendItem} style={{ color: '#f39c12' }}>● Dangerous</span>
            <span className={styles.legendItem} style={{ color: '#e74c3c' }}>● Hostile</span>
            <span className={styles.legendItem} style={{ color: '#8e44ad' }}>● Boss</span>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div className={styles.mapWrap}>
          <svg viewBox="0 0 360 540" className={styles.svg} xmlns="http://www.w3.org/2000/svg">
            {/* Edges */}
            {EDGES.map(([a, b]) => {
              const pa = NODE_POSITIONS[a];
              const pb = NODE_POSITIONS[b];
              const bothVisited = isVisited(a) && isVisited(b);
              return (
                <line
                  key={`${a}-${b}`}
                  x1={pa.x} y1={pa.y}
                  x2={pb.x} y2={pb.y}
                  stroke={bothVisited ? 'rgba(201,168,76,0.35)' : 'rgba(255,255,255,0.07)'}
                  strokeWidth={bothVisited ? 1.5 : 1}
                  strokeDasharray={bothVisited ? 'none' : '4 4'}
                />
              );
            })}

            {/* Nodes */}
            {Object.keys(NODE_POSITIONS).map(id => {
              const pos    = NODE_POSITIONS[id];
              const loc    = LOCATIONS[id];
              const visited   = isVisited(id);
              const current_  = isCurrent(id);
              const reachable = isReachable(id);
              const color     = visited ? (DANGER_COLOR[id] || '#aaa') : 'rgba(255,255,255,0.15)';
              const isHov     = hovered === id;

              return (
                <g
                  key={id}
                  onClick={() => handleNodeClick(id)}
                  onMouseEnter={() => setHovered(id)}
                  onMouseLeave={() => setHovered(null)}
                  style={{ cursor: reachable && !current_ ? 'pointer' : current_ ? 'default' : 'not-allowed' }}
                >
                  {/* Pulse ring for current location */}
                  {current_ && (
                    <circle cx={pos.x} cy={pos.y} r={22} fill="none"
                      stroke="var(--gold)" strokeWidth={1.5}
                      className={styles.pulseRing}
                    />
                  )}

                  {/* Reachable highlight */}
                  {reachable && !current_ && (
                    <circle cx={pos.x} cy={pos.y} r={19}
                      fill={`${color}22`}
                      stroke={color}
                      strokeWidth={1}
                      strokeDasharray="3 3"
                      className={styles.reachableRing}
                    />
                  )}

                  {/* Node circle */}
                  <circle
                    cx={pos.x} cy={pos.y} r={16}
                    fill={visited ? `${color}22` : 'rgba(0,0,0,0.4)'}
                    stroke={current_ ? 'var(--gold)' : isHov && reachable ? color : visited ? `${color}88` : 'rgba(255,255,255,0.1)'}
                    strokeWidth={current_ ? 2.5 : isHov ? 2 : 1.5}
                  />

                  {/* Icon */}
                  <text x={pos.x} y={pos.y + 1} textAnchor="middle" dominantBaseline="middle"
                    fontSize={visited ? 14 : 12}
                    opacity={visited ? 1 : 0.3}
                  >
                    {visited ? loc.image : '❓'}
                  </text>

                  {/* Boss marker */}
                  {visited && hasBoss(id) && (
                    <text x={pos.x + 12} y={pos.y - 12} fontSize={10}>👑</text>
                  )}

                  {/* Location name */}
                  <text
                    x={pos.x} y={pos.y + 27}
                    textAnchor="middle"
                    fontSize={8.5}
                    fontFamily="'Cinzel', serif"
                    fill={current_ ? 'var(--gold)' : visited ? '#ccc' : 'rgba(255,255,255,0.2)'}
                    fontWeight={current_ ? '700' : '400'}
                  >
                    {visited ? (loc.name.length > 16 ? loc.name.slice(0, 14) + '…' : loc.name) : '???'}
                  </text>

                  {/* YOU ARE HERE */}
                  {current_ && (
                    <text x={pos.x} y={pos.y - 24} textAnchor="middle"
                      fontSize={7} fontFamily="'Cinzel', serif"
                      fill="var(--gold)" opacity={0.85}
                    >
                      ▼ YOU
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Tooltip */}
        <div className={styles.tooltip}>
          {hovered && hoveredLoc ? (
            <>
              <span className={styles.tooltipIcon}>{isVisited(hovered) ? hoveredLoc.image : '❓'}</span>
              <div>
                <div className={styles.tooltipName}>
                  {isVisited(hovered) ? hoveredLoc.name : 'Unknown Location'}
                </div>
                <div className={styles.tooltipHint}>
                  {isCurrent(hovered)
                    ? '📍 You are here'
                    : isReachable(hovered)
                    ? '👆 Click to travel here'
                    : isVisited(hovered)
                    ? '🚫 No direct path from here'
                    : '🔒 Not yet discovered'}
                </div>
              </div>
            </>
          ) : (
            <span className={styles.tooltipHint}>Hover a location to see details · Click reachable locations to travel</span>
          )}
        </div>
      </div>
    </div>
  );
}
