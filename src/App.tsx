import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Input, Button, Checkbox } from 'antd';

function App() {
  return (
    <div className='flex items-center justify-center h-full bg-[#D4EBF8]'>
      <div className='flex flex-col gap-3 w-[30%]'>
        <div className="container max-w-2xl w-full rounded-lg border border-black shadow-lg p-14 text-center bg-white">
          <div className="p-3 text-2xl font-bold text-black text-center">
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
            <button className='text-black bg-[#D4EBF8] hover:bg-[#D4EBF8] focus:ring-2 focus:outline-none focus:ring-[#D4EBF8] font-semibold rounded-lg border-black text-lg w-full sm:w-auto px-5 py-3 text-center dark:bg-blue-900 dark:hover:bg-blue-900 dark:focus:ring-blue-900'>
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
