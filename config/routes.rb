Rails.application.routes.draw do
  resources :sites
  post "/edit_links", to: "welcome#edit_links"
  post "/all_links", to: "welcome#all_links"
  root "welcome#index"
end
