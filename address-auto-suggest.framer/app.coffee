{InputLayer} = require "input"

flow = new FlowComponent
flow.showNext(search)


searchInputOld = InputLayer.wrap(inputOld,textOld)
searchInputNew = InputLayer.wrap(inputNew,textNew)


autoSuggest = (input, maxResults) ->
	
	# Search suggestion Layer
	searchSuggestions = new Layer
		width: input.width, height: 0, y: input.maxY, x: Align.center
		backgroundColor: null
		shadowColor: "rgba(0,0,0,0.2)", shadowY: 1, shadowBlur: 3
		borderColor: "#ededed"
		visible: false
	searchSuggestions.sendToBack()

	# PDOK
	pdokURL = "https://geodata.nationaalgeoregister.nl/locatieserver/v3/suggest?q="
	
	getSearchSuggestions = (input) ->
		suggestionResults = []
		
		resultsHeight = 0
		
		for item,i in searchSuggestions.children
			item.destroy()
		if input.value.length >= 2
			searchSuggestions.bringToFront()
			searchSuggestions.y = input.screenFrame.y + input.height + 8
			searchSuggestions.visible = true
			endpoint = Utils.domLoadJSONSync pdokURL + input.value + " and type:adres"
			results = endpoint.response.docs
			
			for result,i in results
				item = new TextLayer
					parent: searchSuggestions
					width: searchSuggestions.width
					height: 48
					text: result.weergavenaam
					fontSize: 16
					lineHeight: 24 / 16
					color: "#333"
					padding: top: 10, left: 16, right: 16
					truncate: true
					y: 48 * i
					backgroundColor: "white"
					style: borderBottom: "1px solid #ccc"
				
				if i is maxResults - 1
					item.style.borderBottom = ""
				
				resultsHeight += 48
				
				if resultsHeight > 48 * 5
					resultsHeight = 48 * 5
				
				searchSuggestions.height = resultsHeight
				
				item.onClick ->
					input.value = @text
					locDes = @text
					searchSuggestions.sendToBack()
					searchSuggestions.visible = false
			
				if i >= maxResults - 1 then return
		else
			searchSuggestions.sendToBack()
			searchSuggestions.height = 0
	
	
	input.onValueChange ->
		getSearchSuggestions(@)

autoSuggest(searchInputOld, 5)
autoSuggest(searchInputNew, 5)