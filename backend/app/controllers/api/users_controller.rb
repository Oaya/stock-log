module Api
  class UsersController < ApplicationController

    def me
      if current_user
        render json: current_user, status: :ok
      else
        render json: { error: "User not found" }, status: :not_found
      end
   
    end
  end
end