import {
  ADD_ACCOUNT_PENDING,
  ADD_ACCOUNT_SUCCESS,
  ADD_ACCOUNT_ERROR,
  DELETE_ACCOUNT_PENDING,
  DELETE_ACCOUNT_SUCCESS,
  DELETE_ACCOUNT_ERROR,
  FETCH_ACCOUNTS_PENDING,
  FETCH_ACCOUNTS_SUCCESS,
  FETCH_ACCOUNTS_ERROR
} from '../actions/account'

const initialState = {
  isAdding: false,
  isDeleting: false,
  isLoading: true,
  accounts: [],
  error: null
}

export default function accountsReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_ACCOUNT_PENDING:
      return {
        ...state,
        isAdding: true
      }
    case ADD_ACCOUNT_SUCCESS:
      return {
        ...state,
        isAdding: false,
        accounts: [...state.accounts, action.payload],
        error: null
      }
    case ADD_ACCOUNT_ERROR:
      return {
        ...state,
        isAdding: false,
        error: action.error
      }
    case DELETE_ACCOUNT_PENDING:
      return {
        ...state,
        isDeleting: true
      }
    case DELETE_ACCOUNT_SUCCESS:
      const index = state.accounts.findIndex(a => a.id == action.payload)
      return {
        ...state,
        isDeleting: false,
        accounts: [
          ...state.accounts.slice(0, index),
          ...state.accounts.slice(index + 1)
        ],
        error: null
      }
    case DELETE_ACCOUNT_ERROR:
      return {
        ...state,
        isDeleting: false,
        error: action.error
      }
    case FETCH_ACCOUNTS_PENDING:
      return {
        ...state,
        isLoading: true
      }
    case FETCH_ACCOUNTS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        accounts: action.payload,
        error: null
      }
    case FETCH_ACCOUNTS_ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.error
      }
    default:
      return state
  }
}

export const getAccounts = state => state.accounts
export const getError = state => state.error
export const getIsAdding = state => state.isAdding
export const getIsLoading = state => state.isLoading
