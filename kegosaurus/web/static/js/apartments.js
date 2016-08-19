class Apartments
{

  static testApartments()
  {
      alert("test apt button");
  }


  static init()
  {
    var $aptAddBtn          = $("#addAptBtn")
    var $screenScrapeDiv    = $("#screenscrapeResults")
    var $aptUrl             = $("#aptUrl")

    $aptUrl.on("blur", () =>
    {
      console.log("on blur caught")
      $.ajax({
        url: $aptUrl.val(),
        type: 'GET',
        xhrFields: {
          withCredentials: false
        },
        // headers: {
        //   Access-Control-Allow-Credentials: true
        // },
        contentType: 'text/plain',
        success: function( data ){
          var title = $("<title>").html(data)[0];
          $screenScrapeDiv.append( "<p>Title: " + title + "</p>" )
          console.log( 'title!')
          console.log( "title: {title}")
        },
        fail: function( data ){
          // var title = $("<title>").html(data)[0];
          // $screenScrapeDiv.append( "<p>Title done: " + title + "</p>" )
          console.log( "failed with: " + data )
        }
      })

      $screenScrapeDiv.append( `<p class="p">mah results</p>` )
    })
  }
}

$( () => Apartments.init() )

export default Apartments
