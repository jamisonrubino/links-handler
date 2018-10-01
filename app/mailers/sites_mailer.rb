class SitesMailer < ApplicationMailer
  default from: 'jamison.rubino@gmail.com'

  def new_sites_email(new_sites)
    @new_sites = new_sites
    mail(to: "jamison.rubino@gmail.com", subject: "New URLs for links handler")
  end
end
