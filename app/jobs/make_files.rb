#Scheduler for making backups
require_relative '../models/record.rb'
require 'awesome_print'

require 'rufus-scheduler'

scheduler = Rufus::Scheduler.new

scheduler.every '12h' do
  Records.export
  Records.export_tpadmin
  %x( cd ../output; tar -czf properties#{Time.now.strftime("%Y%m%d%H")}.tar.gz *.properties TPAdminFields.txt )
end

scheduler.join

