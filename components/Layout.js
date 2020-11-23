import Head from 'next/head'
import Navbar from './Navbar'
import { SearchModal } from './SearchModal'

const Layout = (props) => (
    <div>
        <Head>
            <title>Danny Ohana</title>
        </Head>
        <Navbar />
        <SearchModal />
        <div className="container">
            {props.children}
        </div>
    </div>
)

export default Layout