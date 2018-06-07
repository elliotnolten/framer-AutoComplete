{InputLayer} = require "input"
{autoSuggest} = require "autosuggestclass"

flow = new FlowComponent
flow.showNext(search)


searchInputAddress = InputLayer.wrap(inputAddress,textAddress)
searchInputCity = InputLayer.wrap(inputCity,textCity)

# Create an autoSuggest instance for searchInputOld with default options
autoSuggestAddress = new autoSuggest input: searchInputAddress

autoSuggestAddress.on Events.ResultSelected, ->
	print @result
	print @resultHighlighted

# Create an autoSuggest instance for searchInputNew
autoSuggestCity = new autoSuggest
	input: searchInputCity
	type: "woonplaats"
	maxResults: 3