import { Outlet } from "react-router-dom";
import Navigation from "./Navigation/Navigation";
import Footer from "./Footer/Footer";

function Layout() {
    return (
        <main className="App">
            <Navigation />
            <Outlet />
            <Footer />
        </main>
    );
}

export default Layout