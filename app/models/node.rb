require 'nokogiri'

  class Node
    attr_accessor :document, :node
    def initialize
      @document = Nokogiri::XML::Builder.new(:encoding => 'UTF-8') do |xml| 
        xml.record('xmlns' => "http://www.loc.gov/MARC21/slim") do
        end
      end
      @node=@document.doc.root
    end

    def controlfield(field, content)
      tag = Nokogiri::XML::Node.new "controlfield", node
      tag['tag'] = field
      tag.content = content
      @node << tag
    end

    def datafield(field, code, content)
      tag = Nokogiri::XML::Node.new "datafield", node
      tag['tag'] = field
      tag['ind1'] = ' '
      tag['ind2'] = ' '
      sfa = Nokogiri::XML::Node.new "subfield", node
      sfa['code'] = code
      sfa.content = content
      tag << sfa
      @node << tag
      return tag
    end

    def addSubfield(node, code, content)
      #node = @node.xpath("datafield[@tag='#{field}']").first
      sfa = Nokogiri::XML::Node.new "subfield", node
      sfa['code'] = code
      sfa.content = content
      node << sfa
    end

    def leader
      tag = Nokogiri::XML::Node.new "leader", node
      tag.content = "00000ncc a2200000 u 4500"
      @node << tag
    end

  end

