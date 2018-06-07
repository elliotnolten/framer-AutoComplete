# Custom Events
Events.ResultSelected = "ResultSelected"

# PDOK
pdokURL = "https://geodata.nationaalgeoregister.nl/locatieserver/v3/suggest?q="

# Create item Class only to use within this module, no exports
class ResultItem extends Layer
	constructor: (options) ->
		super _.defaults options,
			style:
				fontSize: "16px"
				lineHeight: "#{48 / 16}px"
				color: "#333"
				paddingTop: "24px"
				paddingLeft: "16px"
				paddingRight: "16px"
				borderBottom: "1px solid #ccc"
				whiteSpace: "nowrap"
				overflow: "hidden"
				textOverflow: "ellipsis"
			backgroundColor: "white"
			resultID: ""
			result: ""
			resultHighlighted: ""

		@resultID = options.resultID
		@result = options.result
		@resultHighlighted = options.resultHighlighted

class exports.AutoSuggest extends Layer

	constructor: (options) ->
		super _.defaults options,
			input: []
			maxResults: 5
			type: "adres"
			x: Align.center
			backgroundColor: null
			shadowColor: "rgba(0,0,0,0.2)"
			shadowY: 1
			shadowBlur: 8
			borderColor: "#ededed"

		@input = options.input
		@maxResults = options.maxResults
		@type = options.type


		# Store the options into new variables for later use
		autoSuggestContainer = @
		type = @type
		maxResults = @maxResults

		# Position the autoSuggest
		@x = @input.x + 1
		@y = @input.maxY + 8
		@width = @input.width - 2
		@sendToBack()

		# Show auto suggestions while typing
		@input.onValueChange ->

			input = @

			# Reset the height of the autoSuggestContainer to 0
			autoSuggestContainer.height = 0

			# First destroy all children of the autoSuggestContainer
			item.destroy() for item in autoSuggestContainer.children

			# Only show something when there are 2 characters or more
			if @value.length >= 2

				# First show the autoSuggest container
				autoSuggestContainer.bringToFront()

				# Then load the data from the PDOK endpoint
				endpoint = Utils.domLoadJSONSync pdokURL + @value + " and type:#{type}"

				# Split the endpoint in results
				results = endpoint.response.docs

				# And highlighted results
				highlighting = endpoint.highlighting

				# Loop through the results and show the results in a list
				for result, index in results[0...maxResults]

					# Store the unique id for later use
					id = result.id

					# Create the items
					item = new ResultItem
						parent: autoSuggestContainer
						width: autoSuggestContainer.width
						height: 48
						y: 48 * index
						# Fill the item with the highlighted suggestion
						resultID: id
						html: highlighting[id].suggest
						result: result.weergavenaam

					# For each result add up 48px to the height of the autoSuggestContainer
					autoSuggestContainer.height += 48

					# Tapping an item puts its value into the input field and triggers the resultSelected Event
					item.onTap ->
						input.value = @result
						autoSuggestContainer.result = @result
						autoSuggestContainer.resultHighlighted = highlighting[@resultID].suggest

						# Hide the autoSuggestContainer
						autoSuggestContainer.sendToBack()
						autoSuggestContainer.emit(Events.ResultSelected, event)



