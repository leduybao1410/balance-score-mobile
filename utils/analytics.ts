import { Platform } from 'react-native';

/**
 * Firebase Analytics helper. Safe to call on web (no-op).
 * Event names: 1–40 chars, alphanumeric + underscore.
 */

import Analytics from '@react-native-firebase/analytics';

function getAnalytics() {
  if (Platform.OS === 'web') return null;
  return Analytics();
}

/** Log a screen view (Firebase standard event). */
export function logScreenView(screenName: string, screenClass?: string): void {
  const a = getAnalytics();
  if (!a) return;
  a.logScreenView({ screen_name: screenName, screen_class: screenClass ?? screenName }).catch(() => { });
}

/** Log a custom event with optional params (keys/values must be string or number). */
export function logEvent(name: string, params?: Record<string, string | number | boolean>): void {
  const a = getAnalytics();
  if (!a) {
    console.warn('[Analytics] Analytics not available (web platform or Firebase not initialized)');
    return;
  }

  // Convert boolean values to strings (Firebase Analytics doesn't accept booleans)
  const sanitizedParams = params
    ? Object.entries(params).reduce((acc, [key, value]) => {
      acc[key] = typeof value === 'boolean' ? String(value) : value;
      return acc;
    }, {} as Record<string, string | number>)
    : undefined;

  console.log('[Analytics] Logging event:', name, sanitizedParams);

  a.logEvent(name, sanitizedParams)
    .then(() => {
      console.log('[Analytics] Event logged successfully:', name);
    })
    .catch((error) => {
      console.error('[Analytics] Failed to log event:', name, error);
    });
}

/** App event names for Balance Score Board */
export const AnalyticsEvents = {
  screenView: 'screen_view',
  viewGameHistory: 'view_game_history',
  deleteGameHistory: 'delete_game_history',
  clearAllHistory: 'clear_all_history',
  addPlayer: 'add_player',
  shareScore: 'share_score',
  openSettings: 'open_settings',
  startGame: 'start_game',
  exitGame: 'exit_game',
  showSummary: 'show_summary',
  showRanking: 'show_ranking',
  next_set: 'next_set',
  test_event: 'test_event',
  modify_button: 'modify_button',
  reset_zero_point: 'reset_zero_point',
  choose_starting_score: 'choose_starting_score',
  mode_free: 'mode_free',
  mode_with_host: 'mode_with_host',
  mode_winner_takes_all: 'mode_winner_takes_all',
} as const;
