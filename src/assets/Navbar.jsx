import { NavLink } from "react-router-dom";

export default function Navbar()
{
    return(
        <div id="NavbarDiv">
            <NavLink to="/">
                <span className="Navbar">Home </span>
            </NavLink>
            <NavLink to="/characters">
                <span className="Navbar">Characters</span>
            </NavLink>
            <NavLink to="/edit">
                <span className="Navbar">Edit Buff</span>
            </NavLink>
            <NavLink to="/new">
                <span className="Navbar">Add New Item</span>
            </NavLink>
        </div>
    )
}