import { LoginByInterface, LoginData, LoginInterface } from '@/interface/login.interface';
import { ThemeContext } from '@/main';
import { persistor } from '@/redux/store';
import { API_LOGIN_EMPLOYEE } from '@/service/login.service';
import axios from 'axios';
import { KeyboardEvent, useContext, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo-daikin-with-text.jpg'
import { AiOutlineLogin } from "react-icons/ai";
import { Input, Button, Checkbox, Alert, InputRef, Tag } from 'antd';
import {
  CloseCircleOutlined
} from '@ant-design/icons';
import Marquee from "react-fast-marquee";
function Login() {
  const [login, setLogin] = useState<LoginInterface>({
    login: false,
    load: false,
    message: '',
  })
  const base = import.meta.env.VITE_PATH;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loginData, setLoginData] = useState<LoginData>({
    user: '',
    pass: ''
  });

  const refUser = useRef<InputRef>(null);
  const refPass = useRef<InputRef>(null);
  
  async function handleLogin() {
    if (loginData.user == '' || loginData.pass == '') {
      if (loginData.user == '') {
        refUser.current?.focus();
        setLogin({ ...login, load: false, message: `กรุณากรอกชื่อผู้ใช้` });
        return false;
      }
      if (loginData.pass == '') {
        refPass.current?.focus();
        setLogin({ ...login, load: false, message: `กรุณากรอกรหัสผ่าน` });
        return false;
      }
      return false;
    }
    if (loginData.user != '' && loginData.user != '') {
      setLogin({ ...login, load: true });
      if (loginData.user.length < 5) {
        refUser.current?.focus();
        setLogin({ ...login, load: false, message: `ชื่อผู้ใช้ต้องมีความยาวอย่างน้อย 5 ตัวอักษร` });
        return false;
      }
      let resLogin = await API_LOGIN_EMPLOYEE(loginData.user);
      console.log(resLogin)
      if (typeof resLogin.status != 'undefined' && resLogin.status != 404 && resLogin != "") {
        setTimeout(() => {
          if (typeof resLogin.empcode != 'undefined' && resLogin.empcode != '') {
            dispatch({
              type: 'LOGIN', payload: {
                code: resLogin.empcode,
                name: resLogin.name,
                fullname: resLogin.fullname,
                pren: resLogin.pren,
                surn: resLogin.surn,
                login: true
              }
            });
            setLogin({ ...login, load: false, message: ``, login: true });
          } else {
            loginAD();
            // setLogin({ ...login, load: false, message: `ไม่สามารถเข้าสู่ระบบได้ เนื่องจาก : ไม่พบข้อมูลพนักงานของคุณ (${loginData.user})` });
          }
        }, 1000);
      } else {
        loginAD();
        // setLogin({ ...login, load: false, message: `${resLogin?.message} (${resLogin?.status})` });
      }

    } else {
      refUser.current?.focus();
      setLogin({ ...login, load: false, message: `กรุณากรอกชื่อผู้ใช้งานและรหัสผ่าน` });
    }

  }

  const loginAD = async () => {
    axios.get('http://websrv01.dci.daikin.co.jp/BudgetCharts/BudgetRestService/api/authen?username=' + loginData.user + '&password=' + encodeURIComponent(loginData.pass)).then((res) => {
      if (res.data[0]?.FullName != null) {
        try {
          persistor.purge();
          dispatch({
            type: 'LOGIN', payload: {
              code: res.data[0].EmpCode,
              name: res.data[0].ShortName,
              fullname: res.data[0].FullName,
              pren: "",
              surn: res.data[0].FullName.substring((res.data[0].FullName).indexOf(' ')),
              login: true
            }
          });
          setLogin({ ...login, load: false, message: ``, login: true });
        } catch (e: any) {
          setLogin({ ...login, load: false, message: `ไม่สามารถเข้าสู่ระบบได้ เนื่องจาก :  ${e.message}` });
        }
      } else {
        setLogin({ ...login, load: false, message: `ไม่สามารถเข้าสู่ระบบได้ เนื่องจาก : ไม่พบข้อมูลพนักงานของคุณ (${loginData.user})` });
      }
    }).catch((err) => {
      setLogin({ ...login, load: false, message: `ไม่สามารถเข้าสู่ระบบได้ เนื่องจาก : ${err?.message} (${err?.status})` });
    });
  }
  useEffect(() => {
    if (login.login == true) {
      navigate(`../${base}/home`)
    }
  }, [login])
  useEffect(() => {
    if (loginData.user != "" || loginData.pass != "") {
      setLogin({ ...login, message: "" });
    }
  }, [loginData])
  return (
    <div className='flex items-center justify-center h-full'>
      <div className='flex flex-col gap-3 w-[30%]'>
        <div id="title" className='py-[25px]'>
          <span className='font-bold text-2xl'>LOGIN</span>
        </div>
        <div id="username" className='flex flex-col gap-1'>
          <span className='text-gray-500 font-semibold'>Username</span>
          <Input ref={refUser} type='text' placeholder='Enter username' autoFocus onChange={(e) => setLoginData({ ...loginData, user: e.target.value })} />
        </div>
        <div id="password" className='flex flex-col gap-1 '>
          <div className='flex flex-col gap-1'>
            <span className='text-gray-500 font-semibold'>Password</span>
            <Input ref={refPass} type='password' placeholder='Enter password' onChange={(e) => setLoginData({ ...loginData, pass: e.target.value })} />
          </div>
          <Checkbox checked={true}>Remember Password</Checkbox>
        </div>
        <div id="action" className='flexitems-center justify-center pt-[10px]'>
          <Button type='primary' className='w-full' onClick={handleLogin} loading={login.load}>Login</Button>
        </div>
        {
          login.message != "" && <Tag icon={<CloseCircleOutlined />} color="#cd201f">
            {login.message}
          </Tag>
        }
        <div id="other" className='flex items-center gap-1'>
          <small>Don't have an account?</small>
          <p className='text-sky-600'>Sign up</p>
        </div>
        <Alert
          banner
          message={
            <Marquee pauseOnHover gradient={false}>
              สามารถเข้าสู่ระบบด้วย ชื่อและรหัสผ่านสำหรับเข้าเครื่องของคุณ หรือ รหัสพนักงานของคุณ
            </Marquee>
          }
        />
      </div>
    </div>
  )
}

export default Login