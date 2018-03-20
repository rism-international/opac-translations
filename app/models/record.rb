#encoding: UTF-8

Dir['./models/*.rb'].each {|file| require file }
require 'nokogiri'
require 'mongoid'
require 'pry'
require 'json'
Mongoid.load!("./config/mongoid.yml", :development)


  class Records 
    # Seeds the db with external file
    def self.populate
      require 'csv'
      raw_data = CSV.read("../input/Literatur_Gesang_Fassung_6.6.16.csv")
      raw_data.each do |line|
        Record.create(
          :year => line[0], 
          :place => line[1], 
          :author => line[2], 
          :title => line[3], 
          :url_link => line[4], 
          :publisher => line[5],
          :comments => line[6],
        )
      end
    end

    def self.export
      start = 1000
      ofile = File.open("../export/gesangbuch.xml", "w")
      collection = Nokogiri::XML::Builder.new(:encoding => 'UTF-8') do |xml| 
        xml.collection('xmlns' => "http://www.loc.gov/MARC21/slim") do
        end
      end
      rx = Record.all
      rx.each do |r|
        marc = r.to_xml(start+=1)
        collection.doc.root <<  marc.doc.children.first
      end
      ofile.write(collection.to_xml)
    end


  end

  class Record
    include Mongoid::Document
    include Mongoid::Attributes::Dynamic
    field :title, :type => String
    field :updated_at, :type => Date

    
    # export
    def to_xml(id)
      marcxml = Node.new
      marcxml.leader 
      marcxml.controlfield("001", id)
      marcxml.datafield("100", "a", self.author)
      df = marcxml.datafield("260", "a", self.place) unless self.comments.blank?
      marcxml.addSubfield(df, "b", self.publisher) unless self.publisher.blank?
      marcxml.addSubfield(df, "c", self.year) unless self.year.blank?
      marcxml.datafield("500", "a", "#{self.comments}") unless self.comments.blank?
      return marcxml.document
    end

    def to_json
      {
        :year => self.year,
        :place => self.place,
        :author => self.author, 
        :title => self.title, 
        :url_link => self.url_link,
        :publisher => self.publisher,
        :comments => self.comments,
      }
    end


  end
