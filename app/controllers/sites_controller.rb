class SitesController < ApplicationController
    def initialize(author, url, css)
        @author = author
        @url = url
        @css = css
    end
    attr_reader :author, :url, :css
end