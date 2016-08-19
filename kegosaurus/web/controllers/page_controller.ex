defmodule Chat.PageController do
  use Chat.Web, :controller

  alias Chat.Router
  import Chat.Router.Helpers

  def index(conn, _params) do
    conn
    |> assign( :page_title, "KEGOSAURUS" )
    |> render( "index.html" )
    # render conn, "index.html"
  end

  def brjeopardy(conn, _params) do
    conn
    |> assign( :page_title, "Backroom Jeopardy!" )
    |> render( "brjeopardy.html" )
  end


  def apartments(conn, _params) do
    conn
      |> assign( :apartments, Chat.Repo.all( Chat.Apartment ))
      |> assign( :page_title, "We ain't gonna be homeless")
      |> render( "apartments.html" )
  end

  # def apt_add( conn, _params) do
  #   conn
  #   |> assign( :page_title, "Add new digs")
  #   |> render( "add_apt.html" )
  # end

  def create( conn, %{ "apartment" => %{ "url" => url, "title" => title, "cost" => cost}} ) do
      new_apt = %Chat.Apartment{url: url,  title: title, cost: cost}
      Chat.Repo.insert( new_apt )

      redirect conn, to: page_path(conn, :apartments)
  end

end
