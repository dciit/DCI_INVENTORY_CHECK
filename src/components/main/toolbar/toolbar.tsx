import { Avatar, Box,  Drawer, IconButton, Skeleton, Stack, Typography } from '@mui/material'
import React, {  useEffect, useState } from 'react'
import MenuComponent from './menu.toolbar'
import { useDispatch, useSelector } from 'react-redux';
// import logo from '../assets/logo.jpg'
import { useNavigate } from 'react-router-dom';
import DensityMediumIcon from '@mui/icons-material/DensityMedium';
import { imagepath, projectName } from '@/constants';
function ToolbarComponent() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const base = import.meta.env.VITE_PATH;
    const VITE_VERSION = import.meta.env.VITE_VERSION;
    const reducer = useSelector((state: any) => state.reducer);
    const empcode = reducer.code;
    const [openMenu, setOpenMenu] = React.useState<null | HTMLElement>(null);
    const open = Boolean(openMenu);
    const [openDrawer, setOpenDrawer] = React.useState(false);
    const [loadAccountContent, setLoadAccountContent] = useState<boolean>(true);
    const reduxCheck: string[] = ['login', 'name', 'surn']
    const redux = useSelector((state: any) => state.reducer);
    async function handleOpenMenu(event: React.MouseEvent<HTMLElement>) {
        setOpenMenu(event.currentTarget)
    }
    async function handleCloseMenu() {
        setOpenMenu(null);
    }
    async function handleLogout() {
        if (confirm('คุณต้องการออกจากระบบ ใช่หรือไม่ ? ')) {
            dispatch({ type: 'LOGOUT' });
            navigate(`/${base}/login`);
        }
    }
    const toggleDrawer = (newOpen: boolean) => () => {
        setOpenDrawer(newOpen);
    };
    const handleHome = () => {
        navigate(`/${base}/home`);
    }
    useEffect(() => {
        let check = true;
        console.log(Object.keys(redux))
        reduxCheck.map((o: string) => {
            if (!Object.keys(redux).includes(o)) {
                check = false;
            }
        });
        if(!check){
            dispatch({type:'LOGOUT'});
            setTimeout(() => {
                navigate(`/${base}/login`)
            }, 500);
        }else{
            setLoadAccountContent(false);
        }
    }, [])
    return (
        <div className='h-[50px] bg-white sticky top-0' style={{ borderBottom: '1px solid #ddd' }}>
            <Stack direction={'row'} justifyContent={'space-between'} className='h-full' alignContent={'center'}>
                <Stack direction={'row'} alignItems={'center'} spacing={3} pl={2}>
                    <div>
                        <IconButton onClick={toggleDrawer(true)}><DensityMediumIcon /></IconButton>
                        <Drawer open={openDrawer} onClose={toggleDrawer(false)}>
                            <Box width={'175px'}>
                                <Stack p={1} gap={1} className='cursor-pointer'>
                                    <Typography className='text-[14px]'>Module {VITE_VERSION}</Typography>
                                </Stack>
                            </Box>
                        </Drawer>
                    </div>
                </Stack>
                <Stack alignItems={'center'} spacing={1} direction={'row'} className='cursor-pointer select-none' >
                    <Typography className='font-bold uppercase  flex justify-center items-center text-[1.5em] text-[#00a0e4]  italic' onClick={handleHome}>{projectName}</Typography>
                </Stack>
                <Stack justifyContent={'center'} pr={2}>
                    {
                        loadAccountContent ? <Skeleton variant="rounded" width={210} height={30} /> : <div onClick={handleOpenMenu} className='flex items-center gap-2 cursor-pointer select-none' >
                            <Typography className=''>{
                                (reducer.login) ? `${reducer.name}.${reducer.surn.substring(0, 1)}` : '######'
                            }</Typography>
                            <Avatar sx={{ width: 36, height: 36 }} src={`${imagepath}${empcode}.jpg`}>{

                            }</Avatar>
                        </div>
                    }
                </Stack>
            </Stack>
            <MenuComponent open={open} openMenu={openMenu} closeMenu={handleCloseMenu} handleOpenMenu={handleOpenMenu} logout={handleLogout} />
        </div>
    )
}

export default ToolbarComponent