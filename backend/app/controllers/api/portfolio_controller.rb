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
  end
end