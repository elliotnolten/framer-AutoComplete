{InputLayer} = require "input"
{AutoComplete} = require "autocomplete"

Framer.Defaults.Animation = 
	time: 0.6
	curve: Spring(damping: 0.8)

flow = new FlowComponent
flow.showNext(search)

input = InputLayer.wrap(inputAddress,textAddress)
input.borderRadius = 8

# Keyboard Simulator
# Variables
lettersActive = true 
numbersActive = false
showLeftKey = false 
showRightKey = false
showLargeKey = false

# Methods 		
## Show active key
showActiveKey = (key, showLeftKey, showRightKey) ->

	offsetX = 2 
	offsetY = 3
	
	currentActiveKey = activeKey
	currentActiveLetter = activeLetter
	
	if showLeftKey
		currentActiveKey = activeKeyLeft
		currentActiveLetter = activeLetterLeft
		offsetX = -19
		
	else if showRightKey
		currentActiveKey = activeKeyRight
		currentActiveLetter = activeLetterRight
		offsetX = 11
		
	else if showLargeKey
		currentActiveKey = activeKeyLarge
		currentActiveLetter = activeLetterLarge
		offsetX = -8
		
	currentActiveKey.opacity = 1
	currentActiveKey.point = 
		x: key.x - (key.width / 2) - 5 - offsetX
		y: key.y - currentActiveKey.height + key.height + offsetY
		
	if lettersActive
		currentActiveKey.parent = keyboard
		currentActiveLetter.text = key.name
	
	if numbersActive
		currentActiveKey.parent = numeric 
		currentActiveLetter.text = key.name
		currentActiveLetter.x = Align.center
	
	if shiftIconActive.visible
		currentActiveLetter.textTransform = "uppercase"			
	else
		currentActiveLetter.textTransform = "lowercase"
				
	
## Map all keys
mapLetterKeys = (e) ->	
	for key in letters.children
		name = String.fromCharCode(e.which) 
		
		if key.name is name
		
			if name is "q"
				showLeftKey = true
				showRightKey = false
			if name is "p"
				showLeftKey = false 
				showRightKey = true 
			
			showActiveKey(key, showLeftKey, showRightKey, showLargeKey)			

mapNumberKeys = (e) ->	
	for key in numbers.children
		name = String.fromCharCode(e.which) 
		
		if key.name is name
					
			if name is "1" or name is "-"
				showLeftKey = true
				showRightKey = false
				showLargeKey = false
			if name is "0" or name is "“"
				showLeftKey = false
				showRightKey = true
				showLargeKey = false
			if name is "."
				showLeftKey = false
				showRightKey = false 
				showLargeKey = true 
		
			showActiveKey(key, showLeftKey, showRightKey, showLargeKey)		
								
## Uppercase & Lowercase
setUppercase = ->
	for key in letters.children
		key.children[0].textTransform = "uppercase"
		key.children[0].x = Align.center()
		key.children[0].y = Align.center(1)
		shiftIconActive.visible = true
		shiftIcon.visible = false
		
setLowercase = ->
	for key in letters.children
		key.children[0].textTransform = "lowercase"
		key.children[0].x = Align.center()
		key.children[0].y = Align.center(-1)
		shiftIconActive.visible = false
		shiftIcon.visible = true
		
checkValue = ->
	if input.value == ""
		setUppercase()
	else
		setLowercase()
		
# Tap interactions for letters
for key in letters.children
		
	key.onTapStart ->
		return if numbersActive
		
		showLeftKey = false 
		showRightKey = false
		showLargeKey = false
		
		if @name is "q"
			showLeftKey = true 
			showRightKey = false
			showLargeKey = false
		if @name is "p"
			showLeftKey = false 
			showRightKey = true
			showLargeKey = false
				
		showActiveKey(this, showLeftKey, showRightKey, showLargeKey)
					
	key.onTapEnd ->
		return if numbersActive
				
		currentActiveKey = activeKey
		currentActiveLetter = activeLetter
		
		if showLeftKey
			currentActiveKey = activeKeyLeft
			currentActiveLetter = activeLetterLeft
			
		else if showRightKey
			currentActiveKey = activeKeyRight
			currentActiveLetter = activeLetterRight
			
		currentActiveKey.opacity = 0
		input._inputElement.focus()
		
		if shiftIconActive.visible
			input.value += currentActiveLetter.text.toUpperCase()		
		else
			input.value += currentActiveLetter.text
			
		checkValue()
		input.emit(Events. ValueChange, input.value)
	
# Tap interactions for numbers
for key in numbers.children
		
	key.onTapStart ->
		return if lettersActive
		
		showLeftKey = false 
		showRightKey = false
		showLargeKey = false
		
		if @name is "1" or @name is "-"
			showLeftKey = true 
			showRightKey = false
			showLargeKey = false
		if @name is "0" or @name is "“"
			showLeftKey = false 
			showRightKey = true 
			showLargeKey = false
		if @name is "." or @name is "," or @name is "?" or @name is "!" or @name is "‘"
			showLeftKey = false 
			showRightKey = false 
			showLargeKey = true
				
		showActiveKey(this, showLeftKey, showRightKey, showLargeKey)
					
	key.onTapEnd ->
		return if lettersActive
		
		currentActiveKey = activeKey
		currentActiveLetter = activeLetter
		
		if showLeftKey
			currentActiveKey = activeKeyLeft
			currentActiveLetter = activeLetterLeft
			
		else if showRightKey
			currentActiveKey = activeKeyRight
			currentActiveLetter = activeLetterRight
		
		else if showLargeKey
			currentActiveKey = activeKeyLarge
			currentActiveLetter = activeLetterLarge
			
		currentActiveKey.opacity = 0
		input._inputElement.focus()
			
		input.value += currentActiveLetter.text
		input.emit(Events.InputValueChange, input.value)	
		
