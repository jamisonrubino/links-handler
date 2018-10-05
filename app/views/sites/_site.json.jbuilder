json.extract! site, :id, :author, :url, :css, :created_at, :updated_at
json.url site_url(site, format: :json)
