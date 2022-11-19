import AutoAwesomeMotionIcon from '@mui/icons-material/AutoAwesomeMotion';
import BackspaceIcon from '@mui/icons-material/Backspace';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import * as React from 'react';



export default function NestedList({positions ,setPositions, coordone, coordtwo , groupcoord, setCoordone, setCoordtwo, setGroupcoord , datas, setDatas}) {
    const [open, setOpen] = React.useState(true);
    
    const handleClick = () => {
        setOpen(!open);
    };
    
    const eraseLists = () => {
        console.log("hello")
        setPositions([])
        setCoordone([])
        setCoordtwo([])
        setGroupcoord([])
        setDatas([])
    }


    return (
        <div className=''>

            <List
                sx={{ width: '100%', maxWidth: 600, bgcolor: 'background.paper', minWidth: 200 }}
                component="nav"
                aria-labelledby="nested-list-subheader"
                subheader={
                    <ListSubheader component="div" id="nested-list-subheader">
                        Command
                    </ListSubheader>
                }
            >
                <ListItemButton>
                    <ListItemIcon>
                        <DirectionsBikeIcon o />
                    </ListItemIcon>
                    <ListItemText primary="Find bikes" />
                </ListItemButton>
                <ListItemButton onClick={eraseLists}>
                    <ListItemIcon>
                        <BackspaceIcon />
                    </ListItemIcon>
                    <ListItemText primary="Erase Position" />
                </ListItemButton>
                <ListItemButton onClick={handleClick}>
                    <ListItemIcon>
                        <AutoAwesomeMotionIcon />
                    </ListItemIcon>
                    <ListItemText primary="Other" />
                    {open ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItemButton sx={{ pl: 4 }} >
                            <ListItemIcon>
                                <FilterAltIcon />
                            </ListItemIcon>
                            <ListItemText primary="Filter" />
                        </ListItemButton>
                    </List>
                </Collapse>
            </List>
        </div>
    );
}
