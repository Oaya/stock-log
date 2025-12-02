class ApplicationController < ActionController::API
  rescue_from ActionController::InvalidAuthenticityToken, with: :handle_invalid_auth_token if defined?(ActionController::InvalidAuthenticityToken)
   before_action :authenticate_user!

  private

  def handle_invalid_auth_token
    render json: { error: "Invalid authenticity token" }, status: :unauthorized
  end
end
