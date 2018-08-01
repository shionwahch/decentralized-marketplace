import _ from 'lodash'

const getWeb3ErrorMessage = (exceptionMessage) => 'Error: ' + _.trim(_.last(_.split(exceptionMessage, 'Error:')))

export default getWeb3ErrorMessage
