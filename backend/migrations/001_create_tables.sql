-- Created: 2026-01-07

-- stocks: stores stock price data (OHLCV)
CREATE TABLE IF NOT EXISTS stocks (
    id SERIAL PRIMARY KEY,
    symbol VARCHAR(10) NOT NULL,
    company_name VARCHAR(255),
    sector VARCHAR(50),
    industry VARCHAR(100),
    
    -- OHLCV Data
    open_price DECIMAL(12, 2) NOT NULL,
    high_price DECIMAL(12, 2) NOT NULL,
    low_price DECIMAL(12, 2) NOT NULL,
    close_price DECIMAL(12, 2) NOT NULL,
    volume BIGINT NOT NULL,
    
    -- Additional Data
    change DECIMAL(12, 2),
    change_percent DECIMAL(8, 4),
    
    -- Metadata
    date DATE NOT NULL,
    is_final BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(symbol, date)
);

-- sync_logs : tracks synchronization history
CREATE TABLE IF NOT EXISTS sync_logs (
    id SERIAL PRIMARY KEY,
    sync_type VARCHAR(50) NOT NULL,
    records_synced INTEGER DEFAULT 0,
    status VARCHAR(20) NOT NULL,
    error_message TEXT,
    synced_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_stocks_date ON stocks(date);
CREATE INDEX IF NOT EXISTS idx_stocks_symbol ON stocks(symbol);
CREATE INDEX IF NOT EXISTS idx_stocks_sector ON stocks(sector);
CREATE INDEX IF NOT EXISTS idx_stocks_updated_at ON stocks(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_sync_logs_synced_at ON sync_logs(synced_at DESC);

-- Comments
COMMENT ON TABLE stocks IS 'Stock price data with OHLCV information';
COMMENT ON TABLE sync_logs IS 'History of data synchronization operations';
COMMENT ON COLUMN stocks.is_final IS 'Indicates if data is final (after market close) or real-time';