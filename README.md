# Framer AutoComplete
A module for searching Dutch addresses.

## How it works
### Step 1. Add the AutoComplete module and the [InputLayer](https://github.com/benjamindenboer/FramerInput) module to your project
This module is built up the [InputLayer](https://github.com/benjamindenboer/FramerInput) module by [Benjamin den Boer](https://github.com/benjamindenboer). So you'll need to add that plugin to your project as well.


### Step 2. Design a nice input field in the Design tab and wrap it with the InputLayer
```Javascript
input = InputLayer.wrap(inputAddress,textAddress)
```

### Step 3. Create an instance of AutoComplete
Make sure that you set the right `input`, `type` ([See what types are available](#Types)) and `maxResults`.
```Javascript
autoCompleteAddress = new AutoComplete
	input: input
	type: "gemeente"
	maxResults: 10
```

## Example
This prototype searches on the Unsplash site for a picture of your favorite Dutch city.
https://framer.cloud/SaaXt


## Locatieserver
This Module uses [Locatieserver](https://github.com/PDOK/locatieserver/wiki/API-Locatieserver) to find Dutch addresses and cities.

## Types
- gemeente
- woonplaats
- weg
- postcode
- adres
- hectometerpaal
- perceel
