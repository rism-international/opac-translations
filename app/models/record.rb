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
      require 'java-properties'
      langs = %w( de en fr it )
      res = {}
      cnt = 1
      langs.each do |lang|
        properties = JavaProperties.load("../input/application_#{lang}.properties")
        properties.each do |k,v|
          unless res[k]
            res[k] = {lang => v}
            res[k].merge!({record_id: cnt})
            cnt += 1
          else
            res[k].merge!({lang => v})
          end
        end
      end
      res.each do |k,v|
        Record.create(code: k, record_id: v[:record_id], english: v['en'], german: v['de'], french: v['fr'], italian: v['it'] )
      end
    end

    #Export the set into the output folder
    def self.export
      require 'java-properties'
      langs = {"de": :german, "en": :english, "it": :italian, "fr": :french}
      langs.each do |k, lang|
        res = {}
        ofile = File.open("../output/application_#{k}.properties", "w")
        rx = Record.all.order_by(record_id: :asc)
        rx.each do |r|
          if r[lang]
            res[r.code] = r[lang]
          end
        end
        JavaProperties.write(res, ofile)
      end
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
