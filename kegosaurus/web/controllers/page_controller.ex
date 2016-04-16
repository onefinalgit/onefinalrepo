defmodule Chat.PageController do
  use Chat.Web, :controller

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
      |> assign( :page_title, "Dave's Chicago Wedding!")
      |> render( "apartments.html" )
  end

  def apt_add( conn, _params) do
    conn
    |> assign( :page_title, "Add new digs")
    |> render( "add_apt.html" )
  end

  # def add_apt( conn, _params) do
  #   # TODO: screenscrape the page for cost, bedrooms, etc.  if found, autofill, if not manual
  #
  #   #at the end
  #   redirect conn, to: page_path(conn, :apartments)
  #
  # end

end
