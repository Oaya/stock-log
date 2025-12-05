class Users::RegistrationsController < Devise::RegistrationsController
  respond_to :json

  private

  def respond_with(resource, _opts = {})
    if resource.persisted?
      render json: {
        user: {
          id: resource.id,
          email: resource.email,
          first_name: resource.first_name,
          last_name: resource.last_name
        }
      }, status: :created
    else
      render json: { errors: resource.errors.full_messages.join(" ") }, status: :unprocessable_entity
    end
  end
end
