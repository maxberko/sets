import { render } from 'preact'
import '@fontsource-variable/bricolage-grotesque/index.css'
import '@fontsource/instrument-sans/400.css'
import '@fontsource/instrument-sans/500.css'
import '@fontsource/instrument-sans/600.css'
import './styles/tokens.css'
import { App } from './app'

const racine = document.getElementById('app')
if (racine) render(<App />, racine)
