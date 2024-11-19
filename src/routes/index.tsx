import { BrowserRouter, Route, Routes } from 'react-router-dom'
import routePaths from './routePath'
import PrivateRoute from './privateRoute'
import PublicRoute from './publicRoute'

const RouteMap = () => {
  return (
    <div>
        <BrowserRouter>
            <Routes>
                {
                    routePaths.map((item, id)=>{
                        if(item.isPrivate){
                            return <Route key={id} path={item.path} element={<PrivateRoute><item.components /></PrivateRoute>} />
                        } else {
                            return <Route key={id} path={item.path} element={<PublicRoute><item.components /></PublicRoute>} />
                        }
                    })
                }
            </Routes>
        </BrowserRouter>
    </div>
  )
}

export default RouteMap