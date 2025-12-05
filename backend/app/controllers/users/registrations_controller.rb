class Users::RegistrationsController < Devise::RegistrationsController
  respond_to :json

  def update
    resource = current_user

    if update_resource(resource, account_update_params)
      render json: {
        user: {
          id: resource.id,
          email: resource.email,
          first_name: resource.first_name,
          last_name: resource.last_name
        }
      }, status: :ok
    else
      render json: { error: resource.errors.full_messages.join(" ") },
             status: :unprocessable_entity
    end
  end

  protected

  def update_resource(resource, params)
    # Devise will:
    # - check current_password
    # - if invalid → resource.errors["current_password"] and returns false
    resource.update_with_password(params)
  end

  private

  def account_update_params
    params.require(:user).permit(
      :email,
      :first_name,
      :last_name,
      :password,
      :password_confirmation,
      :current_password
    )
  end

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
      render json: { errors: resource.errors.full_messages.join(" ") },
             status: :unprocessable_entity
    end
  end
end
