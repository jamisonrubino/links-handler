require 'json'
require 'open-uri'
require 'open_uri_redirections'
require 'openssl'
OpenSSL::SSL::VERIFY_PEER = OpenSSL::SSL::VERIFY_NONE

class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  # helper_method :add_new_sites, :preview_site, :reset_site

  def local_request?
    false
  end

  def add_new_sites
    @sites.each do |site|
      site_hash = {:author => "manual", :url => site, :css => "manual", :new => 1}
      s = Site.new(site_hash)
      s.save
    end
  end

  def preview_site
    if params[:url].present?
      url = params[:url]
      # @site_preview = open(url, :allow_redirections => :all).read
      # @site_preview.gsub!(/(src|href)="\//, "\\1=\"#{url[/(?<protocol>(http)s?:\/\/)(?<uri>[\w\d\.]+)/, "uri"]}")
      # @preview_path = ActionController::Base.helpers.asset_path('preview_site.html.erb')

      # File.open(@preview_path, "w"){|f| f << @site_preview}
      @site_preview_url = url
      respond_to do |format|
        format.js { render 'preview_site.js.erb' }
      end
    end
  end

  # def reset_site
  #   @preview_site = ActionController::Base.helpers.asset_path('preview_site.html')
  #   File.open(@preview_site, "w"){|f| f.truncate(0)}
  # end

  def save_site(site)
    sites_path = "app/assets/javascripts/sites_index.json"
    site_obj = { author: site.author, url: site.url, css: site.css }
    sites_obj = JSON.parse(File.read(sites_path))
    sites_obj << site_obj
    File.open(sites_path, "w") {|f| f.write(sites_obj.to_json)}
    puts "Updated sites_index.json: #{File.read(sites_path)}"
  end
end
