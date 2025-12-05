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
          return render json: { error: stock.errors.full_messages.join(" ") },
                        status: :unprocessable_entity
        end
      end

      # stock exists OR was just created — now associate it with user
       UserStock.find_or_create_by(user: current_user, stock: stock)

      render json: stock, status: :ok
    end


    def delete_stock
      stock_id = params[:id]
      user_stock = UserStock.find_by(user_id: current_user.id, stock_id: stock_id)
      if user_stock && user_stock.destroy
        render json: { message: "Stock removed from portfolio" }, status: :ok
      else
        render json: { error: "Stock not found in portfolio" }, status: :not_found
      end
    end
  end
end