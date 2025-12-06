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
    get "me", to: "users#me"
    get "stocks/search", to: "stocks#search"
    
    get "portfolio", to: "portfolio#show"
    post "portfolio/stock/:ticker", to: "portfolio#add_stock"
    delete "portfolio/stock/:id", to: "portfolio#delete_stock"

    get "friends", to: "users#my_friends" 
    get "users/search/", to: "users#search"
    post "user/friend/:id", to: "friendships#create"
    delete "user/friend/:id", to: "friendships#destroy"
  end
end
