module Api
  class StocksController < ApplicationController

    def search
      stock = Stock.new_lookup(params[:stock].upcase)

      if stock.name.present?
        render json: stock
      else
        render json: { error: "Stock not found" }, status: :not_found
      end
    end
  end
end
