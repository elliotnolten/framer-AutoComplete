{InputLayer} = require "input"
{AutoComplete} = require "autocomplete"

flow = new FlowComponent
flow.showNext(search)


searchInputAddress = InputLayer.wrap(inputAddress,textAddress)
searchInputCity = InputLayer.wrap(inputCity,textCity)

# Create an autoSuggest instance for searchInputOld with default options
autoSuggestAddress = new AutoComplete
	input: searchInputAddress

autoSuggestAddress.on Events.ResultSelected, ->
	print @result
	print @resultHighlighted

# Create an autoSuggest instance for searchInputNew
autoSuggestCity = new AutoComplete
	input: searchInputCity
	type: "woonplaats"
	maxResults: 5