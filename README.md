# medical

> 界面框架使用elementUI，webpack配置proxy进行反向代理，从而进行前后端分离开发 

>药店管理系统，包含登录、药品查询、药品购物车、结算、交易、员工账号管理等模块

> 项目重写 但是没有上线，个人重构，部分功能没有实现，导出功能、卡号登录没有实现，
>    >不能说的秘密2


## 项目结构
```
src
|-- assets
|-- components
|  └── Aside.vue
|  └── changePwd.vue
|  └── Header.vue
|  └── orderDetail.vue
|  └── search.vue
|-- router
|    └── index.js
|-- view
|    └── cashier
|    |    └── index.vue
|    └── countMange
|    |    └── index.vue
|    └── home
|    |    └── index.vue
|    └── jiesuan
|    |    └── index.vue
|    └── log
|    |    └── index.vue
|    └── login
|    |    └── index.vue
|    └──transc
|        └── index.vue
|-- App.vue
|-- main.js

```

## 项目构建

``` bash
# 安装依赖包
npm install

# 启动本地服务器  默认端口访问localhost:8080
npm run dev

# 构建项目打包
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
## 项目线上地址
[demo链接](http://medical.jibahui.com/#/login)