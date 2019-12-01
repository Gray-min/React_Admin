import React from 'react'
import ReactDOM from 'react-dom'

import App from './app'
import memoryUtils from './utils/memoryUtils'
import storeUtils from './utils/storeUtils'

memoryUtils.user = storeUtils.getUser()

ReactDOM.render(<App />, document.getElementById('root'))