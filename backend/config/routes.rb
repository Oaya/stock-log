Rails.application.routes.draw do
  resources :user_stocks
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
    get "portfolio", to: "portfolio#show"
    post "portfolio/add_stock", to: "portfolio#add_stock"
    delete "portfolio/delete_stock", to: "portfolio#delete_stock"
  end
end
