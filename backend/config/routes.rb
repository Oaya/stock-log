Rails.application.routes.draw do
  # Devise routes for JSON API
  devise_for :users,
             defaults: { format: :json },
             controllers: {
               sessions: "users/sessions",
               registrations: "users/registrations"
             }

  # Your API routes
  namespace :api do
    get "stocks/search", to: "stocks#search"
  end
end
