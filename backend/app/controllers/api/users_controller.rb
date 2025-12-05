

module Api
  class UsersController < ApplicationController
    def me
      if current_user
        render json: current_user, status: :ok
      else
        render json: { error: "User not found" }, status: :not_found
      end
    end

    def my_friends
        user = current_user
        friends = user.friends

        puts friends

        if friends.present?
          render json: friends
        else
          render json: [], status: :ok
        end
    end


    def search
      #convert params string and remove tails and leading spaces
      query = params[:q].to_s.strip

      if query.blank?
        render json: [], status: :ok and return
      end

      downcased = "%#{query.downcase}%"

      users = User.where(
        "LOWER(email) LIKE :q OR LOWER(first_name) LIKE :q OR LOWER(last_name) LIKE :q",
        q: downcased
      )
      render json: users.as_json(only: [:id, :email, :first_name, :last_name])

    end
  end
end