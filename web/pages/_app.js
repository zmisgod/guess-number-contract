import '../styles/globals.css'
import {ContractContextProvider} from './../context/contract'

function MyApp({ Component, pageProps }) {
  return (
    <ContractContextProvider>
      <Component {...pageProps} />
    </ContractContextProvider>
  )
}

export default MyApp
