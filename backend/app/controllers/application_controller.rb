class ApplicationController < ActionController::API
  rescue_from ActionController::InvalidAuthenticityToken, with: :handle_invalid_auth_token if defined?(ActionController::InvalidAuthenticityToken)
  before_action :authenticate_user!
  before_action :configure_permitted_parameters, if: :devise_controller?

  private

  def handle_invalid_auth_token
    render json: { error: "Invalid authenticity token" }, status: :unauthorized
  end


  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [ :first_name, :last_name ])
    devise_parameter_sanitizer.permit(:account_update, keys: [ :first_name, :last_name ])
  end
end