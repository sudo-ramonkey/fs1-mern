import React, { useState } from 'react'
import { IconButton, Popover, PopoverContent } from '@carbon/react';
import { ChevronDownOutline } from '@carbon/icons-react';
import "./HeaderTooltip.css"
function HeaderTooltip(props) {
    const { name } = props;
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <div
            style={{ display: 'flex', alignItems: 'center' }}
            onMouseEnter={handleOpen}
            onMouseLeave={handleClose}
            onClick={handleOpen}
            tabIndex={0}
            onFocus={handleOpen}
            onBlur={handleClose}
        >
            <Popover
                align="bottom-left"
                isTabTip
                open={open}
                onRequestClose={handleClose}
            >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span
                        style={{ marginRight: 8, fontSize: '1.2rem', cursor: 'pointer' }}
                        onClick={handleOpen}
                        tabIndex={0}
                    >
                        {name}
                    </span>
                    <IconButton
                        onClick={handleOpen}
                        style={{ backgroundColor: '#727D73' }}
                        size="sm"
                        tabIndex={-1}
                        
                    >
                        <ChevronDownOutline />
                    </IconButton>
                </div>
                <PopoverContent className="p-3">
                    <div className='PopOverContent'>
                        <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                            <li>HOLA</li>
                            <li>HOLA</li>
                            <li>HOLA</li>
                            <li>HOLA</li>
                            <li>HOLA</li>
                        </ul>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    )
}

export default HeaderTooltip