class User < ApplicationRecord
  has_many :user_stocks, dependent: :destroy
  has_many :stocks, through: :user_stocks
  has_many :friendships
  has_many :friends, through: :friendships

  devise :database_authenticatable,
         :registerable,
         :recoverable,
         :rememberable,
         :validatable,
         :jwt_authenticatable,
         jwt_revocation_strategy: Devise::JWT::RevocationStrategies::Null
end
