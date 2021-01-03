## For eslint
1. VS Code기동용 windows 권한 변경 ([참고](https://ohdowon064.tistory.com/266#:~:text=some%20pointers-,VSCode%20%ED%84%B0%EB%AF%B8%EB%84%90%20%EC%98%A4%EB%A5%98%20%3A%20%EC%9D%B4%20%EC%8B%9C%EC%8A%A4%ED%85%9C%EC%97%90%EC%84%9C%20%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8%EB%A5%BC%20%EC%8B%A4%ED%96%89%ED%95%A0%20%EC%88%98,%EC%9D%84%20%EB%A1%9C%EB%93%9C%ED%95%A0%20%EC%88%98%20%EC%97%86%EC%8A%B5%EB%8B%88%EB%8B%A4.&text=vscode%EC%97%90%EC%84%9C%20%EB%AA%85%EB%A0%B9%EC%96%B4%EB%A5%BC%20%EC%8B%A4%ED%96%89,%EA%B6%8C%ED%95%9C%EC%9D%84%20%EB%B3%80%EA%B2%BD%ED%95%B4%EC%95%BC%ED%95%9C%EB%8B%A4.))
    1. windows pwershell 관리자 권한으로 실행
    1. 권한 설정
        ```bash
        get-help Set-ExecutionPolicy  # 권한 확인
        Set-ExecutionPolicy RemoteSigned  # 권한 변경
        ```
1. install eslint-plugin
    ```bash
    npm install eslint-plugin-prettier@latest --save-dev
    ```
1. client/node_modules 삭제
1. install
    ```bash
    npm install
    ```
1. eslint 실행
    ```bash
    eslint --fix src/**/*.ts
    ```

## For Production
```bash
$ ./docker-prod.sh up
$ ./docker-prod.sh down
```

## For Development
```bash
$ ./docker-dev.sh up
$ ./docker-dev.sh down
```

## Production과 Development환경의 차이점
### 구조
1. Production
```
Reverse Proxy(Nginx) <-> Web Server(Nginx + Builded Angular)
Reverse Proxy(Nginx) <-> Api Server(express.js) <-> MongoDB
Reverse Proxy(Nginx) <-> WebSocket Server(express.js)
```

2. Development
```
Web Server(Angular) <-> Api Server(express.js) <-> MongoDB
Web Server(Angular) <-> WebSocket Server(express.js)
```

### 포트
1. Production
```
Reverse Proxy(Nginx) : 80
Web Server(Nginx) : 8720
Api Server(express.js) : 7145
WebSocket Server(express.js) : 5417
MongoDB : 27017
```

2. Development
```
Web Server(Angular) : 4200
Api Server(express.js) : 3000
WebSocket Server(express.js) : 3001
MongoDB : 27017
```