# Keyboard methods	
document.onkeydown = (e) ->
	
	# Shift down
	if e.which == 16
		if shiftIconActive.visible
			return 
		else
			setUppercase()	
								
document.onkeypress = (e) ->
	
	if lettersActive
		mapLetterKeys(e)
		
	if numbersActive
		mapNumberKeys(e)
		
	# Space down
	if e.which == 32
		space.backgroundColor = "#ACB4BC"
	
					
document.onkeyup = (e) ->
	
	currentActiveKey = activeKey
	
	if showLeftKey
		currentActiveKey = activeKeyLeft
		
	else if showRightKey
		currentActiveKey = activeKeyRight
		
	currentActiveKey.opacity = 0
	
	# Space up
	if e.which == 32
		space.backgroundColor = "#FFFFFF"
	
	# Shift up 
	if e.which == 16
		setLowercase()
	
	checkValue()
		
# Extras
# Space
space.onTap -> input.value += " "	
space.onTapStart -> @backgroundColor = "#ACB4BC"	
space.onTapEnd -> @backgroundColor = "#FFFFFF"
input.onSpaceKey -> space.backgroundColor = "#ACB4BC"

# Return
returnKey.onTapStart -> @backgroundColor = "#FFFFFF"	
returnKey.onTapEnd -> @backgroundColor = "#ACB4BC"
returnKey.onTap ->
	if input.multiLine
		input.value += "\n"
			
# Shift			
shift.onTap ->
	if shiftIconActive.visible
		setLowercase()					
	else
		setUppercase()
		
# Caps lock
input.onCapsLockKey ->
	if shiftIconActive.visible
		setLowercase()
	else 
		setUppercase()

# Backspace
backspace.onTapStart ->
	backSpaceIcon.visible = false
	backSpaceIconActive.visible = true
	input.value = input.value.slice(0, -1)
	
backspace.onTapEnd ->
	backSpaceIcon.visible = true
	backSpaceIconActive.visible = false
	
# Numbers
numbersKey.onTap (event) ->
	lettersActive = false 
	numbersActive = true

	numeric.x = 0
	numeric.y = Screen.height - numeric.height
	numeric.parent = screenA
	
lettersKey.onTap (event) ->
	lettersActive = true 
	numbersActive = false

	numeric.x = Screen.width
	
# Hide on mobile
unless Utils.isDesktop()
	keyboard.opacity = 0
	numeric.opacity = 0

title.states =
	active:
		x: 20
		opacity: 0
		animationOptions:
			time: 0.2

inputContainer.states =
	active:
		y: 0
		x: 0
		width: Screen.width
		animationOptions:
			curve: Spring(damping: 1)
	default:
		x: 14
		y: 124
		width: Screen.width - 28
		animationOptions:
			curve: Spring(damping: 1)

closeInput.states =
	active:
		opacity: 1
		x: Screen.width - 14 - closeInput.width
		animationOptions:
			curve: Spring(damping: 1)
			
inputShadow.states =
	active:
		x: 0
		y: 0
		width: input.width
		height: input.height
		opacity: 1
		blur: 0
		borderRadius: 9
		animationOptions:
			time: 0.2
			curve: Bezier.linear

input.states =
	active:
		backgroundColor: "#f6f6f6"
		borderRadius: 0
		width: Screen.width

input.onInputFocus ->
	inputContainer.animate "active"
	inputShadow.animate "active"
	input.animate "active"
	title.animate "active"
	closeInput.animate "active"
	

keyboards.y = Screen.height

if Utils.isDesktop()
	input.onInputFocus ->
		keyboards.animate
			y: Screen.height - keyboard.height
			animationOptions:
				time: 0.5
				curve: Spring(0.85)

closeInput.onTap ->
	inputContainer.animate "default"
	inputShadow.animate "default"
	input.animate "default"
	title.animate "default"
	closeInput.animate "default"
	
	if Utils.isDesktop()
		keyboards.animate
			y: Screen.height
			animationOptions:
				time: 0.5
				curve: Spring(0.85)
	
# Create an autoSuggest instance for searchInputOld with default options
autoCompleteAddress = new AutoComplete
	parent: inputContainer
	input: input
	type: "gemeente"
	borderRadius: 0
	shadowBlur: 0
	clip: true
	opacity: 0
	width: Screen.width
	x: 0
	y: input.height
	resultStyle:
		fontSize:"16px", fontFamily: "-apple-system, BlinkMacSystemFont, SF UI Text, Helvetica Neue", lineHeight:"3px", color:"#333", paddingTop:"24px", paddingLeft:"16px", paddingRight:"16px", borderBottom:"1px solid #ccc", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", backgroundColor:"white"

autoCompleteAddress.on Events.ResultGenerated, ->
	@opacity = 1

autoCompleteAddress.on Events.ResultSelected, ->
	city = @result.replace("Gemeente ","")
	resultTitle.text = city
	cityImage.image = "https://source.unsplash.com/375x667/?#{city}"
	autoCompleteAddress.opacity = 0
	keyboards.animate
		y: Screen.height
		animationOptions:
			time: 0.5
			curve: Spring(0.85)
	
	Utils.delay 0.5, ->
		flow.showNext(result)
		Utils.delay 0.2, ->
			inputContainer.animate "default"
			inputShadow.animate "default"
			input.animate "default"
			title.animate "default"
			closeInput.animate "default"

back.onTap ->
	flow.showPrevious()
