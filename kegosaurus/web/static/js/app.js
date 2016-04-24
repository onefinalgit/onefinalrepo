import {Socket, LongPoller} from "phoenix"

class App {

  static init(){
    let socket = new Socket("/socket", {
      logger: ((kind, msg, data) => { console.log(`${kind}: ${msg}`, data) })
    })

    socket.connect({user_id: "123"})
    var $status             = $("#status")
    var $messages           = $("#messages")
    var $buttonDiv          = $("#btnDiv")

    var $input              = $("#message-input")
    var $theAmazingButton   = $("#oneBtnToRuleThemAll")
    var $username           = $("#username")
    var registerText        = "Register"
    var buzzInText          = "Buzz In!"
    var clearText           = "Clear The Board"
    var suckItTrebek        = "trebek"
    var buzzedIn            = false

    var $aptAddBtn          = $("#addAptBtn")
    var $screenScrapeDiv    = $("#screenscrapeResults")
    var $aptUrl             = $("#aptUrl")

    socket.onOpen( ev => console.log("OPEN", ev) )
    socket.onError( ev => console.log("ERROR", ev) )
    socket.onClose( e => console.log("CLOSE", e))

    var chan = socket.channel("rooms:lobby", {})
    chan.join().receive("ignore", () => console.log("auth error"))
               .receive("ok", () => console.log("join ok"))
               .after(10000, () => console.log("Connection interruption"))
    chan.onError(e => console.log("something went wrong", e))
    chan.onClose(e => console.log("channel closed", e))

    //TODO: apt stuff, try to move to a new module
    $aptUrl.on("blur", () =>
    {
      console.log("on blur caught")
      $.ajax({
        url: $aptUrl.val(),
        type: 'GET',
        xhrFields: {
          withCredentials: false
        },
        headers: {
          'Access-Control-Allow-Origin': true
        },
        contentType: 'text/plain',
        success: function( data ){
          var title = $("<title>").html(data)[0];
          $screenScrapeDiv.append( "<p>Title: " + title + "</p>" )
          console.log( 'title!')
          console.log( "title: {title}")
        },
        fail: function( data ){
          console.log( "failed with: " + data )
        }
      })

      $screenScrapeDiv.append( `<p class="p">mah results</p>` )
    })

    //TODO: working on stuff here...
    $theAmazingButton.on("click", () =>
    {
      if( $theAmazingButton.text() == registerText )
      {
        //TODO: lock in the name
        if( $username.val() == "" )
        {
          alert( "Enter a username" )
        }
        else if( $username.val() == suckItTrebek )
        {
          // TODO: if correct pw...
          $theAmazingButton.text( clearText )
          chan.push("new:trebek", { user: $username.val() })
        }
        else
        {
          $username.prop( 'disabled', true )
          $theAmazingButton.text( buzzInText )
          chan.push("new:register", { user: $username.val() })
        }
      }
      else
      {
        //TODO: buzz in
        //todo: background flash and whatnot, add some pizzaz
        if( $username.val() == suckItTrebek )
        {
          //clear the board
          chan.push( "board:clear" )
        }
        else
        {
          chan.push("new:msg", {user: $username.val(), body: " buzzed in!"})
          $theAmazingButton.prop( "disabled", true )
        }
      }

    })

    //TODO: clicking a div with alex will cause them to gray out.  Next box will have colors
    $(document).on("click", ".currentContestant", ( event ) =>
    {
      if( $username.val() == suckItTrebek )
      {
        chan.push( "new:contestant", {current: event.target} )
      }
    })

    chan.on("new:msg", msg => {
      $messages.append( this.messageTemplate(msg, $messages ) )
      scrollTo(0, document.body.scrollHeight)
    })

    chan.on("new:register", msg => {
      $messages.append(`<br/><i>[${msg.user} entered the fray]</i>`)
    })

    chan.on("new:trebek", msg => {
      $messages.append(`<br/><strong>[TREBEK IS HERE]</strong>`)
    })

    chan.on("board:clear", msg => {
      $messages.empty()
      $theAmazingButton.prop("disabled", false)
    })

    chan.on("new:contestant", contestant => {

      var nextContestant = false
      $( '.buzzInBox' ).each( (idx, elem) => {

        if( nextContestant )
        {
          $(elem).addClass( 'currentContestant' )
          nextContestant = false
        }
       else if( $(elem).hasClass( 'currentContestant' ))
       {
         nextContestant = true
         $(elem).removeClass(' currentContestant' )
         console.log( `this one had the class ${elem}`)
       }
      })
    })
  }

  static sanitize(html){ return $("<div/>").text(html).html() }

  static messageTemplate(msg, messageDiv ){
    let username = this.sanitize(msg.user || "anonymous")
    let body     = this.sanitize(msg.body)

    if( messageDiv.find( 'p' ).length == 0 )
    {
      return( `<br /><p class="buzzInBox currentContestant">${username}</p>`)
    }
    return( `<br /><p class="buzzInBox">${username}</p>`)
  }

  static randomBgColorStyler()
  {
    var letters = ['FF0000','00FF00','0000FF','FFFF00','00FFFF','FF00FF','C0C0C0'];
    return '"background: #' + letters[Math.floor(Math.random() * letters.length)] + ';"'
  }
}

$( () => App.init() )

export default App
