require 'nokogiri'
require 'open-uri'
require 'open_uri_redirections'

require_relative 'sites_controller'

class LinksController < ApplicationController
  def index
    $new_sites = nil
  end

  def edit_links
    all_links = params[:links].gsub "\r", ""
    file = "app/assets/javascripts/sites_index.json"
    site_index = JSON.parse(File.read(file))
    @new_sites = []
    categorized_links = objectify_links(all_links)

    @converted_links = convert_links(categorized_links)
    $converted_links = @converted_links

    if @new_sites.size > 0
      @new_sites.each_with_index do |x,i|
        site_str = "#{x}"
        site_str << "\n" if (i < @new_sites.size-1)
        (@new_sites_html ||= "") << site_str
      end
    end
    $sites = @new_sites
  end

  def all_links
    @converted_links = $converted_links
    process_links
    $converted_links = nil
    if $sites.present? && $sites.size > 0
      @sites = $sites
      begin
        sites = $sites.join "\n"
        SitesMailer.new_sites_email(sites).deliver_now
        # File.write("app/assets/javascripts/sites_index.json", $new_sites, mode: 'a')
        puts "New sites email sent."
        add_new_sites
        puts "added sites"
        # redirect_to "/add_new_sites", sites: $new_sites and return
      rescue
        puts "Something went wrong with SitesMailer"
      end
    end

  end

  private
    def objectify_links(all, categorized_links = [])
      all.split(/\n{4,}/).each_with_index do |section, i|
        section.split(/\n+/).each_with_index do |line, j|
          ((categorized_links[i] ||= {})['links'] ||= []).push(line.split(/\s+/)[0].strip) if (line.strip[0..3] == "http" || !line.strip[/(http)?s?(\:\/\/)?\w+\.+\w+.*/].nil?)
          puts line.strip[/(http)?s?(\:\/\/)?\w+\.+\w+.*/]
          (categorized_links[i] ||= {})['section'] = line.strip if ((line.strip[0..3] != "http" && line.strip[/(http)?s?(\:\/\/)?\w+\.+\w+.*/].nil?) && line.size > 2)
        end
      end
      puts categorized_links
      categorized_links
    end


    def convert_links(categorized_links)
      converted_links = []

      categorized_links.each_with_index do |l, i|
        converted_links[i] = {}
        converted_links[i]['links'] = []
        converted_links[i]['section'] = l['section']
        puts "l: #{l}"
        l['links'].each_with_index do |url, q|
          site_details = check_site_index(url)
          puts "site details in convert links: #{site_details}"
          converted_links[i]['links'][q] = {}
          converted_links[i]['links'][q]['url'] = url
          if !site_details.nil?
            unless site_details[:css] == "manual"
              puts url
              begin
                doc = Nokogiri::HTML(open(url, :allow_redirections => :all))
                # doc = Nokogiri::HTML(open("app/bloomberg.html"))
                title_arr = doc.css(site_details[:css])
                title = []
                if title_arr.nil? || title_arr.first.nil?
                  title_arr = doc.css("head title")
                  if title_arr.nil? || title_arr.first.nil?
                    converted_links[i]['links'][q]['placeholder'] = "manual"
                    converted_links[i]['links'][q]['title'] = "manual"
                    converted_links[i]['links'][q]['author'] = "manual"
                    converted_links[i]['links'][q]['url'] = url
                    next
                  end
                end
                title_arr = title_arr.first.content.split(/[[:space:]]/)
                converted_links[i]['links'][q]['title'] = title_arr.map{|w| w==title_arr[0] ? w : w.downcase}.join(" ")
                converted_links[i]['links'][q]['author'] = site_details[:author]
              rescue OpenURI::HTTPError => e
                puts e.message
                converted_links[i]['links'][q]['title'] = e.message
                converted_links[i]['links'][q]['author'] = e.message
              end
            else
              converted_links[i]['links'][q]['author'] = site_details[:author]
              converted_links[i]['links'][q]['title'] = "manual"
            end
          else
            puts url
            begin
              doc = Nokogiri::HTML(open(url, :allow_redirections => :all))
              # doc = Nokogiri::HTML(open("app/bloomberg.html"))
              title = []
              title_arr = doc.css("head title")
              if title_arr.nil? || title_arr.first.nil?
                converted_links[i]['links'][q]['title'] = " "
                converted_links[i]['links'][q]['author'] = " "
                converted_links[i]['links'][q]['placeholder'] = "manual"
                next
              end
              title_arr = doc.css("head title").first.content.split(/[[:space:]]/)
              converted_links[i]['links'][q]['placeholder'] = title_arr.map{|w| w==title_arr[0] ? w : w.downcase}.join(" ")
              converted_links[i]['links'][q]['author'] = "manual"
              converted_links[i]['links'][q]['title'] = "manual"
            rescue OpenURI::HTTPError => e
              puts e.message
              converted_links[i]['links'][q]['title'] = e.message
              converted_links[i]['links'][q]['author'] = e.message
            end
          end
        end
      end
      converted_links
    end



    # needs obj array for common sites' info
    def check_site_index(url)
      site_match = Site.where("url like ?", "%#{url[/(http)s?:\/\/(?<uri>[\w\d\.]+)/, "uri"]}%")
      if site_match.size == 0
        @new_sites << url
        return nil
      end
      return site_match[0]
    end

    def process_links
      @converted_links.size.times do |i| # for each section
        if params["#{i}"]
          puts params["#{i}"]
          @converted_links[i]["links"].size.times do |j|
            if params["#{i}"]["#{j}"]
              puts params["#{i}"]["#{j}"]
              del_arr = []
              @converted_links[i]["links"][j]["title"].split(" ").size.times do |x|
                puts "i: #{i.to_s}, j: #{j.to_s}, x: #{x.to_s}"
                if params["#{i}"]["#{j}"]["#{x}"]
                  word_param = params["#{i}"]["#{j}"]["#{x}"]
                  if word_param == ["uc"]
                    title = @converted_links[i]["links"][j]['title'].split(" ")
                    title[x].upcase!
                    @converted_links[i]["links"][j]['title'] = title.join(" ")
                  elsif word_param == ["dc"]
                    title = @converted_links[i]["links"][j]['title'].split(" ")
                    title[x].downcase!
                    @converted_links[i]["links"][j]['title'] = title.join(" ")
                  elsif word_param == ["tc"]
                    title = @converted_links[i]["links"][j]['title'].split(" ")
                    title[x].capitalize!
                    @converted_links[i]["links"][j]['title'] = title.join(" ")
                  elsif word_param == ["del"]
                    del_arr << x
                  end
                end
              end
              title = @converted_links[i]["links"][j]['title'].split(" ")
              title.delete_if.with_index { |_, index| del_arr.include? index }
              @converted_links[i]["links"][j]['title'] = title.join(" ")
            end
          end
          if params["f#{i}"]
            params["f#{i}"].each do |flag|
              @converted_links[i]["links"][flag[0].to_i]["flagged"] = "flagged"
            end
          end
        end

     # if author and title manually entered
        if params["author#{i}"]
          @converted_links[i]["links"].size.times do |j|
            if params["author#{i}"]["#{j}"]
              @converted_links[i]["links"][j]['author'] = params["author#{i}"]["#{j}"] if params["author#{i}"]["#{j}"].size > 0
            end
          end
        end
        if params["title#{i}"]
          @converted_links[i]["links"].size.times do |j|
            if params["title#{i}"]["#{j}"]
              @converted_links[i]["links"][j]['title'] = params["title#{i}"]["#{j}"] if params["title#{i}"]["#{j}"].size > 0
            end
          end
        end
      end

      date = Time.now.getlocal('-01:00').strftime("%_m/%d")
      @html_links = []
      @converted_links.each_with_index do |s, i|
        @html_links[i] = {}
        @html_links[i]['section'] = s['section']
        @html_links[i]['links'] = []
        s['links'].each_with_index do |l, j|
          @html_links[i]['links'] << "#{date}" + (date.size>5 ? "&nbsp;&nbsp;" : "&nbsp;&nbsp;&nbsp;&nbsp;") + "<a href='" + l['url'] + "' target='_blank'>" + (l['title'].nil? ? "" : l['title']) + "</a> – " + (l['author'].nil? ? "" : l['author'])
        end
      end
    end
end
