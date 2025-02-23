let isRefreshing = false;
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const customRadio = document.getElementById('custom');
const randomRadio = document.getElementById('random');
const minutesInput = document.getElementById('minutes');

stopButton.style.display = 'none';

function getSelectedTime() {
  if (randomRadio.checked) {
    return -1; // 表示随机时间
  } else if (customRadio.checked) {
    const seconds = parseInt(minutesInput.value);
    if (isNaN(seconds) || seconds < 1) {
      alert('请输入有效的时间（至少1秒）');
      return null;
    }
    return seconds;
  } else {
    alert('请选择刷新时间');
    return null;
  }
}

async function startRefresh() {
  const seconds = getSelectedTime();
  if (seconds === null) return;

  isRefreshing = true;
  startButton.style.display = 'none';
  stopButton.style.display = 'block';
  
  const tabs = await chrome.tabs.query({active: true, currentWindow: true});
  if (tabs.length > 0) {
    await chrome.runtime.sendMessage({
      type: 'START_REFRESH',
      settings: {
        seconds: seconds,
        isRandom: seconds === -1
      },
      tabId: tabs[0].id
    });
  }
}

async function stopRefresh() {
  const tabs = await chrome.tabs.query({active: true, currentWindow: true});
  if (tabs.length > 0) {
    await chrome.runtime.sendMessage({
      type: 'STOP_REFRESH',
      tabId: tabs[0].id
    });
  }
  isRefreshing = false;
  startButton.style.display = 'block';
  stopButton.style.display = 'none';
}

async function checkStatus() {
  const tabs = await chrome.tabs.query({active: true, currentWindow: true});
  if (tabs.length > 0) {
    const response = await chrome.runtime.sendMessage({
      type: 'GET_STATUS',
      tabId: tabs[0].id
    });
    
    if (response.isRefreshing) {
      isRefreshing = true;
      startButton.style.display = 'none';
      stopButton.style.display = 'block';
      
      const settings = response.currentSettings;
      if (settings) {
        if (settings.isRandom) {
          randomRadio.checked = true;
        } else {
          customRadio.checked = true;
          minutesInput.value = settings.seconds;
        }
      }
    }
  }
}

startButton.addEventListener('click', startRefresh);
stopButton.addEventListener('click', stopRefresh);

// 在popup打开时检查当前标签页的状态
checkStatus();