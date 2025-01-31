import React, { createContext } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { ContextInterface } from './interface/main.interface.ts'
import { Provider } from 'react-redux'
import { store } from './redux/store.ts'
import App from './App.tsx'
import InventoryCheck from './pages/inventorycheck.tsx'
import AuditeeFill from './pages/audteefill.tsx'
import AuditorFill from './pages/audtorfill.tsx'
import SummerizeGoods from './pages/summerizegoods.tsx'
const context: ContextInterface = {
  appname: 'IT TEMPLATE',
  style: {
    baseColorText: 'text-[#1990ff]'
  }
}
export const ThemeContext = createContext<ContextInterface>({});
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeContext.Provider value={context}>
      <Provider store={store}>
        <SummerizeGoods />
      </Provider>
    </ThemeContext.Provider>
  </React.StrictMode>,
)
