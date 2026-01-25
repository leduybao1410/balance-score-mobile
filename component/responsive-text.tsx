import { Dimensions, StyleSheet } from 'react-native';

// Base width for scaling (iPhone 6/7/8)
const BASE_WIDTH = 375;

// Landscape scale factor for mobile phones (reduces font size in landscape)
const MOBILE_LANDSCAPE_SCALE = 0.85;

/**
 * Compute a scaled font size based on the screen width, with extra
 * multipliers for common tablet sizes (7" and 10") and mobile landscape.
 *
 * Heuristic:
 * - We estimate the screen diagonal in inches by using the logical
 *   pixel dimensions returned by React Native. On Android/iOS the
 *   ratio between logical pixels and dp/density cancels out when
 *   computing diagonal in inches using the 160 dpi baseline, so we
 *   can approximate inches as sqrt(w^2 + h^2) / 160.
 * - If diagonal >= 9" we treat as ~10" tablet, if >= 6.5" treat as ~7" tablet.
 * - For mobile landscape: use the shorter dimension (portrait width) as base
 *   to maintain consistent font sizes across orientations.
 */
const scaleFont = (size: number, width: number, height: number) => {
  // Detect tablet reliably using smallest dimension in dp (common Android/iOS breakpoint)
  // Many implementations treat devices with smallest width >= 600dp as tablets.
  const minDimension = Math.min(width, height);
  const isLandscape = width > height;
  const isTablet = minDimension >= 600;

  let scale: number;

  if (isTablet) {
    // Tablet scaling: use current width as base
    scale = width / BASE_WIDTH;

    if (minDimension >= 1000) {
      scale *= 0.55;
    } else if (minDimension >= 800) {
      // large tablet (e.g., full-size iPad) — use stronger scaling
      scale *= 0.5;
    } else {
      // small tablet / 7"-class devices
      scale *= 0.5;
    }
  } else if (isLandscape) {
    // Mobile landscape: use the shorter dimension (portrait width) as base
    // This keeps fonts consistent with portrait mode, slightly reduced for landscape readability
    scale = minDimension / BASE_WIDTH;
    scale *= MOBILE_LANDSCAPE_SCALE;
  } else {
    // Mobile portrait: base scale from width (original behaviour)
    scale = width / BASE_WIDTH;

    // Fallback: diagonal heuristic for larger phones / phablets
    // diagonalInches ~= sqrt(width_dp^2 + height_dp^2) / 160
    const diagonalInches = Math.sqrt(width * width + height * height) / 160;
    if (diagonalInches >= 9) {
      scale *= 1;
    } else if (diagonalInches >= 6.5) {
      scale *= 0.8;
    }
  }

  const scaled = Math.round(scale * size);

  // Clamp to reasonable bounds to avoid extremely small/large fonts
  const MIN = 6;
  const MAX = 64;
  return Math.min(Math.max(scaled, MIN), MAX);
};

/**
 * Returns a font size scaled to the device's screen size.
 * Automatically increases scale for 7" and 10" tablets.
 * @param fontSize The base font size to scale from.
 * @returns The scaled font size.
 */
export function ResponsiveFontSize(fontSize: number = 16): number {
  const { width, height } = Dimensions.get('screen');
  return scaleFont(fontSize, width, height);
}

export const myFontStyle = StyleSheet.create({
  extremelySmall: {
    fontSize: ResponsiveFontSize(8),
    lineHeight: ResponsiveFontSize(8) * 1.5,
  },
  superSmall: {
    fontSize: ResponsiveFontSize(10),
    lineHeight: ResponsiveFontSize(10) * 1.5,
  },
  extraSmall: {
    fontSize: ResponsiveFontSize(12),
    lineHeight: ResponsiveFontSize(12) * 1.5,
  },
  small: {
    fontSize: ResponsiveFontSize(14),
    lineHeight: ResponsiveFontSize(14) * 1.5,
  },
  normal: {
    fontSize: ResponsiveFontSize(16),
    lineHeight: ResponsiveFontSize(16) * 1.5,
  },
  large: {
    fontSize: ResponsiveFontSize(18),
    lineHeight: ResponsiveFontSize(18) * 1.5,
  },
  extraLarge: {
    fontSize: ResponsiveFontSize(20),
    lineHeight: ResponsiveFontSize(20) * 1.5,
  },
  superLarge: {
    fontSize: ResponsiveFontSize(22),
    lineHeight: ResponsiveFontSize(22) * 1.5,
  },
  extremelyLarge: {
    fontSize: ResponsiveFontSize(24),
    lineHeight: ResponsiveFontSize(24) * 1.5,
  },
});
