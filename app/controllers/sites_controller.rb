class SitesController < ApplicationController
  before_action :set_site, only: [:show, :edit, :update, :destroy]

  def add_dump
    @sites = JSON.parse(File.read("app/assets/javascripts/sites_index.json"))
    @sites.each do |site|
      begin
        s = Site.new(site)
        s.save
      rescue
        puts "Something went wrong with creating site: #{site}"
      end
    end
  end

  def index
    @sites = Site.all
  end

  def new_sites
    @sites = Site.where(new: 1)
  end

  def add_new_sites
    add_new_sites
    redirect_to sites_path
  end

  def show
  end

  def new
    @site = Site.new
  end

  def edit
  end

  def create
    @site = Site.new(site_params)

    respond_to do |format|
      if @site.save
        format.html { redirect_to @site, notice: 'Site was successfully created.' }
        format.json { render :show, status: :created, location: @site }
      else
        format.html { render :new }
        format.json { render json: @site.errors, status: :unprocessable_entity }
      end
    end
  end

  def update
    respond_to do |format|
      if @site.update(site_params)
        format.html { redirect_to @site, notice: 'Site was successfully updated.' }
        format.js {}
        format.json { render :show, status: :ok, location: @site }
      else
        format.html { render :edit }
        format.json { render json: @site.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @site.destroy
    respond_to do |format|
      format.html { redirect_to sites_url, notice: 'Site was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  def save_sites_backup
    file = "app/assets/javascripts/sites_index_backup_"
    backup = []
    begin
      backup_1 = File.read("#{file}1.json")
      File.open("#{file}2.json", "w"){|f| f.write(backup_1)}
      Site.all.each { |site| backup << {author: site.author, url: site.url, css: site.css} }
      backup.sort! { |a, b|  a[:author] <=> b[:author] }
      backup.unshift({:date => Time.now})
      puts "#{backup}"
      File.open("#{file}1.json", "w"){|f| f.write(backup.to_json)}
      notice = "Sites backup saved successfully."
    rescue
      notice = "Error writing sites to file."
    end
    redirect_to sites_path, notice: notice
  end

  def load_sites_backup
    backup_version = params[:backup_version]
    file = "app/assets/javascripts/sites_index_backup_#{backup_version}.json"
    begin
      @sites = JSON.parse(File.read(file))
      date = @sites.slice!(0)
      Site.delete_all
      Site.create(@sites)
      notice = "Sites backup #{backup_version} loaded successfully."
    rescue
      notice = "Error opening backup file, clearing database or restoring backup."
    end
    redirect_to sites_path, notice: notice
  end

  private
    def set_site
      @site = Site.find(params[:id])
    end

    def site_params
      params.require(:site).permit(:author, :url, :css, :new, :index)
    end
end
