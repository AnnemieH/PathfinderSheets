import { NavLink } from "react-router-dom";

export default function Navbar()
{
    return(
        <>
        <NavLink to="/">
            <span className="Navbar">Home </span>
        </NavLink>
        <NavLink to="/edit">
            <span className="Navbar">Edit Buff</span>
        </NavLink>
        <NavLink to="/new">
            <span className="Navbar">Add New Item</span>
        </NavLink>
        </>
    )
}