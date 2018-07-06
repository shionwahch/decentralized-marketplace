import { ADD_STORE_OWNER } from './actionTypes'

const addStoreOwner = address => ({
  type: ADD_STORE_OWNER,
  address
})

export { addStoreOwner }