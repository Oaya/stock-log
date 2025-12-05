module Api
  class FriendsController < ApplicationController
    def show
      user = current_user
      friends = user.friends

      puts friends

      if friends.present?
        render json: friends
      else
        render json: [], status: :ok
      end
    end
  end
end
