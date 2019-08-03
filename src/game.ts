import { getUserAccount } from '@decentraland/EthereumController'

executeTask(async () => {
    
  })

function updateTextShape(newNotes: Array<string>) {
  textShape.value = newNotes.join('\n')
}

function fetchAvatar(user, notes: Array<string>) {
  executeTask(async() => {
      // Get Ethereum Wallet
      try {
        // TODO: Get avatar name from somewhere
        user.nick = 'guest'
        user.address = await getUserAccount()
        notes.push('* Welcome ' + user.nick + ' ( ' + user.address + ' )');
        updateTextShape(notes)
        log(user.address)
      } catch (error) {
        log(error.toString())
      }
    })  
}

function fetchNotes(notes: Array<string>) {
  let callUrl:string = 'https://irc-services.xandronus.now.sh/?command=getmessages&after=2019-06-21';
  executeTask(async () => {
    try {
      
      log('getting new notes')
      let response = await fetch(callUrl,{
          headers: {
            "Content-Type": "application/json",
            "api_key":"ed62a076-6e98-40f4-941c-fbabc3ccfcb2"
          }
        })
      let json = await response.json()
      log('json=', json)
      json.message.forEach(item => {
          var ident = '< ' + item.postedby.nick + ' >';
          var messageDate = new Date(item.timestamp).toLocaleString();
          var text = ident.padEnd(15) + messageDate.padEnd(25) + item.content[0].text
          notes.push(text)          
        });
      updateTextShape(notes)
    } catch {
      log('failed to reach URL', error)
    }
  })
  return null;
}


/// --- Set up a system ---
class UpdateBulletinBoard implements ISystem {
  board: Entity 
  constructor(boardComponent){
      this.board = boardComponent
  }
  update(dt: number) {
    // TODO: Periodically fetch note data from cloud service
  }
}

// ------------------------------------------------
// Startup
// ------------------------------------------------
var notes: string[] = ["----------------- DCL BBS ------------------\nClick on board to toggle note input\n-------------------------------------------------\n"];
var user = {nick: '', address: ''}
fetchAvatar(user, notes)
fetchNotes(notes);

const planeEntity = new Entity()

// add a transform to the entity
planeEntity.addComponent(new Transform({ 
  position: new Vector3(8, 1, 8),
  scale: new Vector3(6, 6, 1)
}))

// add a shape to the entity
const plane = new PlaneShape();
planeEntity.addComponent(plane);

// Toggle text input when clicking on the plane
planeEntity.addComponent(
  new OnClick(e => {
    if (canvas.visible)
      canvas.visible = false
    else
      canvas.visible = true    
  })
)

// add the entity to the engine
engine.addEntity(planeEntity)

const textEntity = new Entity()
const billboard = new Billboard()
textEntity.addComponent(billboard)
const textShape = new TextShape()
textShape.fontSize = 1
textShape.color = Color3.Blue()
textShape.hTextAlign = 'left'
textShape.vTextAlign = 'top'
textEntity.addComponent(textShape)

textEntity.addComponent(new Transform({ 
  position: new Vector3(5.1, 3.75, 7.99)
}))

engine.addEntity(textEntity)

// Add a new instance of the system to the engine
engine.addSystem(new UpdateBulletinBoard(planeEntity))

// Create entity
const ui = new Entity()
const canvas = new UICanvas()

const textInput = new UIInputText(canvas)
textInput.width = '75%'
textInput.height = '25px'
textInput.vAlign = 'center'
textInput.hAlign = 'center'
textInput.fontSize = 10
textInput.placeholder = 'Enter message here'
textInput.placeholderColor = Color4.Gray()
textInput.positionX = '25px'
textInput.positionY = '25px'
textInput.isPointerBlocker = true

textInput.onTextSubmit = new OnTextSubmit(x => {
  var ident = '< ' + user.nick + ' >';
  var messageDate = new Date().toLocaleString()
  notes.push(ident.padEnd(15) + messageDate.padEnd(25) + x.text)
  updateTextShape(notes)
//  textShape.value += x.text + '\n'
  // const text = new UIText(textInput)
  // text.value = x.text
  // text.width = '100%'
  // text.height = '20px'
  // text.vAlign = 'top'
  // text.hAlign = 'left'
});

canvas.visible = false

ui.addComponent(canvas)

// Add entity to engine
engine.addEntity(ui)
