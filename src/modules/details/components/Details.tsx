import '../styles/Details.scss'

import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { RootStoreState } from '../../root'
import { Location, FetchForecastResponse, Forecast } from '../../api/types'
import { fetchForecastAction } from '../actions'

const DetailsScreen = (): JSX.Element | null => {

	/**
	 * Dependency Hooks
	 */

	const dispatch = useDispatch()
	/**
	 * Store State
	 */

	const location = useSelector<RootStoreState, Location | undefined>(state => state.details.selectedLocation)
	const loading = useSelector<RootStoreState, boolean>(state => state.details.loading)
	const error = useSelector<RootStoreState, Error | undefined>(state => state.details.error)
	const results = useSelector<RootStoreState, FetchForecastResponse >(state => ({
		count: state.details.forecast?.count || 0,
		list: state.details.forecast?.list as Forecast[] || []
	}))

	/**	
	 * Effects/Subscriptions
	 */

	useEffect(() => {
		if (location) {
			// TODO dispatch action to load forecasts for given location id
			dispatch(fetchForecastAction.started(location.id, location.coord ))
		}
	}, [location, dispatch])

	/**
	 * Local Functions
	 */

	if (!location) {
		return <div>Loading...</div>
	}

	if (loading) {
		return <div>Loading...</div>
	}

	if (error) {
		return <p>An error occurred while loading the forecasts.</p>
	}

	const getDayOfWeek = (dateString: string) => {
		const date = new Date(dateString)
		const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
		return days[date.getDay()]
	}
	const filterUniqueDays = (items: Forecast[]) => {
		const seenDays = new Set()
		return items.filter(item => {
			const day = new Date(item.dt_txt).getDate()
			if (seenDays.has(day)) {
				return false
			} else {
				seenDays.add(day)
				return true
			}
		})
	}

	const uniqueItems = filterUniqueDays(results.list).slice(0, 5)

	return (
		<div className='details'>
			<h2>Weather Details:</h2>
			<h3>{location.name}, {location.sys.country}</h3>
			{/* TODO render current temperatures */}
			<h3>{location.main.temp}</h3>
			<div className="details-row">
				<span>
					<h4>Temp min</h4>
					<p>{location.main.temp_min} °C</p>
				</span>
				<span>
					<h4>Temp max</h4>
					<p>{location.main.temp_max} °C</p>
				</span>
				<span>
					<h4>Humidity</h4>
					<p>{location.main.humidity} %</p>
				</span>
				<span>
					<h4>Pressure</h4>
					<p>{location.main.pressure} hPa</p>
				</span>
			</div>
			{/* Render forecasts */}
			<h3>Forecast:</h3>
			{uniqueItems.map((forecast, index) => (
				<div key={index} className="forecast-item">
					<p>{getDayOfWeek(forecast.dt_txt)}</p>
					<p>{forecast.main.temp}°C</p>
					<p>{forecast.weather[0].description}</p>
				</div>		
			))}

		</div>
	)
}

export default DetailsScreen