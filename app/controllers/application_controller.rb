require 'json'
class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  def local_request?
    false
  end

  helper_method :add_new_sites

  def add_new_sites
    @sites.each do |site|
      site_hash = {:author => "manual", :url => site, :css => "manual", :new => 1}
      s = Site.new(site_hash)
      s.save
    end
  end

  def save_site(site)
    sites_path = "app/assets/javascripts/sites_index.json"
    site_obj = { author: site.author, url: site.url, css: site.css }
    sites_obj = JSON.parse(File.read(sites_path))
    sites_obj << site_obj
    File.open(sites_path, "w") {|f| f.write(sites_obj.to_json)}
    puts "Updated sites_index.json: #{File.read(sites_path)}"
  end
end
