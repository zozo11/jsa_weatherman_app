import { SagaIterator } from 'redux-saga'
import { takeEvery, call, put } from 'redux-saga/effects'
import { fetchLocationsAction, FetchLocationsPayload } from '../search/actions'
import { fetchLocations, fetchForecast } from '../api/functions'
import { Location, FetchForecastResponse } from '../api/types'
import { fetchForecastAction, FetchForecastPayload } from '../details/actions'

function* handleFetchLocations(action: FetchLocationsPayload): SagaIterator {
	const query: string = action.payload
	try {
		const result: Location[] | undefined = yield call(fetchLocations, query)
		if (result) {
			yield put(fetchLocationsAction.done({ params: action.payload, result }))
		}
	} catch (error) {
		yield put(fetchLocationsAction.failed({ params: action.payload, error: error as Error }))
	}
}

function* handleFetchForecast(action: FetchForecastPayload): SagaIterator {
	// TODO implement saga to fetch forecast
	try{
		const result: FetchForecastResponse | undefined = yield call(fetchForecast, action.payload)
		if (result) {
			yield put(fetchForecastAction.done({ params: action.payload, result: [result] }))
		}
	} catch (error) {
		yield put(fetchForecastAction.failed({ params: action.payload, error: error as Error }))
	}
}

export default function* (): SagaIterator {
	yield takeEvery(fetchLocationsAction.started.type, handleFetchLocations)
	yield takeEvery(fetchForecastAction.started.type, handleFetchForecast)
}
