require 'nokogiri'
require 'open-uri'
class WelcomeController < ApplicationController
  def index
  end
  
  def edit_links
    all = params[:links].split("\r\n\r\n\r\n\r\n\r\n")
    
    sections = []
    all.each_with_index do |s, i|
      sections[i] = s.split("\n")
    end
    categorized_links = objectify_links(sections)
    puts categorized_links
    
    @converted_links = convert_links(categorized_links)
    $converted_links = @converted_links
  end

  def all_links
    @converted_links = $converted_links
    puts "converted_links: #{@converted_links}"
    puts params["0"]
    puts params["1"]
    
    @converted_links.size.times do |i| # for each section
      if params[i.to_s]
        @converted_links[i]["links"].size.times do |j|
          if params[i.to_s[j.to_s]]
            @converted_links[i]["links"][j]["title"].split(" ").size.times do |x|
              puts "i: #{i.to_s}, j: #{j.to_s}, x: #{x.to_s}"
              if params[i.to_s[j.to_s[x.to_s]]]
                word_param = params[i.to_s[j.to_s[x.to_s]]]
                if word_param == ["uc"]
                  title = @converted_links[i]["links"][j]['title'].split(" ")
                  title[x].upcase!
                @converted_links[i]["links"][j]['title'] = title.join(" ")
                elsif word_param == ["dc"]
                  title = @converted_links[i]["links"][j]['title'].split(" ")
                  title[x].downcase!
                  @converted_links[i]["links"][j]['title'] = title.join(" ")
                elsif word_param.first == ["tc"]
                  title = @converted_links[i]["links"][j]['title'].split(" ")
                  title[x].capitalize!
                  @converted_links[i]["links"][j]['title'] = title.join(" ")
                elsif word_param.first == ["del"]
                  title = @converted_links[i]["links"][j]['title'].split(" ")
                  title.delete_at(x)
                  @converted_links[i]["links"][j]['title'] = title.join(" ")
                end
              end
            end
          end
        end
        if params["f#{i}"]
          params["f#{i}"].each do |flag|
            @converted_links[i]["links"][flag[0].to_i]["flagged"] = "flagged"
          end
        end
      end
      @converted_links
    end
    # puts @converted_links
    
  end

  
  
  
  
  
  private
  
    def find_section_title(sections, i)
      sections[i].each_with_index do |s, q|
        s = s.strip
        unless s.size < 3
          return s
        end
      end
    end
    
    def objectify_links(sections)
      categorized_links = []
      sections.each_with_index do |s, i|
        categorized_links[i] = {}
        section_title = find_section_title(sections, i)
        categorized_links[i]['section'] = section_title
        s.map do |l|
          link = l.strip
          if link[0..3] == "http"
            unless categorized_links[i]['links'].nil?
              categorized_links[i]['links'] << link
            else
              categorized_links[i]['links'] = []
              categorized_links[i]['links'] << link
            end
          end
        end
      end
      categorized_links
    end
    
    # still needs site_details to work
    def convert_links(categorized_links)
      all_site_details = []
      converted_links = []
  
      categorized_links.each_with_index do |l, i|
        converted_links[i] = {}
        converted_links[i]['links'] = []
        converted_links[i]['section'] = categorized_links[i]['section']
        l["links"].each_with_index do |url, q|
          site_details = check_site_index(url)
          converted_links[i]['links'][q] = {}
          if !site_details.nil?
            unless site_details[:css] == "manual"
              puts url
              doc = Nokogiri::HTML(open(url))
              # puts doc.css(site_details[:css]).first.content.strip
              title = []
              title_arr = doc.css(site_details[:css])
              if title_arr.nil?
                title_arr = doc.css("head title")
              end
              title_arr = title_arr.first.content.split /[[:space:]]/
              title_arr.map{|w| w==title_arr[0] ? title << w : title << w.downcase}
              converted_links[i]['links'][q]['title'] = title.join(" ")
              converted_links[i]['links'][q]['author'] = site_details[:author]
            else
              converted_links[i]['links'][q]['author'] = site_details[:author]
              converted_links[i]['links'][q]['title'] = "manual"
            end
          else
            converted_links[i]['links'][q]['exception'] = "No matching site in database, or URL-related error."
            converted_links[i]['links'][q]['author'] = "manual"
            converted_links[i]['links'][q]['title'] = "manual"
            puts url
            doc = Nokogiri::HTML(open(url))
            converted_links[i]['links'][q]['placeholder'] = doc.css("head title").first.content
          end
          converted_links[i]['links'][q]['url'] = url
        end
      end
      converted_links
    end
    
    
    
    # needs obj array for common sites' info
    def check_site_index(url)
      site_index = [{"author": "Bloomberg", "url": "http://www.bloomberg.com", "css": "h1[class$=hed]"}, {"author": "Daily Reckoning", "url": "http://www.dailyreckoning.com", "css": "#single-article-body h1"}, {"author": "Zero Hedge", "url": "http://www.zerohedge.com", "css": ".article-list .title"}, {"author": "Real Investment Advice", "url": "http://www.realinvestmentadvice.com", "css": ".cont-text h1 a"}, {"author": "321Gold", "url": "http://www.321gold.com", "css": "h3"}, {"author": "Capitalist Exploits", "url": "http://www.capitalistexploits.at", "css": "h1.entry-title"}, {"author": "Medium", "url": "http://www.medium.com", "css": ".section-inner h1.graf--title"}, {"author": "Hackern Noon", "url": "http://www.hackernoon.com", "css": ".section-inner h1.graf--title"}, {"author": "CNBC", "url": "http://www.cnbc.com", "css": "h1.title"}, {"author": "Independent", "url": "http://www.independent.co.uk", "css": "article.article-article h1"}, {"author": "Newsweek", "url": "http://www.newsweek.com", "css": "header.article-header h1"}, {"author": "Decentralize Today", "url": "http://www.decentralize.today", "css": "h1 graf--title"}, {"author": "The Street", "url": "http://www.thestreet.com", "css": "h1.article__headline"}, {"author": "Slate", "url": "http://www.slate.com", "css": "h1.hed"}, {"author": "AntiWar", "url": "http://www.antiwar.com", "css": "header.entry-header h1.entry-title"}, {"author": "Manila Bulletin", "url": "http://www.business.mb.com.ph", "css": "div h1.uk-article-title"}, {"author": "Silicon", "url": "http://www.silicon.co.uk", "css": "header.entry-header .entry-title"}, {"author": "Kitco", "url": "http://www.kitco.com", "css": "#article-info-title h1"}, {"author": "Schiff Gold", "url": "http://www.schiffgold.com", "css": "div.wpb_wrapper h1#welcome-header"}, {"author": "Reuters", "url": "http://www.reuters.com", "css": "h1[class^=ArticleHeader_headline]"}, {"author": "Yahoo!", "url": "http://www.yahoo.com", "css": "header.canvas-header h1"}, {"author": "Dana Lyons", "url": "http://www.jlfmi.tumblr.com", "css": "div.post-bd h2 a"}, {"author": "Financial Times", "url": "http://www.ft.com", "css": "header.trial-subs__heading span.trial-subs__heading-article-title"}, {"author": "Telegraph", "url": "http://www.telegraph.co.uk", "css": "div.component-content h1.headline_-heading"}, {"author": "SRSRocco Report", "url": "http://www.srsroccoreport.com", "css": "h3.entry-title  a"}, {"author": "BullionStar", "url": "http://www.bullionstar.com", "css": "header.entry-header h1.entry-title"}, {"author": "Coin Telegraph", "url": "http://www.cointelegraph.com", "css": "h1.header"}, {"author": "CATO Institute", "url": "http://www.cato.org", "css": "h1#page-title"}, {"author": "Futurism", "url": "http://www.futurism.com", "css": "section h1"}, {"author": "Engadget", "url": "http://www.engadget.com", "css": "header h1"}, {"author": "Wired", "url": "http://www.wired.com", "css": "h1.title"}, {"author": "Clean Technica", "url": "http://www.cleantechnica.com", "css": "article h1.omc-post-heading-standard"}, {"author": "NY Times", "url": "http://www.nytimes.com", "css": "div#story-meta h1#headline"}, {"author": "Dr. Sircus", "url": "http://www.drsircus.com", "css": "h1.entry-title"}, {"author": "Right Scoop", "url": "http://www.therightscoop.com", "css": "header.entry-header h1.entry-title"}, {"author": "GoldMoney", "url": "http://www.goldmoney.com", "css": "h1"}, {"author": "NorthmanTrader", "url": "http://www.northmantrader.com", "css": "h1[class*=title]"}, {"author": "Evonomics", "url": "http://www.evonomics.com", "css": "header.entry-header h1.page-title"}, {"author": "Automatic Earth", "url": "http://www.theautomaticearth.com", "css": "div.title h1.posttitle a"}, {"author": "Business Insider", "url": "http://www.businessinsider.com.au", "css": "div.container h1"}, {"author": "GoldCore", "url": "http://www.goldcore.com", "css": "h3.entry-title"}, {"author": "Oil Price", "url": "http://www.oilprice.com", "css": "div[class*=Article__wrapper] h1"}, {"author": "Foreign Policy", "url": "http://www.europeslamsitsgates.foreignpolicy.com", "css": "div#header1 h1.post-hed"}, {"author": "Antonius Aquinas", "url": "https://antoniusaquinas.com", "css": "h1.entry-title"}, {"author": "Peak Prosperity", "url": "https://www.peakprosperity.com", "css": "div#content-inner-inner h1.title"}, {"author": "FiveThirtyEight", "url": "https://www.fivethirtyeight.com", "css": "h1.article-title"}, {"author": "Casey Research", "url": "https://www.caseyresearch.com", "css": "h1.entry-header"}, {"author": "MarketWatch", "url": "https://www.marketwatch.com", "css": ".article-headline-wrapper h1"}, {"author": "GATA", "url": "https://www.gata.com", "css": "h1.title"}, {"author": "James Howard Kunstler", "url": "https://www.kunstler.com", "css": "h1.title"}, {"author": "RT", "url": "https://www.rt.com", "css": "h1.article__heading"}, {"author": "WaPo", "url": "https://www.washingtonpost.com", "css": "manual"}, {"author": "Renegade Inc.", "url": "https://www.renegadeinc.com", "css": "h1.entry-title"}, {"author": "Yahoo!", "url": "https://www.finance.yahoo.com", "css": "header.canvas-header h1"}, {"author": "New Yorker", "url": "https://www.newyorker.com", "css": "header[class^=ArticleHeader] h1"}, {"author": "Straight Line Logic", "url": "https://www.straightlinelogic.com", "css": "h1.entry-title"}, {"author": "Credit Bubble Bulletin", "url": "https://www.creditbubblebulletin.blogspot.com", "css": "h3.entry-title"}, {"author": "Nation", "url": "https://www.thenation.com", "css": "div.article-header-content h1.title"}, {"author": "Philly Tribune", "url": "https://www.phillytrib.com", "css": "header.asset-header h1 span"}, {"author": "Fox & Hounds", "url": "https://www.foxandhoundsdaily.com", "css": "h1.entry-heading a"}, {"author": "Birch Gold", "url": "https://www.birchgold.com", "css": "div.post-title-holder h1.entry-title"}, {"author": "MunKnee", "url": "https://www.munknee.com", "css": "h1.entry-title span"}, {"author": "Madison", "url": "https://www.madison.com", "css": "h1.headline span"}, {"author": "Fortune", "url": "https://www.fortune.com", "css": "div.article-info h1.headline"}, {"author": "Longreads", "url": "https://www.longreads.com", "css": "h1.entry-title a"}, {"author": "Weekly Times Now", "url": "https://www.weeklytimesnow.com.au", "css": "manual"}, {"author": "AntiWar", "url": "https://www.news.antiwar.com", "css": "h1.entry-title"}, {"author": "manual", "url": "http://www.t.co", "css": "manual"}]


      
      site_index.each do |site|
        if !site[:url].match(url[/\/\/\w+\.\w+/][2..-1]).nil?
          return site
        end
      end
      return nil
    end
end