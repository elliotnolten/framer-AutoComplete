{InputLayer} = require "input"
{autoSuggest} = require "autosuggestclass"

flow = new FlowComponent
flow.showNext(search)


searchInputOld = InputLayer.wrap(inputOld,textOld)
searchInputNew = InputLayer.wrap(inputNew,textNew)

# Create instance of the autoSuggest for searchInputOld
autoSuggestOld = new autoSuggest input: searchInputOld

autoSuggestOld.on Events.ResultSelected, ->
	print "Event Listened"
	print @resultHighlighted

# Create instance of the autoSuggest for searchInputNew
autoSuggestNew = new autoSuggest
	input: searchInputNew
	type: "woonplaats"
	maxResults: 3