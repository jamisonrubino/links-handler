# Preview all emails at http://localhost:3000/rails/mailers/sites_mailer
class SitesMailerPreview < ActionMailer::Preview
  def sites_mailer_preview
    SitesMailer.new_sites_email("https://google.com")
  end
end
