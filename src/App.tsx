import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Input, Button, Checkbox } from 'antd';
import imgCheck from "./assets/checkstock-removebg-preview.png"

function App() {
  return (
    <div className='flex items-center justify-center h-full bg-[#1E2A5E]'>
      <div className="container rounded-2xl border shadow-lg p-5 text-center bg-[#FBFBFB]">
        <div className='flex flex-row justify-around gap-3'>
          <img src={imgCheck} alt="" className='h-[35%] w-[40%]' />
          <div className='flex flex-col w-full justify-center items-center gap-2 border border-gray-300 rounded-xl'>
            <div className="p-3 text-3xl font-bold text-black text-center">
              CHECK INVENTORY DAY
            </div>
            <form className='w-full max-w-2xl  mt-7'>
              <div className='mb-6'>
                <div className='flex flex-nowrap gap-2'>
                  <label
                    htmlFor="username"
                    className='p-3 border border-black rounded-md bg-[#FFF5D7] font-semibold text-black flex items-center gap-2'
                  >
                    <UserOutlined />
                    USERNAME
                  </label>

                  <Input type='text' id='username' placeholder='Enter username' autoFocus />
                </div>
                <div className='mt-6'>
                  <div className='flex flex-nowrap gap-2'>
                    <label
                      htmlFor="password"
                      className='p-3 border border-black rounded-md bg-[#FFF5D7] font-semibold text-black flex items-center gap-2'
                    >
                      <LockOutlined />
                      PASSWORD
                    </label>
                    <Input type='password' id='password' placeholder='*******' />
                  </div>
                </div>
              </div>
            </form>
            <div id="action" className='flexitems-center justify-center pt-[10px] mt-3'>
              <button className='text-black bg-[#D4EBF8] hover:bg-[#D4EBF8] focus:ring-3 focus:outline-none focus:ring-[#D4EBF8] font-bold rounded-lg border-black text-lg w-full sm:w-auto px-44 py-3 text-center dark:bg-blue-900 dark:hover:bg-blue-900 dark:focus:ring-blue-900'>
                Login
              </button>
            </div>
          </div>
        </div>
        {/*  */}
      </div>
    </div>
  );
}

export default App;
