// // import { LockOutlined, UserOutlined } from '@ant-design/icons';
// // import { Input, Button, Checkbox, InputRef } from 'antd';
// // import imgCheck from "./assets/checkstock-removebg-preview.png"
// // import { useRef, useState } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import { useDispatch } from 'react-redux';
// // import { LoginData, LoginInterface } from './interface/login.interface';
// // import { API_LOGIN_EMPLOYEE } from './service/login.service';

// // function App() {


// //   const [login, setLogin] = useState<LoginInterface>({
// //     login: false,
// //     load: false,
// //     message: '',
// //   })
// //   const base = import.meta.env.VITE_PATH;
// //   const navigate = useNavigate();
// //   const dispatch = useDispatch();
// //   const [loginData, setLoginData] = useState<LoginData>({
// //     user: '',
// //     pass: ''
// //   });

// //   const refUser = useRef<InputRef>(null);
// //   const refPass = useRef<InputRef>(null);
  
// //   async function handleLogin() {
// //     if (loginData.user == '' || loginData.pass == '') {
// //       if (loginData.user == '') {
// //         refUser.current?.focus();
// //         setLogin({ ...login, load: false, message: `กรุณากรอกชื่อผู้ใช้` });
// //         return false;
// //       }
// //       if (loginData.pass == '') {
// //         refPass.current?.focus();
// //         setLogin({ ...login, load: false, message: `กรุณากรอกรหัสผ่าน` });
// //         return false;
// //       }
// //       return false;
// //     }
// //     if (loginData.user != '' && loginData.user != '') {
// //       setLogin({ ...login, load: true });
// //       if (loginData.user.length < 5) {
// //         refUser.current?.focus();
// //         setLogin({ ...login, load: false, message: `ชื่อผู้ใช้ต้องมีความยาวอย่างน้อย 5 ตัวอักษร` });
// //         return false;
// //       }
// //       let resLogin = await API_LOGIN_EMPLOYEE(loginData.user, loginData.pass);
// //       console.log(resLogin)
// //       if (typeof resLogin.status != 'undefined' && resLogin.status != 404 && resLogin != "") {
// //         setTimeout(() => {
// //           if (typeof resLogin.empcode != 'undefined' && resLogin.empcode != '') {
// //             dispatch({
// //               type: 'LOGIN', payload: {
// //                 code: resLogin.empcode,
// //                 name: resLogin.name,
// //                 fullname: resLogin.fullname,
// //                 pren: resLogin.pren,
// //                 surn: resLogin.surn,
// //                 login: true
// //               }
// //             });
// //             setLogin({ ...login, load: false, message: ``, login: true });
// //           } else {
// //             loginAD();
// //             // setLogin({ ...login, load: false, message: `ไม่สามารถเข้าสู่ระบบได้ เนื่องจาก : ไม่พบข้อมูลพนักงานของคุณ (${loginData.user})` });
// //           }
// //         }, 1000);
// //       } else {
// //         loginAD();
// //         // setLogin({ ...login, load: false, message: `${resLogin?.message} (${resLogin?.status})` });
// //       }

// //     } else {
// //       refUser.current?.focus();
// //       setLogin({ ...login, load: false, message: `กรุณากรอกชื่อผู้ใช้งานและรหัสผ่าน` });
// //     }

// //   }

// //   const loginAD = async () => {
// //     axios.get('http://websrv01.dci.daikin.co.jp/BudgetCharts/BudgetRestService/api/authen?username=' + loginData.user + '&password=' + encodeURIComponent(loginData.pass)).then((res) => {
// //       if (res.data[0]?.FullName != null) {
// //         try {
// //           persistor.purge();
// //           dispatch({
// //             type: 'LOGIN', payload: {
// //               code: res.data[0].EmpCode,
// //               name: res.data[0].ShortName,
// //               fullname: res.data[0].FullName,
// //               pren: "",
// //               surn: res.data[0].FullName.substring((res.data[0].FullName).indexOf(' ')),
// //               login: true
// //             }
// //           });
// //           setLogin({ ...login, load: false, message: ``, login: true });
// //         } catch (e: any) {
// //           setLogin({ ...login, load: false, message: `ไม่สามารถเข้าสู่ระบบได้ เนื่องจาก :  ${e.message}` });
// //         }
// //       } else {
// //         setLogin({ ...login, load: false, message: `ไม่สามารถเข้าสู่ระบบได้ เนื่องจาก : ไม่พบข้อมูลพนักงานของคุณ (${loginData.user})` });
// //       }
// //     }).catch((err) => {
// //       setLogin({ ...login, load: false, message: `ไม่สามารถเข้าสู่ระบบได้ เนื่องจาก : ${err?.message} (${err?.status})` });
// //     });
// //   }
// //   useEffect(() => {
// //     if (login.login == true) {
// //       navigate(`../${base}/home`)
// //     }
// //   }, [login])
// //   useEffect(() => {
// //     if (loginData.user != "" || loginData.pass != "") {
// //       setLogin({ ...login, message: "" });
// //     }
// //   }, [loginData])

  
//   return (
//     <div className='flex items-center justify-center h-full bg-[#1E2A5E]'>
//       <div className="container rounded-2xl border shadow-lg p-5 text-center bg-[#FBFBFB]">
//         <div className='flex flex-row justify-around gap-3'>
//           <img src={imgCheck} alt="" className='h-[35%] w-[40%]' />
//           <div className='flex flex-col w-full justify-center items-center gap-2 border border-gray-300 rounded-xl'>
//             <div className="p-3 text-3xl font-bold text-black text-center">
//               CHECK INVENTORY DAY
//             </div>
//             <form className='w-full max-w-2xl  mt-7'>
//               <div className='mb-6'>
//                 <div className='flex flex-nowrap gap-2'>
//                   <label
//                     htmlFor="username"
//                     className='p-3 border border-black rounded-md bg-[#FFF5D7] font-semibold text-black flex items-center gap-2'
//                   >
//                     <UserOutlined />
//                     USERNAME
//                   </label>

//                   <Input
//                      ref={refUser}
//                      type='text' 
//                      id='username' 
//                      placeholder='Enter username' 
//                      autoFocus 
//                      onChange={(e) => setLoginData({ ...loginData, ParamUser: e.traget.value })}
//                     />
//                 </div>
//                 <div className='mt-6'>
//                   <div className='flex flex-nowrap gap-2'>
//                     <label
//                       htmlFor="password"
//                       className='p-3 border border-black rounded-md bg-[#FFF5D7] font-semibold text-black flex items-center gap-2'
//                     >
//                       <LockOutlined />
//                       PASSWORD
//                     </label>
//                     <Input 
//                         ref={refPass}
//                         type='password' 
//                         id='password' 
//                         placeholder='*******' 
//                         onChange={(e) => setLoginData({ ...loginData, ParamPass: e.target.value})}
//                         />
//                   </div>
//                 </div>
//               </div>
//             </form>
//             <div id="action" className='flexitems-center justify-center pt-[10px] mt-3'>
//               <button 
//                 className='text-black bg-[#D4EBF8] hover:bg-[#D4EBF8] focus:ring-3 focus:outline-none focus:ring-[#D4EBF8] font-bold rounded-lg border-black text-lg w-full sm:w-auto px-44 py-3 text-center dark:bg-blue-900 dark:hover:bg-blue-900 dark:focus:ring-blue-900'
//                 onClick={handleLogin}
//                 loading={login.load}
//                 >
//                 Login
//               </button>
//             </div>
//           </div>
//         </div>
//         {/*  */}
//       </div>
//     </div>
//   );
// // }

// // export default App;
