/**
 * Application constants
 */

// Sync intervals (in minutes)
export const SYNC_INTERVALS = [
    { label: '5 minutes', value: 5 },
    { label: '10 minutes', value: 10 },
    { label: '15 minutes', value: 15 },
    { label: '30 minutes', value: 30 },
];

// Default sync interval
export const DEFAULT_SYNC_INTERVAL = 5;

// Dashboard auto-refresh interval (in milliseconds)
export const DASHBOARD_REFRESH_INTERVAL = 30000; // 30 seconds

// Sectors (for filtering)
export const SECTORS = [
    'All',
    'Technology',
    'Healthcare',
    'Financial Services',
    'Energy',
    'Consumer Cyclical',
    'Industrials',
    'Communication Services',
];

// Table page sizes
export const PAGE_SIZES = [10, 25, 50, 100];

// Default page size
export const DEFAULT_PAGE_SIZE = 50;

// Success checkmark display duration (in milliseconds)
export const SUCCESS_DISPLAY_DURATION = 2500; // 2.5 seconds

// Toast auto-dismiss duration
export const TOAST_DURATION = 5000; // 5 seconds

// Stock ticker animation duration (in seconds)
export const TICKER_ANIMATION_DURATION = 30;

// Date range defaults (1 month)
export const DEFAULT_DATE_RANGE_DAYS = 30;