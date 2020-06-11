import authReducer from './authReducer'
import partyReducer from './partyReducer'
import { combineReducers } from 'redux'

const rootReducer = combineReducers({
    auth: authReducer,
    party: partyReducer
})

export default rootReducer