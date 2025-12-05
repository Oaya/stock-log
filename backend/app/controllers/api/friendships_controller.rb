module Api
  class FriendshipsController < ApplicationController
    def create
      friend = User.find(params[:id])
      puts friend

      friendship = current_user.friendships.build(friend_id: friend.id)
      if friendship.save
        render json: friend, status: :ok
      else
        render json: { error: friendship.errors.full_messages.join(" ") }

      end
    end
  end
end
