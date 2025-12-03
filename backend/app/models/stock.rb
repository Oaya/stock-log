class Stock < ApplicationRecord

  def self.new_lookup(ticker_symbol)
    finnhub_client = FinnhubRuby::DefaultApi.new

    # Fetch quote data for the given ticker symbol current price
    finnhub_client.quote(ticker_symbol).c
  end
end
