let refreshTimers = new Map();
let currentSettings = new Map();

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const parts = [];
  if (h > 0) parts.push(`${h}h`);
  if (m > 0) parts.push(`${m}m`);
  if (s > 0 || parts.length === 0) parts.push(`${s}s`);
  return parts.join(' ');
}

function updateBadgeText(text, tabId) {
  chrome.action.setBadgeText({ text: text, tabId: tabId });
  chrome.action.setBadgeBackgroundColor({ color: '#6c5ce7', tabId: tabId });
}

async function startRefresh(settings, tabId) {
  try {
    stopRefresh(tabId);
    currentSettings.set(tabId, settings);
    
    // 验证标签页是否存在
    const tab = await chrome.tabs.get(tabId);
    if (!tab) {
      throw new Error('Target tab not found');
    }
    
    const startTime = Date.now();
    const totalMilliseconds = settings.seconds * 1000;
    
    updateBadgeText(formatTime(settings.seconds), tabId);
    
    const timer = setInterval(async () => {
      try {
        const elapsedTime = Date.now() - startTime;
        const remainingTime = totalMilliseconds - elapsedTime;
        
        if (remainingTime <= 0) {
          clearInterval(timer);
          refreshTimers.delete(tabId);
          
          // 刷新页面
          await chrome.tabs.reload(tabId);
          
          // 计算下一次刷新的时间
          const newSeconds = settings.isRandom ? 
            (Math.floor(Math.random() * (1800 - 5 + 1)) + 5) : settings.seconds;
          
          // 启动新的刷新周期
          await startRefresh({ ...settings, seconds: newSeconds }, tabId);
          return;
        }
        
        const remainingSeconds = Math.ceil(remainingTime / 1000);
        updateBadgeText(formatTime(remainingSeconds), tabId);
      } catch (error) {
        console.error('Error in refresh timer:', error);
        updateBadgeText('!', tabId);
        stopRefresh(tabId);
      }
    }, 1000);
    
    refreshTimers.set(tabId, timer);
  } catch (error) {
    console.error('Error starting refresh:', error);
    updateBadgeText('!', tabId);
    stopRefresh(tabId);
  }
}

function stopRefresh(tabId) {
  const timer = refreshTimers.get(tabId);
  if (timer) {
    clearInterval(timer);
    refreshTimers.delete(tabId);
  }
  currentSettings.delete(tabId);
  updateBadgeText('', tabId);
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'START_REFRESH') {
    startRefresh(message.settings, message.tabId);
    sendResponse({ success: true });
  } else if (message.type === 'STOP_REFRESH') {
    stopRefresh(message.tabId);
    sendResponse({ success: true });
  } else if (message.type === 'GET_STATUS') {
    const tabId = message.tabId;
    sendResponse({
      isRefreshing: refreshTimers.has(tabId),
      currentSettings: currentSettings.get(tabId)
    });
  }
  return true;
});

chrome.tabs.onRemoved.addListener((tabId) => {
  stopRefresh(tabId);
});