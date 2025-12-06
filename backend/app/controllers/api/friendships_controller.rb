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



    def destroy
      friend_id = params[:id]

      friendship = Friendship.find_by(
        user_id: current_user.id,
        friend_id: friend_id
      )

      if friendship.nil?
        render json: { error: "Friendship not found" }, status: :not_found
        return
      end

      if friendship.destroy
        render json: { message: "User removed from friendship" }, status: :ok
      else
        render json: {
          error: friendship.errors.full_messages.join(" ")
        }, status: :unprocessable_entity
      end
    end
  end
end
