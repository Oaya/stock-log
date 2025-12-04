class Stock < ApplicationRecord
  has_many :user_stocks, dependent: :destroy
  has_many :users, through: :user_stocks

  validates :ticker, :name, presence: true, uniqueness: true

  # Create a new Stock instance by looking up data from the Finnhub API
  def self.new_lookup(ticker_symbol)
    finnhub_client = FinnhubRuby::DefaultApi.new

    # Fetch quote data for the given ticker symbol current price
    price = finnhub_client.quote(ticker_symbol)
    company = finnhub_client.company_profile2({ symbol: ticker_symbol })

    new(ticker: ticker_symbol, name: company["name"], last_price: price["c"])
  end

  def self.check_db(ticker_symbol)
    where(ticker: ticker_symbol).first
  end
end
