Rails.application.routes.draw do
  resources :sites
  post '/update_site', to: "sites#update"
  post '/update_new_site', to: "sites#update_new"
  get '/new_sites', to: "sites#new_sites"
  post '/add_new_sites', to: "sites#add_new_sites"
  post '/save_sites_backup', to: "sites#save_sites_backup"
  post '/load_sites_backup', to: "sites#load_sites_backup"
  get '/preview_site', to: "application#preview_site"
  get '/reset_site', to: "application#reset_site"
  # get '/link_preview_site', to: "links#preview_site"
  # get '/link_reset_site', to: "links#reset_site"
  post "/edit_links", to: "links#edit_links"
  post "/all_links", to: "links#all_links"
  root "links#index"
end
