import { ADD_STORE_OWNER } from '../actions/actionTypes'

const storeOwners = (state = [], action) => {
  switch (action.type) {
    case ADD_STORE_OWNER:
      return [
        ...state,
        {
          address: action.address,
        }
      ]
    default:
      return state
  }
}

export default storeOwners