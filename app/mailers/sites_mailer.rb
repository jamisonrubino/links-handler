class SitesMailer < ApplicationMailer
  default from: 'jamison.rubino@gmail.com'

  def new_sites_email(new_sites = nil)
    @new_sites = new_sites.nil? ? Site.where("new = 1") : new_sites
    mail(to: "jamison.rubino@gmail.com", subject: "New URLs for links handler")
  end
end
