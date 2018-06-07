exports.autoSuggest = (input, maxResults, type) ->
	
	# Set defaults
	maxResults = 5 if maxResults is null
	
	# Type can be gemeente, woonplaats, weg, postcode, adres, hectometerpaal, or perceel.
	type = "adres" if type is null

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
			endpoint = Utils.domLoadJSONSync pdokURL + input.value + " and type:#{type}"
			results = endpoint.response.docs
			highlighting = endpoint.highlighting

			
			for result, index in results[0...maxResults]
				id = result.id
				item = new Layer
					parent: searchSuggestions
					width: searchSuggestions.width
					height: 48
					html: highlighting[id].suggest
					style:
						fontSize: "16px"
						lineHeight: "#{48 / 16}px"
						color: "#333"
						paddingTop: "24px"
						paddingLeft: "16px"
						paddingRight: "16px"
						borderBottom: "1px solid #ccc"
						width: "#{input.width - 32}px"
						whiteSpace: "nowrap"
						overflow: "hidden"
						textOverflow: "ellipsis"
					y: 48 * index
					backgroundColor: "white"
				
				if index is maxResults - 1
					item.style.borderBottom = ""
				
				resultsHeight += 48
				
				searchSuggestions.height = resultsHeight
				
				item.onClick ->
					input.value = result.weergavenaam
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