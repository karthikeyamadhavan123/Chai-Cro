import './index.css';
import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Protected from './Protected/Protected';
import Logout from './Forms/Logout';
import CreateShop from './Shops/CreateShop.jsx';
import AdminProtection from './Protected/AdminProtection.jsx';
import AddProducts from './Products/AddProducts.jsx';
import EditShopForm from './Shops/EditShopForm.jsx';
import CreateProduct from './Products/CreateProduct.jsx';
const LazyHeroSection = React.lazy(() => import('./Components/HeroSection'));
const LazyRegister = React.lazy(() => import('./Forms/Register'));
const LazyLogin = React.lazy(() => import('./Forms/Login'));
const LazyForgot = React.lazy(() => import('./Forms/ForgotPassword'));
const LazyReset = React.lazy(() => import('./Forms/ResetPassword'));
const LazyAbout = React.lazy(() => import('./Components/About'));
const LazyVendors = React.lazy(() => import('./Components/Vendors'));
const LazyShop = React.lazy(() => import('./Shops/Shop'));
const LazyContact = React.lazy(() => import('./Components/Contact'));
const LazyShopproducts=React.lazy(()=>import ('./Shops/ShopProducts.jsx'))
const LazySingleProductsView=React.lazy(()=>import ('./Products/Products.jsx'))
const LazyCart=React.lazy(()=>import('./Cart/Cart.jsx'))

function App() {
    return (
        <div className="App">
            <HelmetProvider>
                <BrowserRouter>
                    <Suspense fallback={<div>Loading...</div>}>
                        <Routes>
                            <Route path='/' element={<LazyHeroSection />} />
                            <Route path='/api/register' element={<LazyRegister />} />
                            <Route path='/api/login' element={<LazyLogin />} />
                            <Route path='/api/forgot-password' element={<LazyForgot />} />
                            <Route path='/api/reset-password/:token' element={<LazyReset />} />
                            <Route path='/about' element={<LazyAbout />} />
                            <Route path='/contact' element={<LazyContact />} />
                            <Route path='/vendors' element={<LazyVendors />} />
                            <Route path='/api/logout' element={<Logout />} />

                            <Route path='/shop'>
                                <Route index element={<Protected Comp={LazyShop} />} /> 
                                <Route path='new' element={<AdminProtection Comp={CreateShop} />} />
                                <Route path=':id/products' element={<Protected Comp={LazyShopproducts}/>}/>
                                <Route path=':id/addproducts' element={<AdminProtection Comp={AddProducts}/>}/>
                                <Route path='products/:productid' element={<AdminProtection Comp={LazySingleProductsView}/>}/>
                                <Route path=':shopId/edit' element={<AdminProtection Comp={EditShopForm}/>}/>
                            </Route>
                            <Route path=':shopId/product/new' element={<AdminProtection Comp={CreateProduct}/>}></Route>
                           <Route path='/shop/:productId/product-information' element={<Protected Comp={LazySingleProductsView}/>}/>
                           <Route path='/cart' element={<Protected Comp={LazyCart}/>}/>
                        </Routes>
                    </Suspense>
                </BrowserRouter>
            </HelmetProvider>
        </div >
    );
}

export default App;

// We've created a parent 'shop' route without an element
// The original '/shop' route is now an index route under the parent
// The 'new' route is a child of the parent 'shop' route

// This structure allows both routes to exist independently while sharing the same URL structure