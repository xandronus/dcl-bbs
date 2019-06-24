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

// TODO: replace with real data from cloud service
var notes = 'Click on board to toggle note input!\nThis is line 2\nThis is line 3\nThis is line4\n'

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
const textShape = new TextShape(notes)
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
  notes += x.text + '\n'
  textShape.value = notes
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
