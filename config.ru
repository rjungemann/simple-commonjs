require 'sinatra/base'

module SimpleCommonjs
  class App < Sinatra::Base
    set :public, "#{File.dirname(__FILE__)}/public"
  end
end

run SimpleCommonjs::App.new
