class MainController < ApplicationController
  def index
    @main = Main.all
    main = @main.to_json
    respond_to do |format|
    format.json {render :json => main, :callback => params[:callback]}
  end
end
