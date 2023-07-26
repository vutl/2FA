import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [codeUser,setcodeUser] = useState(''); 
  const [codeUserSecret,setcodeUserSecret] = useState(''); // cần 2 code do User nhập vào do có tới 2 chỗ trống để điền User code
  const [codeInput,setcodeInput] = useState(''); // sử dụng codeInput để mỗi khi user click vào nút lấy code, phần mềm mới nhận code để fetch ra data
  const [code2FA,setcode2FA] = useState(''); 
  const [code2FASecret,setcode2FASecret] = useState(''); 
  const [time,settime]= useState(0);

  const updateTimer =  async() => {
    await settime(30 - Math.round(new Date().valueOf() / 1e3) % 30); // do API render code mới mỗi 30 giây 
    if (codeUser !== '' || codeInput !== ''){
    await fetch(`https://tools.dongvanfb.net/api/get_2fa?secret=${codeUser}`).then(
    res => res.json()
    ).then(
      data => setcode2FA(data.code)
    )
    await fetch(`https://tools.dongvanfb.net/api/get_2fa?secret=${codeInput}`).then(
    res => res.json()
    ).then(
      data => setcode2FASecret(data.code)
    )
  }
}

  useEffect(() => {
    const intervalId = setInterval(updateTimer, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [codeUser,codeUserSecret]);

  const calculateFillWidth = () => {
  if (codeUser !== ''){
    return `${(time / 30) * 100}%` // 30 là số giây tối đa của thanh, hàm này quy đổi thời gian hiện tại thành số % của 30
  }
  else{
    return 0
  }
  };

  return (
    <div className="App">
        <div className="Header">Security Code Generator Google 2FA</div> 
        <div className="key">2FA KEY</div>
        <div className="box-2fa">
        <div className="enter2fa">
        <div>

          <input onChange={(event)=>{
            setcodeUser(event.target.value)
          }} id="ip1" type="text" placeholder="Nhập mã 2FA để get code tại đây"/>

          <p style={{fontSize: '13px',
                     paddingTop: '15px'}}>
                {codeUser === ''?(`Expires later: 0 second`):(`Expires later: ${time} second`)}
          </p>

            <div
              style={{
              width: '100%',
              height: '10px',
              marginTop: '5px',
              display: 'flex',
              overflow: 'hidden',
              fontSize: '.75rem',
              borderRadius: '.375rem',
              backgroundColor: '#e9ecef'
              }}
            >

            <div
              style={{
              width: calculateFillWidth(),
              height: '100%',
              backgroundColor: '#0b1b27',
              borderRadius: '4px'
            }}
        />

        </div>

    <div className="display-code" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      {codeUser === ''?(<div></div>):(<div>{code2FA}</div>)}
    </div>

    </div>
            <div className="FA">* 2FA secret</div>
                <input onChange={(event) => {setcodeInput(event.target.value)}} id="ip2" type="text" placeholder="Nhập SLL mã 2FA để get code tại đây"/>

                <button onClick={()=>{setcodeUserSecret(codeInput)}} type="submit" className="btn">Lấy code</button> {/* chỉ khi user ấn vào button codeUserSecret mới được thêm */}

                <div className="FA">* 2FA Code</div>

                <div className="code">
                  {codeUserSecret === ''?(<div></div>):(<div>{codeUserSecret}|{time}|{code2FASecret}
                </div>)}</div>

            </div>
          </div>
      </div>
  );
}

export default App;