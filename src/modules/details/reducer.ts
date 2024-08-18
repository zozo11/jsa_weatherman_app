import { reducerWithInitialState } from 'typescript-fsa-reducers'
import { Location, FetchForecastResponse } from '../api/types'
import * as searchActions from '../search/actions'
import * as detailsActions from '../details/actions'

export interface StoreState {
	readonly selectedLocation?: Location

	readonly forecast?: FetchForecastResponse
	readonly loading: boolean
	readonly error?: Error
}

/**
 * The initial store state for this module.
 */
const INITIAL_STATE: StoreState = {
	loading: false,
}

/**
 * Reducer function for this module.
 */
export const reducer = reducerWithInitialState(INITIAL_STATE)
	// set selected location
	.case(searchActions.locationSelectedAction, (state, payload): StoreState => ({
		...state, selectedLocation: payload,
	}))

	// fetch forecast
	.case(detailsActions.fetchForecastAction.started, (state): StoreState => ({
		...state, loading: true, error: undefined, forecast: undefined,
	}))
	.case(detailsActions.fetchForecastAction.failed, (state, payload): StoreState => ({
		...state, loading: false, error: payload.error,
	}))
	.case(detailsActions.fetchForecastAction.done, (state, payload): StoreState => {
		const allLists = payload.result.flatMap(response => response.list)
		const count = allLists.length
		return {
			...state,
			loading: false,
			error: undefined,
			forecast: {
				list: allLists,
				count: count
			}
		}
	})