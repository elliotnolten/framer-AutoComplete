{InputLayer} = require "input"

autoSuggestModule = require "autosuggest"

flow = new FlowComponent
flow.showNext(search)


searchInputOld = InputLayer.wrap(inputOld,textOld)
searchInputNew = InputLayer.wrap(inputNew,textNew)


autoSuggestModule.autoSuggest(searchInputOld, 5)
autoSuggestModule.autoSuggest(searchInputNew, 5)