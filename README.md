功能概述
该项目的主要用途是允许用户在谷歌浏览器中设置页面的自动刷新时间，用户可以选择随机刷新时间或者自定义刷新时间间隔。用户界面（`popup.html`）会提供相关的操作按钮和输入框，而`popup.js`中的代码则负责处理用户的操作，与浏览器的后台脚本（`background.js`）进行通信，以实现页面的自动刷新功能。

主要代码功能说明
1. **获取用户选择的刷新时间**：`getSelectedTime`函数会根据用户在界面上的选择（随机刷新或自定义刷新）来获取相应的刷新时间。如果用户选择随机刷新，会返回 -1；如果选择自定义刷新，会将用户输入的时间转换为秒数并进行有效性检查，若无效则会弹出提示信息。
2. **开始刷新操作**：`startRefresh`函数会调用`getSelectedTime`获取刷新时间，若时间有效，则会向浏览器的后台脚本发送`START_REFRESH`消息，同时更新界面上的按钮显示状态。
3. **停止刷新操作**：`stopRefresh`函数会向后台脚本发送`STOP_REFRESH`消息，并更新界面上的按钮显示状态。
4. **检查当前状态**：`checkStatus`函数会向后台脚本发送`GET_STATUS`消息，根据返回的状态信息更新界面上的按钮显示状态以及用户选择的刷新时间设置。

项目文件说明
- `popup.html`：提供用户操作界面，包含开始按钮、停止按钮、随机刷新和自定义刷新的单选框以及自定义刷新时间的输入框。
- `popup.js`：处理用户在`popup.html`中的操作，与浏览器后台脚本进行通信。
- `background.js`：作为浏览器的后台脚本，负责接收`popup.js`发送的消息，并根据消息类型执行相应的刷新操作。
- `manifest.json`：Chrome扩展的配置文件，定义了扩展的基本信息、权限以及包含的文件等。
- `images/`：存放项目中使用的图片资源。
- `.git/`：Git版本控制的相关文件夹，用于管理项目的版本信息。





<img width="408" alt="截屏2025-02-23 13 41 45" src="https://github.com/user-attachments/assets/07277142-1a7b-494c-9553-6c5fd24408ce" />
















<img width="326" alt="截屏2025-02-23 13 42 20" src="https://github.com/user-attachments/assets/2a41aecf-93a4-48ad-ab43-2a0b212ef988" />
