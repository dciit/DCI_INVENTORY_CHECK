import { LoginData, LoginInterface } from '@/interface/login.interface';
import imgCheck from "../assets/checkstock-removebg-preview.png"
import { API_LOGIN_EMPLOYEE } from '@/service/login.service';
import { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
import { Button, Input, InputRef } from 'antd';
import {
  LockOutlined,
  UserOutlined
} from '@ant-design/icons';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';


function Login() {

  const [login, setLogin] = useState<LoginInterface>({
    login: false,
    load: false,
    message: '',
  })

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loginData, setLoginData] = useState<LoginData>({
    ParamUser: '',
    ParamPass: ''
  });

  const refUser = useRef<InputRef>(null);
  const refPass = useRef<InputRef>(null);


  const notifyErr = (msg: string) => {
    toast.error(`Err : ${msg}`);
  };

  const notifyOk = (msg: string) => {
    toast.success(`Ok : ${msg}`);
  };

  async function handleLogin() {
    if (loginData.ParamUser == '' || loginData.ParamPass == '') {
      if (loginData.ParamUser == '') {
        refUser.current?.focus();
        setLogin({ ...login, load: false, message: `กรุณากรอกชื่อผู้ใช้` });
        return false;
      }
      if (loginData.ParamPass == '') {
        refPass.current?.focus();
        setLogin({ ...login, load: false, message: `กรุณากรอกรหัสผ่าน` });
        return false;
      }
      return false;
    }

    if (loginData.ParamUser != '' && loginData.ParamPass != '') {


      const oRole = ['ADMIN','AUDITEE','AUDITOR'];
      let resLogin = await API_LOGIN_EMPLOYEE(loginData.ParamUser, loginData.ParamPass);
      
      if (resLogin != null) {
        if(resLogin.code == null){
          notifyErr('ไม่สามารถเข้าสู่ระบบได้ เนื่องจากรหัสพนักงานนี้ ไม่ถูกต้อง')
          return false;
        }
        if(resLogin.role == null){
          notifyErr('ไม่สามารถเข้าสู่ระบบได้ เนื่องจาก Role ไม่ถูกต้อง')
          return false;
        }
        if (oRole.includes(resLogin.role)) {
          dispatch({
            type: 'LOGIN', payload: resLogin
          });

          notifyOk("Login Successfully");
          navigate(`/home`);
        } else {
          setLogin({ ...login, load: false, message: `ไม่สารถเข้าสู่ระบบได้` });
          notifyErr("ไม่สารถเข้าสู่ระบบได้");
        }
      } else {
        setLogin({ ...login, load: false, message: `ไม่สารถเข้าสู่ระบบได้` });
        notifyErr("ไม่สารถเข้าสู่ระบบได้");
      }


    } else {
      refUser.current?.focus();
      setLogin({ ...login, load: false, message: `กรุณากรอกชื่อผู้ใช้งานและรหัสผ่าน` });
      notifyErr("ไม่สารถเข้าสู่ระบบได้");
    }

  }

  useEffect(() => {
    if (login.login == true) {
    }
  }, [login])


  useEffect(() => {
    if (loginData.ParamUser != "" || loginData.ParamPass != "") {
      setLogin({ ...login, message: "" });
    }
  }, [loginData])


  return (
    <div className='flex items-center justify-center h-full bg-[#1E2A5E] min-h-screen px-4'>
      <div className="container rounded-2xl border shadow-lg p-5 text-center bg-[#FBFBFB] max-w-lg md:max-w-3xl">
        <div className='flex flex-col md:flex-row justify-around gap-3'>
          <img src={imgCheck} alt="" className='h-[150px] md:h-[35%] w-full md:w-[40%] object-contain' />
          <div className='flex flex-col w-full justify-center items-center gap-2 border border-gray-300 rounded-xl p-4'>
            <div className="p-3 text-2xl md:text-3xl font-bold text-black text-center">
              CHECK INVENTORY DAY
            </div>
            <form className='w-full max-w-md mt-5'>
              <div className='mb-6'>
                <div className='flex flex-col md:flex-row gap-2'>
                  <label
                    htmlFor="username"
                    className='p-3 border border-black rounded-md bg-[#FFF5D7] font-semibold text-black flex items-center gap-2'
                  >
                    <UserOutlined />
                    USERNAME
                  </label>
                  <Input
                    ref={refUser}
                    type='text'
                    id='username'
                    placeholder='Enter username'
                    autoFocus
                    className="w-full"
                    onChange={(e) => setLoginData({ ...loginData, ParamUser: e.target.value })}
                  />
                </div>
                <div className='mt-4'>
                  <div className='flex flex-col md:flex-row gap-2'>
                    <label
                      htmlFor="password"
                      className='p-3 border border-black rounded-md bg-[#FFF5D7] font-semibold text-black flex items-center gap-2'
                    >
                      <LockOutlined />
                      PASSWORD
                    </label>
                    <Input
                      ref={refPass}
                      type='password'
                      id='password'
                      placeholder='*******'
                      className="w-full"
                      onChange={(e) => setLoginData({ ...loginData, ParamPass: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </form>
            <div id="action" className='flex items-center justify-center pt-3 mt-3 w-full'>
              <Button
                className='text-black bg-[#D4EBF8] hover:bg-[#D4EBF8] focus:ring-3 focus:outline-none focus:ring-[#D4EBF8] font-bold rounded-lg border-black text-lg w-full sm:w-auto px-6 py-3 md:px-44 md:py-6 text-center'
                onClick={handleLogin}
              >
                Login
              </Button>
            </div>
          </div>
        </div>
      </div>
  <ToastContainer
    position="top-right"
    autoClose={3000}
    hideProgressBar={false}
    newestOnTop
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable={false}
    pauseOnHover={false}
    theme="light"
  />
</div>
  )
}

export default Login