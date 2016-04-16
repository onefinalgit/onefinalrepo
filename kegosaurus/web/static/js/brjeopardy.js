import {Socket, LongPoller} from "phoenix"

class Brjeopardy {

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

    socket.onOpen( ev => console.log("OPEN", ev) )
    socket.onError( ev => console.log("ERROR", ev) )
    socket.onClose( e => console.log("CLOSE", e))

    var chan = socket.channel("rooms:lobby", {})
    chan.join().receive("ignore", () => console.log("auth error"))
               .receive("ok", () => console.log("join ok"))
               .after(10000, () => console.log("Connection interruption"))
    chan.onError(e => console.log("something went wrong", e))
    chan.onClose(e => console.log("channel closed", e))

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
        }
      }

    })

    chan.on("new:msg", msg => {
      $messages.append(this.messageTemplate(msg))
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
    })
  }

  static sanitize(html){ return $("<div/>").text(html).html() }

  static messageTemplate(msg){
    let username = this.sanitize(msg.user || "anonymous")
    let body     = this.sanitize(msg.body)

    let color = this.randomColor()
    // return(`<p><a href='#'>[${username}]</a>&nbsp; ${body}</p>`)
    return( `<p class="buzzInBox" style="background: ${color};">${username}</p>`)
  }

  static randomColor()
  {
    var letters = ['FF0000','00FF00','0000FF','FFFF00','00FFFF','FF00FF','C0C0C0'];
    return '#' + letters[Math.floor(Math.random() * letters.length)]
  }

}

$( () => Brjeopardy.init() )

export default Brjeopardy
