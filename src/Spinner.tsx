import { useState } from 'react'
import Loader from './Loader'
import LoaderBraille from './LoaderBraille'

const LOADERS = [Loader, LoaderBraille]

const Spinner = () => {
    const [Component] = useState(
        () => LOADERS[Math.floor(Math.random() * LOADERS.length)]
    )
    return <Component />
}

export default Spinner
