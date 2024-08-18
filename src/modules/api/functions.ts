import { FetchLocationsResponse, Location, FetchForecastResponse } from './types'

const APP_ID = 'd14a2d48e99a8e66fa820f8612456f5d'

export function fetchLocations(query: string): Promise<Location[]> {
	const url = 'http://api.openweathermap.org/data/2.5/find?&units=metric&type=like&mode=json&APPID=' + APP_ID + '&q='
	return fetch(url + query)
		.then(response => {
			if (response.ok) {
				return response.json()
			}
			throw new Error('Failed to fetch locations ' + response.statusText)
		})
		.then(json => json as FetchLocationsResponse)
		.then(response => {
			return response.list
		})
}

export function fetchForecast(localtionId: number): Promise<FetchForecastResponse> {
	// const coord: Coord = forcastData.coord
	// const locationId: number = forcastData.id
	// TODO implement api call to fetch forecast
	//http://api.openweathermap.org/data/2.5/forecast?&units=metric&mode=json&APPID=d14a2d48e99a8e66fa820f8612456f5d&id=2193733
	//const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${coord.lat}&lon=${coord.lon}&appid=${APP_ID}`
	const url = `http://api.openweathermap.org/data/2.5/forecast?&units=metric&mode=json&APPID=${APP_ID}&id=${localtionId}`
	return fetch(url)
		.then(response => {
			if (response.ok) {
				return response.json()
			}
			throw new Error('Failed to fetch forecast: ' + response.statusText)
		})
		.then(json =>{
			return json as FetchForecastResponse
		})
		.then(response => {
			return response
		})
	// return Promise.resolve({ count: 0, list: [] })
}