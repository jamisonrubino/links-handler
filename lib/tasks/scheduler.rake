desc "This task is called by the Heroku scheduler add-on"
task :new_sites_email => :environment do
  puts "Sending new sites reminder email..."
  SitesMailer.new_sites_email.deliver_now
  puts "done."
end

# task :send_reminders => :environment do
#   User.send_reminders
# end
