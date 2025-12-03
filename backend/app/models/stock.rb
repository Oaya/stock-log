class Stock < ApplicationRecord

  # Create a new Stock instance by looking up data from the Finnhub API
  def self.new_lookup(ticker_symbol)
    finnhub_client = FinnhubRuby::DefaultApi.new

    # Fetch quote data for the given ticker symbol current price
    price = finnhub_client.quote(ticker_symbol)
    company = finnhub_client.company_profile2({ symbol: ticker_symbol })

    new(ticker: ticker_symbol, name: company["name"], last_price: price["c"])
  end
end
