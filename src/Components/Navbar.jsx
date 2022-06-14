import React from "react";
import { Paper, Box, Button, Link } from "@mui/material";

const Navbar = () => {
    return (
        <div className="navbar underline">
            <div className="navbar-content">
                <div className='nav-title'>
                    <Link href="/" 
                    sx={{color: 'black', textDecoration: 'none', transition: '0.3s',
                        "&:hover": {
                            color: "primary.main"
                        }
                    }}>
                        <h3>Cameron McGinley</h3>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Navbar;