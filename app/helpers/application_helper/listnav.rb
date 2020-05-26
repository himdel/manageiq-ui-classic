module ApplicationHelper
  module Listnav
    def render_listnav_filename
      if @compare
        "compare_sections"
      elsif @explorer
        "explorer"
      end
    end

    def valid_html_id(id)
      id = id.to_s.gsub("::", "__")
      raise "HTML ID is not valid" if id =~ /[^\w]/
      id
    end

    # Create a collapsed panel based on a condition
    def miq_accordion_panel(title, condition, id, &block)
      id = valid_html_id(id)
      content_tag(:div, :class => "panel panel-default") do
        out = content_tag(:div, :class => "panel-heading") do
          content_tag(:h4, :class => "panel-title") do
            link_to(title, "##{id}",
                    'data-parent' => '#accordion',
                    'data-toggle' => 'collapse',
                    :class        => condition ? '' : 'collapsed')
          end
        end
        out << content_tag(:div, :id => id, :class => "panel-collapse collapse #{condition ? 'in' : ''}") do
          content_tag(:div, :class => "panel-body", &block)
        end
      end
    end
  end
end
