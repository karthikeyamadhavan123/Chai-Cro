import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React, { Suspense } from 'react';
import { HelmetProvider } from 'react-helmet-async';
const LazyHeroSection = React.lazy(() => import('./Components/Herosection'));
const LazyAbout = React.lazy(() => import('./ContactPages/About'))
const LazyVendors = React.lazy(() => import('./ContactPages/Vendor'))
const LazyContact = React.lazy(() => import('./ContactPages/Contact'))
const LazyRegister = React.lazy(() => import('./Forms/Register'))
const LazyLogin = React.lazy(() => import('./Forms/Login'))
const LazyForgotPassword = React.lazy(() => import('./Forms/ForgotPassword'))
const LazyResetPassword = React.lazy(() => import('./Forms/ResetPassword'))
const LazyLogout = React.lazy(() => import('./Forms/Logout'))
const LazyProfile = React.lazy(() => import('./Profile/Profile.jsx'))
const LazyShop = React.lazy(() => import('./Shop/shop'))
const LazyShopProducts = React.lazy(() => import('./Products/main'))
const LazyCreateShops=React.lazy(()=>import('./Shop/CreateShop'))
const LazyCreateProduct=React.lazy(()=>import('./Products/CreateProduct'))
import Protected from './Protected Routes/Protected';
const LazyShopComments=React.lazy(()=>import('./Shop/ShopComments'))
const LazyShopRatings=React.lazy(()=>import('./Shop/ShopRating'))
import AdminProtection from './Protected Routes/AdminProtection';
import Cart from './Cart/Cart';
import placeOrder from './Cart/placeOrder';
const LazyProductComment=React.lazy(()=>import('./Products/ProductComment'))
const LazyProductRating=React.lazy(()=>import('./Products/ProductRating'))
const SinglePage=React.lazy(()=>import('./Products/SingleProductPage'))
function App() {
  return (
    <>
      <HelmetProvider>
        <BrowserRouter>
          <Suspense>
            <Routes>
              <Route path='/' element={<LazyHeroSection />} />
              <Route path='/about' element={<LazyAbout />} />
              <Route path='/vendors' element={<LazyVendors />} />
              <Route path='/contact' element={<LazyContact />} />
              <Route path='/api'>
                <Route path='register' element={<LazyRegister />} />
                <Route path='login' element={<LazyLogin />} />
                <Route path='forgot-password' element={<LazyForgotPassword />} />
                <Route path='reset-password/:token' element={<LazyResetPassword />} />
                <Route path='logout' element={<LazyLogout />} />
              </Route>
              <Route path='/shop'
              >
                <Route index element={< Protected Component={LazyShop} />} />
                <Route path=':id/products' element={< Protected Component={LazyShopProducts} />} />
                <Route path='new' element={< AdminProtection Component={LazyCreateShops} />} />
                <Route path=':id/new' element={<AdminProtection Component={LazyCreateProduct}/>}/>
                <Route path=':shopId/comments' element={<Protected Component={LazyShopComments}/>}/>
                <Route path=':shopId/ratings' element={<Protected Component={LazyShopRatings}/>}/>
              </Route>
              <Route path='/product-comments/:productId/comments' element={<Protected Component={LazyProductComment}/>}/>
              <Route path='/product-ratings/:productId/ratings' element={<Protected Component={LazyProductRating}/>}/>
              <Route path='/my-profile' element={<LazyProfile />} />
              <Route path=':productId/product-information' element={<Protected Component={SinglePage}/>} />
              <Route path='/cart' element={<Protected Component={Cart}/>}/>
              <Route path='/order' element={<Protected Component={placeOrder}/>}/>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </HelmetProvider>
    </>
  )
}
export default App;

// We've created a parent 'shop' route without an element
// The original '/shop' route is now an index route under the parent
// The 'new' route is a child of the parent 'shop' route

// This structure allows both routes to exist independently while sharing the same URL structure