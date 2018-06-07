{InputLayer} = require "input"
{AutoSuggest} = require "autosuggest"

flow = new FlowComponent
flow.showNext(search)


searchInputAddress = InputLayer.wrap(inputAddress,textAddress)
searchInputCity = InputLayer.wrap(inputCity,textCity)

# Create an autoSuggest instance for searchInputOld with default options
autoSuggestAddress = new AutoSuggest
	input: searchInputAddress

autoSuggestAddress.on Events.ResultSelected, ->
	print @result
	print @resultHighlighted

# Create an autoSuggest instance for searchInputNew
autoSuggestCity = new AutoSuggest
	input: searchInputCity
	type: "woonplaats"
	maxResults: 3