import React from 'react';
import Svg, { Circle, Line, Path, Polygon, Polyline, Rect } from 'react-native-svg';
import colors from '../../theme/colors';

/**
 * Props bắt buộc:
 * - name: tên biểu tượng.
 * Props tùy chọn: color, size, filled.
 */
function Icon({ name, color = colors.textSecondary, size = 24, filled = false }) {
  const common = {
    stroke: color,
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    fill: 'none',
  };

  const renderContent = () => {
    switch (name) {
      case 'home':
        return (
          <Path
            d="M3 10.2 12 3l9 7.2V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V10.2z"
            {...common}
          />
        );
      case 'book':
        return (
          <>
            <Path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15z" {...common} />
            <Line x1="8" y1="7" x2="16" y2="7" {...common} />
            <Line x1="8" y1="11" x2="14" y2="11" {...common} />
          </>
        );
      case 'calendar':
        return (
          <>
            <Rect x="3" y="5" width="18" height="16" rx="2" {...common} />
            <Line x1="16" y1="3" x2="16" y2="7" {...common} />
            <Line x1="8" y1="3" x2="8" y2="7" {...common} />
            <Line x1="3" y1="10" x2="21" y2="10" {...common} />
          </>
        );
      case 'calendar-check':
        return (
          <>
            <Rect x="3" y="5" width="18" height="16" rx="2" {...common} />
            <Line x1="16" y1="3" x2="16" y2="7" {...common} />
            <Line x1="8" y1="3" x2="8" y2="7" {...common} />
            <Line x1="3" y1="10" x2="21" y2="10" {...common} />
            <Path d="m9 15 2 2 4-4" {...common} />
          </>
        );
      case 'clipboard':
        return (
          <>
            <Path d="M9 4H7a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2" {...common} />
            <Rect x="9" y="2" width="6" height="4" rx="1" {...common} />
            <Line x1="8" y1="12" x2="16" y2="12" {...common} />
            <Line x1="8" y1="16" x2="13" y2="16" {...common} />
          </>
        );
      case 'person':
        return (
          <>
            <Circle cx="12" cy="8" r="4" {...common} />
            <Path d="M4 21a8 8 0 0 1 16 0" {...common} />
          </>
        );
      case 'user-check':
        return (
          <>
            <Circle cx="9" cy="7" r="4" {...common} />
            <Path d="M2 21v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2" {...common} />
            <Path d="m16 11 2 2 4-4" {...common} />
          </>
        );
      case 'chevron-right':
        return <Path d="m9 5 7 7-7 7" {...common} />;
      case 'plus':
        return (
          <>
            <Line x1="12" y1="5" x2="12" y2="19" {...common} />
            <Line x1="5" y1="12" x2="19" y2="12" {...common} />
          </>
        );
      case 'check':
        return <Path d="m5 12.5 4.5 4.5L19 7" {...common} />;
      case 'check-circle':
        return (
          <>
            <Circle
              cx="12"
              cy="12"
              r="9"
              fill={filled ? color : 'none'}
              stroke={color}
              strokeWidth="1.8"
            />
            <Path
              d="m8 12.4 2.6 2.6 5.4-5.4"
              fill="none"
              stroke={filled ? colors.white : color}
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        );
      case 'circle':
        return <Circle cx="12" cy="12" r="8.5" {...common} />;
      case 'refresh':
        return (
          <>
            <Path d="M20 11a8 8 0 1 0-2.3 6.4" {...common} />
            <Path d="M20 4v7h-7" {...common} />
          </>
        );
      case 'alert':
        return (
          <>
            <Circle cx="12" cy="12" r="9" {...common} />
            <Line x1="12" y1="7.5" x2="12" y2="13" {...common} />
            <Circle cx="12" cy="16.5" r="1" fill={color} stroke="none" />
          </>
        );
      case 'info':
        return (
          <>
            <Circle cx="12" cy="12" r="9" {...common} />
            <Line x1="12" y1="11" x2="12" y2="16.5" {...common} />
            <Circle cx="12" cy="7.5" r="1" fill={color} stroke="none" />
          </>
        );
      case 'search':
        return (
          <>
            <Circle cx="10.5" cy="10.5" r="6.5" {...common} />
            <Line x1="15.5" y1="15.5" x2="21" y2="21" {...common} />
          </>
        );
      case 'close':
        return (
          <>
            <Line x1="6" y1="6" x2="18" y2="18" {...common} />
            <Line x1="18" y1="6" x2="6" y2="18" {...common} />
          </>
        );
      case 'edit':
        return (
          <>
            <Path d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0-3-3L5 17v3z" {...common} />
            <Line x1="13" y1="7" x2="17" y2="11" {...common} />
          </>
        );
      case 'graduation':
        return (
          <>
            <Path d="m3 9 9-5 9 5-9 5-9-5z" {...common} />
            <Path d="M7 11v5c0 1.5 2.2 3 5 3s5-1.5 5-3v-5" {...common} />
          </>
        );
      case 'clock':
        return (
          <>
            <Circle cx="12" cy="12" r="9" {...common} />
            <Path d="M12 7v5l3.5 2" {...common} />
          </>
        );
      case 'map-pin':
        return (
          <>
            <Path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z" {...common} />
            <Circle cx="12" cy="10" r="2.5" {...common} />
          </>
        );
      case 'cloud-off':
        return (
          <>
            <Path d="M5 8.5A5 5 0 0 1 15 6a4 4 0 0 1 4 4 3.5 3.5 0 0 1-1 2.3" {...common} />
            <Path d="M3.5 5.5 20.5 20.5" {...common} />
            <Path d="M4 15a3.5 3.5 0 0 1 1-6.8" {...common} />
            <Path d="M7 19h9" {...common} />
          </>
        );
      case 'sync':
        return (
          <>
            <Path d="M4 7h13l-3-3" {...common} />
            <Path d="M20 17H7l3 3" {...common} />
            <Path d="M19 7a9 9 0 0 1 1 5" {...common} />
            <Path d="M5 17a9 9 0 0 1-1-5" {...common} />
          </>
        );
      case 'bell':
        return (
          <>
            <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" {...common} />
            <Path d="M13.73 21a2 2 0 0 1-3.46 0" {...common} />
          </>
        );
      case 'qr':
        return (
          <>
            <Rect x="3" y="3" width="7" height="7" rx="1" {...common} />
            <Rect x="14" y="3" width="7" height="7" rx="1" {...common} />
            <Rect x="14" y="14" width="7" height="7" rx="1" {...common} />
            <Rect x="3" y="14" width="7" height="7" rx="1" {...common} />
            <Rect x="6" y="6" width="1.5" height="1.5" fill={color} stroke="none" />
            <Rect x="17" y="6" width="1.5" height="1.5" fill={color} stroke="none" />
            <Rect x="6" y="17" width="1.5" height="1.5" fill={color} stroke="none" />
          </>
        );
      case 'barcode':
        return (
          <>
            <Line x1="3" y1="5" x2="3" y2="19" {...common} />
            <Line x1="6" y1="5" x2="6" y2="19" {...common} />
            <Line x1="10" y1="5" x2="10" y2="19" {...common} />
            <Line x1="13" y1="5" x2="13" y2="19" {...common} />
            <Line x1="17" y1="5" x2="17" y2="19" {...common} />
            <Line x1="21" y1="5" x2="21" y2="19" {...common} />
          </>
        );
      case 'verified':
      case 'shield':
        return (
          <>
            <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" {...common} />
            <Path d="m9 12 2 2 4-4" {...common} />
          </>
        );
      case 'exam':
      case 'file-text':
        return (
          <>
            <Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" {...common} />
            <Polyline points="14 2 14 8 20 8" {...common} />
            <Line x1="16" y1="13" x2="8" y2="13" {...common} />
            <Line x1="16" y1="17" x2="8" y2="17" {...common} />
            <Polyline points="10 9 9 9 8 9" {...common} />
          </>
        );
      case 'training':
      case 'star':
        return (
          <Polygon
            points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
            {...common}
            fill={filled ? color : 'none'}
          />
        );
      case 'tuition':
        return (
          <>
            <Rect x="2" y="5" width="20" height="14" rx="2" {...common} />
            <Line x1="2" y1="10" x2="22" y2="10" {...common} />
            <Line x1="6" y1="15" x2="10" y2="15" {...common} />
          </>
        );
      case 'survey':
        return (
          <>
            <Path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" {...common} />
            <Rect x="8" y="2" width="8" height="4" rx="1" {...common} />
            <Line x1="9" y1="12" x2="15" y2="12" {...common} />
            <Line x1="9" y1="16" x2="13" y2="16" {...common} />
          </>
        );
      case 'onestop':
        return (
          <>
            <Path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" {...common} />
            <Path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" {...common} />
          </>
        );
      case 'news':
        return (
          <>
            <Path d="M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4" {...common} />
            <Path d="M14 2v4a2 2 0 0 0 2 2h4" {...common} />
            <Rect x="2" y="12" width="10" height="6" rx="1" {...common} />
          </>
        );
      case 'building':
        return (
          <>
            <Line x1="3" y1="21" x2="21" y2="21" {...common} />
            <Line x1="6" y1="18" x2="6" y2="11" {...common} />
            <Line x1="10" y1="18" x2="10" y2="11" {...common} />
            <Line x1="14" y1="18" x2="14" y2="11" {...common} />
            <Line x1="18" y1="18" x2="18" y2="11" {...common} />
            <Polygon points="12 2 20 7 4 7" {...common} />
          </>
        );
      case 'mail':
        return (
          <>
            <Path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" {...common} />
            <Polyline points="22,6 12,13 2,6" {...common} />
          </>
        );
      case 'phone':
        return (
          <Path
            d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
            {...common}
          />
        );
      case 'award':
        return (
          <>
            <Path d="M6 9H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2M18 9h2a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-2" {...common} />
            <Path d="M4 3h16v7a8 8 0 0 1-16 0V3z" {...common} />
            <Path d="M12 18v3M8 21h8" {...common} />
          </>
        );
      case 'trending-up':
        return (
          <>
            <Polyline points="22 7 13.5 15.5 8.5 10.5 2 17" {...common} />
            <Polyline points="16 7 22 7 22 13" {...common} />
          </>
        );
      case 'send':
        return (
          <>
            <Line x1="22" y1="2" x2="11" y2="13" {...common} />
            <Polygon points="22 2 15 22 11 13 2 9 22 2" {...common} />
          </>
        );
      case 'filter':
        return (
          <Polygon
            points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"
            {...common}
          />
        );
      case 'sparkles':
        return (
          <>
            <Path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z" {...common} />
            <Path d="M5 3v4M3 5h4" {...common} />
          </>
        );
      default:
        return <Circle cx="12" cy="12" r="8.5" {...common} />;
    }
  };

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {renderContent()}
    </Svg>
  );
}

export default Icon;
