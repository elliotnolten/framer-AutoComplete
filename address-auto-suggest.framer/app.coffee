{InputLayer} = require "input"
{autoSuggest} = require "autosuggestclass"

flow = new FlowComponent
flow.showNext(search)


searchInputOld = InputLayer.wrap(inputOld,textOld)
searchInputNew = InputLayer.wrap(inputNew,textNew)

autoSuggestOld = new autoSuggest input: searchInputOld

autoSuggestOld.on Events.ResultSelected, ->
	print "Event Listened"