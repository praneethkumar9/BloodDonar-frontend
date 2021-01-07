import React , {Fragment} from 'react';
const Layout = (props)=>{
    return (
        <Fragment>
            <header>
                <span>Blood Banks </span>
                <span>Login</span>
            </header>
            <main>
            {props.children}
            </main>
         <footer>
             <center><h2>A blood donar organization</h2></center>
         </footer>
        </Fragment>
    )

}

export default Layout;