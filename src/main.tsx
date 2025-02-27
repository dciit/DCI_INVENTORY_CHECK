import { createContext } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { ContextInterface } from './interface/main.interface.ts'
import { Provider } from 'react-redux'
import { store } from './redux/store.ts'
import Routers from './Routers.tsx'
const context: ContextInterface = {
  appname: 'IT TEMPLATE',
  style: {
    baseColorText: 'text-[#1990ff]'
  }
}
export const ThemeContext = createContext<ContextInterface>({});
ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
    <ThemeContext.Provider value={context}>
      <Provider store={store}>
        <Routers />
      </Provider>
    </ThemeContext.Provider>
  // </React.StrictMode>,
)
