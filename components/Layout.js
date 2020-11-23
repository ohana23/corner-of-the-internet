import Head from 'next/head'
import { useEffect, useState } from 'react'
import Navbar from './Navbar'
import SearchModal from './SearchModal'

const Layout = (props) => {
    const [isModalActive, setIsModalActive] = useState(false)
    
    function handleModalToggle() {
        setIsModalActive(prevToggle => !prevToggle)
    }

    return (
        <div>
            <Head><title>Danny Ohana</title></Head>

            <Navbar onSearchCommandExecute={handleModalToggle} />
            <SearchModal isActive={isModalActive} />
        </div>
    )
}

export default Layout