module Api
  class PortfolioController < ApplicationController
    def show
      user = current_user
      stocks = user.stocks

      puts stocks
      if stocks.present?
        render json: stocks
      else
       render json: [], status: :ok
      end
    end


    def add_stock
      ticker = params[:ticker].to_s.upcase
      puts "Ticker received: #{ticker}"
      stock = Stock.check_db(ticker)

      puts "Stock found in DB: #{stock.inspect}"

      if stock.nil?
        stock = Stock.new_lookup(ticker)

        unless stock.save
          return render json: { errors: stock.errors.full_messages.join(" ") },
                        status: :unprocessable_entity
        end
      end

      # stock exists OR was just created — now associate it with user
       UserStock.find_or_create_by(user: current_user, stock: stock)

      render json: stock, status: :ok
    end
  end
end