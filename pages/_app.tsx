import type { AppProps } from 'next/app'
import Head from 'next/head'
import Header from '../components/Header'
import Footer from '../components/Footer'
import '../styles/globals.css'
import type { NextPage } from 'next'
import type { ReactElement, ReactNode } from 'react'

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  // Si la página define un método getLayout, lo usamos.
  // De lo contrario, usamos el layout por defecto de producción.
  const getLayout = Component.getLayout ?? ((page) => (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {page}
      </main>
      <Footer />
    </div>
  ))

  return (
    <>
      <Head>
        <link rel="stylesheet" href="/fonts/gangofthree.css" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
      </Head>
      {getLayout(<Component {...pageProps} />)}
    </>
  )
}
