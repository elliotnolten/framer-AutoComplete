exports.autoSuggest = (input, maxResults) ->
	
	# Search suggestion Layer
	searchSuggestions = new Layer
		width: input.width
		height: 0
		x: Align.center
		y: input.maxY
		backgroundColor: null
		shadowColor: "rgba(0,0,0,0.2)"
		shadowY: 1
		shadowBlur: 3
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
			
			for result, index in results[0...maxResults]
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
					y: 48 * index
					backgroundColor: "white"
					style: borderBottom: "1px solid #ccc"
				
				if index is maxResults - 1
					item.style.borderBottom = ""
				
				resultsHeight += 48
				
				searchSuggestions.height = resultsHeight
				
				item.onClick ->
					input.value = @text
					searchSuggestions.sendToBack()
					searchSuggestions.visible = false
			
			input.onInputBlur ->
				searchSuggestions.sendToBack()
			input.onInputFocus ->
				searchSuggestions.bringToFront()
		else
			searchSuggestions.sendToBack()
			searchSuggestions.height = 0
	
	
	input.onValueChange ->
		getSearchSuggestions(@)