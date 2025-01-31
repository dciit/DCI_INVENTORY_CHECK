import { Input, Button, Checkbox } from 'antd';

function App() {
  return (
    <div className='flex items-center justify-center h-full'>
      <div className='flex flex-col gap-3 w-[30%]'>
        <div className="container max-w-2xl w-full rounded border shadow-lg p-14 text-center bg-white">
          <div className="p-3 border bg-blue-900 text-2xl font-bold text-white text-center">
            CHECK INVENTORY DAY
          </div>
          <form className='w-full max-w-2xl  mt-7'>
            <div className='mb-6'>
              <div className='flex flex-nowrap gap-2'>
                <label 
                htmlFor="username"
                className='p-3 border bg-blue-900 text-lg font-semibold text-white items-center'
                >
                  USERNAME
                </label>
                <Input type='text' id='username' placeholder='Enter username' autoFocus />
              </div>
              <div className='mt-6'>
                <div className='flex flex-nowrap gap-2'>
                  <label 
                  htmlFor="password" 
                  className='p-3 border bg-blue-900 text-lg font-semibold text-white items-center'
                  >
                    PASSWORD
                  </label>
                  <Input type='password' id='password' placeholder='*******' />
                </div>
              </div>
            </div>
          </form>
          <div id="action" className='flexitems-center justify-center pt-[10px] mt-3'>
            <Button className='text-white bg-blue-900 hover:bg-blue-900 focus:ring-4 focus:outline-none focus:ring-blue-700 font-medium rounded-lg text-lg w-full sm:w-auto px-5 py-5 text-center dark:bg-blue-900 dark:hover:bg-blue-900 dark:focus:ring-blue-900'>Login</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
